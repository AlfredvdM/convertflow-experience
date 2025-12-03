"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { GameConfig } from "@/types/gameConfig";

const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;

const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 20;
const ENEMY_SIZE = 20;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 10;

const ENEMY_FALL_SPEED = 2;
const BULLET_SPEED = 5;
const FIRE_COOLDOWN = 200;

interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Player extends Entity {
  speed: number;
}

interface Enemy extends Entity {
  active: boolean;
  lastHitBottom: number;
}

interface Bullet extends Entity {
  active: boolean;
}

type GameState = "start" | "playing" | "gameover";

export default function SpaceDefenderGame({ config }: { config: GameConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.settings.maxLives);
  const [showStartButton, setShowStartButton] = useState(true);

  // Refs for game loop
  const gameStateRef = useRef<GameState>("start");
  const scoreRef = useRef(0);
  const livesRef = useRef(config.settings.maxLives);
  const playerRef = useRef<Player>({
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT - 40,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    speed: config.settings.playerSpeed,
  });
  const enemiesRef = useRef<Enemy[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  const lastEnemySpawnRef = useRef(0);
  const lastFireRef = useRef(0);

  // Sync refs with state
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  // String interpolation
  const interpolate = useCallback(
    (text: string) => {
      return text.replace(/\{companyName\}/g, config.brand.name);
    },
    [config.brand.name]
  );

  // Initialize game
  const initGame = useCallback(() => {
    playerRef.current = {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT - 40,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      speed: config.settings.playerSpeed,
    };
    enemiesRef.current = [];
    bulletsRef.current = [];
    setScore(0);
    setLives(config.settings.maxLives);
    lastEnemySpawnRef.current = 0;
    lastFireRef.current = 0;
  }, [config.settings]);

  // Collision detection
  const checkCollision = (a: Entity, b: Entity): boolean => {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  };

  // Start game function
  const startGame = useCallback(() => {
    initGame();
    setGameState("playing");
    setShowStartButton(false);
  }, [initGame]);

  // Input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current.add(key);

      // Only prevent default spacebar during gameplay, not on start/gameover screens
      if (e.key === " " && gameStateRef.current === "playing") {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const gameLoop = (timestamp: number) => {
      const player = playerRef.current;
      const enemies = enemiesRef.current;
      const bullets = bulletsRef.current;
      const keys = keysRef.current;

      // =======================================================================
      // UPDATE PHASE
      // =======================================================================
      if (gameStateRef.current === "playing") {
        // Player movement
        if (keys.has("arrowleft") || keys.has("a")) {
          player.x -= player.speed;
        }
        if (keys.has("arrowright") || keys.has("d")) {
          player.x += player.speed;
        }

        // Clamp player to canvas
        player.x = Math.max(
          player.width / 2,
          Math.min(GAME_WIDTH - player.width / 2, player.x)
        );

        // Fire bullets
        if (keys.has(" ") && timestamp - lastFireRef.current > FIRE_COOLDOWN) {
          bullets.push({
            x: player.x - BULLET_WIDTH / 2,
            y: player.y - player.height / 2,
            width: BULLET_WIDTH,
            height: BULLET_HEIGHT,
            active: true,
          });
          lastFireRef.current = timestamp;
        }

        // Spawn enemies
        if (
          timestamp - lastEnemySpawnRef.current >
          config.settings.enemySpawnRate
        ) {
          const randomX = Math.random() * (GAME_WIDTH - ENEMY_SIZE - 40) + 20;
          enemies.push({
            x: randomX,
            y: -ENEMY_SIZE,
            width: ENEMY_SIZE,
            height: ENEMY_SIZE,
            active: true,
            lastHitBottom: 0,
          });
          lastEnemySpawnRef.current = timestamp;
        }

        // Update enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
          const enemy = enemies[i];
          if (!enemy.active) continue;

          enemy.y += ENEMY_FALL_SPEED;

          // Enemy reaches bottom
          if (
            enemy.y >= GAME_HEIGHT &&
            timestamp - enemy.lastHitBottom > 500
          ) {
            setLives((l) => {
              const newLives = l - 1;
              if (newLives <= 0) {
                setGameState("gameover");
              }
              return newLives;
            });

            // Respawn enemy
            enemy.y = -ENEMY_SIZE;
            enemy.x = Math.random() * (GAME_WIDTH - ENEMY_SIZE - 40) + 20;
            enemy.lastHitBottom = timestamp;
          }
        }

        // Update bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
          const bullet = bullets[i];
          if (!bullet.active) continue;

          bullet.y -= BULLET_SPEED;

          // Remove off-screen bullets
          if (bullet.y < -bullet.height) {
            bullets.splice(i, 1);
          }
        }

        // Check bullet-enemy collisions
        for (let i = bullets.length - 1; i >= 0; i--) {
          const bullet = bullets[i];
          if (!bullet.active) continue;

          for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            if (!enemy.active) continue;

            if (checkCollision(bullet, enemy)) {
              // Hit!
              bullet.active = false;
              bullets.splice(i, 1);

              // Respawn enemy
              enemy.y = -ENEMY_SIZE;
              enemy.x = Math.random() * (GAME_WIDTH - ENEMY_SIZE - 40) + 20;

              // Increment score
              setScore((s) => s + 10);
              break;
            }
          }
        }
      }

      // =======================================================================
      // RENDER PHASE
      // =======================================================================

      // Clear and draw background
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Brand color overlay (more prominent)
      const isPrimaryValid = /^#[0-9A-F]{6}$/i.test(config.brand.primaryColor);
      const isSecondaryValid = /^#[0-9A-F]{6}$/i.test(config.brand.secondaryColor);
      const isAccentValid = /^#[0-9A-F]{6}$/i.test(config.brand.accentColor);

      if (isPrimaryValid) {
        ctx.fillStyle = config.brand.primaryColor + "30"; // Increased opacity from 15 to 30
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      }

      // Grid background
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x <= GAME_WIDTH; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, GAME_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y <= GAME_HEIGHT; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(GAME_WIDTH, y);
        ctx.stroke();
      }

      if (gameStateRef.current === "start") {
        // Start screen
        ctx.save();

        // Headline
        ctx.font = "bold 28px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(
          interpolate(config.copy.startHeadline),
          GAME_WIDTH / 2,
          GAME_HEIGHT / 2 - 40
        );

        // Instructions
        ctx.font = "16px -apple-system, sans-serif";
        ctx.fillStyle = "#aaaaaa";
        ctx.fillText(
          "Arrow keys to move • Spacebar to shoot",
          GAME_WIDTH / 2,
          GAME_HEIGHT / 2 + 10
        );

        ctx.restore();
      } else if (gameStateRef.current === "playing") {
        // Draw player (using primary color)
        ctx.save();
        const playerColor = isPrimaryValid ? config.brand.primaryColor : "#00d4ff";
        ctx.fillStyle = playerColor;
        ctx.shadowColor = playerColor;
        ctx.shadowBlur = 10;
        ctx.fillRect(
          player.x - player.width / 2,
          player.y - player.height / 2,
          player.width,
          player.height
        );
        ctx.restore();

        // Draw enemies (using accent color)
        for (const enemy of enemies) {
          if (!enemy.active) continue;

          ctx.save();
          const enemyColor = isAccentValid ? config.brand.accentColor : "#ff0055";
          ctx.fillStyle = enemyColor;
          ctx.shadowColor = enemyColor;
          ctx.shadowBlur = 8;
          ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
          ctx.restore();
        }

        // Draw bullets (using secondary color)
        for (const bullet of bullets) {
          if (!bullet.active) continue;

          ctx.save();
          const bulletColor = isSecondaryValid ? config.brand.secondaryColor : "#00ff88";
          ctx.fillStyle = bulletColor;
          ctx.shadowColor = bulletColor;
          ctx.shadowBlur = 6;
          ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
          ctx.restore();
        }

        // Draw UI
        ctx.save();

        // Score
        ctx.font = "bold 20px -apple-system, sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`SCORE: ${scoreRef.current}`, 20, 30);

        // Lives
        ctx.textAlign = "right";
        ctx.fillStyle = "#ff0055";
        for (let i = 0; i < livesRef.current; i++) {
          ctx.fillText("♥", GAME_WIDTH - 20 - i * 25, 30);
        }

        ctx.restore();
      } else if (gameStateRef.current === "gameover") {
        // Game over screen
        ctx.save();

        // Overlay
        ctx.fillStyle = "rgba(10, 10, 15, 0.9)";
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Game Over
        ctx.font = "bold 36px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ff0055";
        ctx.shadowColor = "#ff0055";
        ctx.shadowBlur = 15;
        ctx.fillText("GAME OVER", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50);

        // End headline
        ctx.font = "bold 24px -apple-system, sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 0;
        ctx.fillText(
          interpolate(config.copy.endWinHeadline),
          GAME_WIDTH / 2,
          GAME_HEIGHT / 2
        );

        // Final score
        ctx.font = "20px -apple-system, sans-serif";
        ctx.fillStyle = "#aaaaaa";
        ctx.fillText(
          `Final Score: ${scoreRef.current}`,
          GAME_WIDTH / 2,
          GAME_HEIGHT / 2 + 40
        );

        ctx.restore();
        setShowStartButton(true);
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [config, interpolate]);

  return (
    <div className="device-frame relative">
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="block w-full h-auto rounded-xl"
        style={{
          maxWidth: "100%",
          backgroundColor: "#0a0a0f",
        }}
      />
      {(gameState === "start" || gameState === "gameover") && showStartButton && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={startGame}
            className="pointer-events-auto px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: config.brand.primaryColor,
              boxShadow: `0 4px 20px ${config.brand.primaryColor}40`,
            }}
          >
            {gameState === "start" ? "Start Game" : "Play Again"}
          </button>
        </div>
      )}
    </div>
  );
}
