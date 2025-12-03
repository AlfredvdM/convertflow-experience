"use client";

import { useEffect, useRef, useCallback, useState } from "react";

// =============================================================================
// GAME CONFIGURATION
// =============================================================================
const CONFIG = {
  // Canvas
  WIDTH: 640,
  HEIGHT: 480,

  // Player
  PLAYER_SIZE: 24,
  PLAYER_SPEED: 5,
  PLAYER_COLOR: "#00f5ff",

  // Collectibles
  COLLECTIBLE_SIZE: 16,
  COLLECTIBLE_COLOR: "#00ff88",
  COLLECTIBLE_SPAWN_RATE: 1500, // ms
  COLLECTIBLE_MAX: 8,

  // Enemies
  ENEMY_SIZE: 20,
  ENEMY_COLOR: "#ff00aa",
  ENEMY_SPAWN_RATE: 2000, // ms
  ENEMY_SPEED: 2,
  ENEMY_MAX: 6,

  // Game
  INITIAL_LIVES: 3,
  POINTS_PER_COLLECT: 10,
  INVINCIBILITY_TIME: 1500, // ms after being hit

  // Visuals
  BG_COLOR: "#0a0a0f",
  GRID_COLOR: "rgba(0, 245, 255, 0.05)",
  UI_COLOR: "#ffe600",
};

// =============================================================================
// TYPES
// =============================================================================
type GameState = "splash" | "playing" | "gameover";

interface Entity {
  x: number;
  y: number;
  size: number;
  vx?: number;
  vy?: number;
}

interface Player extends Entity {
  isInvincible: boolean;
  invincibleUntil: number;
}

interface Collectible extends Entity {
  pulsePhase: number;
}

interface Enemy extends Entity {
  angle: number;
  wobblePhase: number;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function checkCollision(a: Entity, b: Entity): boolean {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < (a.size + b.size) / 2;
}

function spawnAtEdge(): { x: number; y: number; vx: number; vy: number } {
  const side = Math.floor(Math.random() * 4);
  let x: number, y: number, vx: number, vy: number;

  const margin = 40;
  switch (side) {
    case 0: // top
      x = randomBetween(margin, CONFIG.WIDTH - margin);
      y = -20;
      vx = randomBetween(-1, 1) * CONFIG.ENEMY_SPEED;
      vy = CONFIG.ENEMY_SPEED;
      break;
    case 1: // right
      x = CONFIG.WIDTH + 20;
      y = randomBetween(margin, CONFIG.HEIGHT - margin);
      vx = -CONFIG.ENEMY_SPEED;
      vy = randomBetween(-1, 1) * CONFIG.ENEMY_SPEED;
      break;
    case 2: // bottom
      x = randomBetween(margin, CONFIG.WIDTH - margin);
      y = CONFIG.HEIGHT + 20;
      vx = randomBetween(-1, 1) * CONFIG.ENEMY_SPEED;
      vy = -CONFIG.ENEMY_SPEED;
      break;
    default: // left
      x = -20;
      y = randomBetween(margin, CONFIG.HEIGHT - margin);
      vx = CONFIG.ENEMY_SPEED;
      vy = randomBetween(-1, 1) * CONFIG.ENEMY_SPEED;
  }

  return { x, y, vx, vy };
}

// =============================================================================
// GAME COMPONENT
// =============================================================================
export default function CollectorGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("splash");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(CONFIG.INITIAL_LIVES);
  const [highScore, setHighScore] = useState(0);

  // Game state refs (to avoid stale closures in game loop)
  const gameStateRef = useRef<GameState>("splash");
  const scoreRef = useRef(0);
  const livesRef = useRef(CONFIG.INITIAL_LIVES);

  // Entity refs
  const playerRef = useRef<Player>({
    x: CONFIG.WIDTH / 2,
    y: CONFIG.HEIGHT / 2,
    size: CONFIG.PLAYER_SIZE,
    isInvincible: false,
    invincibleUntil: 0,
  });
  const collectiblesRef = useRef<Collectible[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);

  // Input state
  const keysRef = useRef<Set<string>>(new Set());

  // Timing refs
  const lastCollectibleSpawnRef = useRef(0);
  const lastEnemySpawnRef = useRef(0);
  const frameRef = useRef(0);

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

  // Reset game
  const resetGame = useCallback(() => {
    playerRef.current = {
      x: CONFIG.WIDTH / 2,
      y: CONFIG.HEIGHT / 2,
      size: CONFIG.PLAYER_SIZE,
      isInvincible: false,
      invincibleUntil: 0,
    };
    collectiblesRef.current = [];
    enemiesRef.current = [];
    setScore(0);
    setLives(CONFIG.INITIAL_LIVES);
    lastCollectibleSpawnRef.current = 0;
    lastEnemySpawnRef.current = 0;
  }, []);

  // Handle input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());

      if (e.key === " ") {
        e.preventDefault();
        if (gameStateRef.current === "splash") {
          resetGame();
          setGameState("playing");
        } else if (gameStateRef.current === "gameover") {
          resetGame();
          setGameState("playing");
        }
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
  }, [resetGame]);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const gameLoop = (timestamp: number) => {
      frameRef.current++;
      const player = playerRef.current;
      const collectibles = collectiblesRef.current;
      const enemies = enemiesRef.current;

      // =======================================================================
      // UPDATE PHASE
      // =======================================================================
      if (gameStateRef.current === "playing") {
        // Player movement
        const keys = keysRef.current;
        if (keys.has("arrowup") || keys.has("w")) {
          player.y -= CONFIG.PLAYER_SPEED;
        }
        if (keys.has("arrowdown") || keys.has("s")) {
          player.y += CONFIG.PLAYER_SPEED;
        }
        if (keys.has("arrowleft") || keys.has("a")) {
          player.x -= CONFIG.PLAYER_SPEED;
        }
        if (keys.has("arrowright") || keys.has("d")) {
          player.x += CONFIG.PLAYER_SPEED;
        }

        // Clamp player to canvas
        player.x = Math.max(
          player.size / 2,
          Math.min(CONFIG.WIDTH - player.size / 2, player.x)
        );
        player.y = Math.max(
          player.size / 2,
          Math.min(CONFIG.HEIGHT - player.size / 2, player.y)
        );

        // Check invincibility
        if (player.isInvincible && timestamp > player.invincibleUntil) {
          player.isInvincible = false;
        }

        // Spawn collectibles
        if (
          timestamp - lastCollectibleSpawnRef.current > CONFIG.COLLECTIBLE_SPAWN_RATE &&
          collectibles.length < CONFIG.COLLECTIBLE_MAX
        ) {
          collectibles.push({
            x: randomBetween(40, CONFIG.WIDTH - 40),
            y: randomBetween(40, CONFIG.HEIGHT - 40),
            size: CONFIG.COLLECTIBLE_SIZE,
            pulsePhase: Math.random() * Math.PI * 2,
          });
          lastCollectibleSpawnRef.current = timestamp;
        }

        // Spawn enemies
        if (
          timestamp - lastEnemySpawnRef.current > CONFIG.ENEMY_SPAWN_RATE &&
          enemies.length < CONFIG.ENEMY_MAX
        ) {
          const spawn = spawnAtEdge();
          enemies.push({
            ...spawn,
            size: CONFIG.ENEMY_SIZE,
            angle: Math.atan2(spawn.vy, spawn.vx),
            wobblePhase: Math.random() * Math.PI * 2,
          });
          lastEnemySpawnRef.current = timestamp;
        }

        // Update enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
          const enemy = enemies[i];
          enemy.x += enemy.vx!;
          enemy.y += enemy.vy!;
          enemy.wobblePhase += 0.1;

          // Remove if off screen
          if (
            enemy.x < -50 ||
            enemy.x > CONFIG.WIDTH + 50 ||
            enemy.y < -50 ||
            enemy.y > CONFIG.HEIGHT + 50
          ) {
            enemies.splice(i, 1);
          }
        }

        // Update collectible pulse
        for (const c of collectibles) {
          c.pulsePhase += 0.05;
        }

        // Check collectible collisions
        for (let i = collectibles.length - 1; i >= 0; i--) {
          if (checkCollision(player, collectibles[i])) {
            collectibles.splice(i, 1);
            setScore((s) => s + CONFIG.POINTS_PER_COLLECT);
          }
        }

        // Check enemy collisions
        if (!player.isInvincible) {
          for (const enemy of enemies) {
            if (checkCollision(player, enemy)) {
              setLives((l) => {
                const newLives = l - 1;
                if (newLives <= 0) {
                  setHighScore((hs) => Math.max(hs, scoreRef.current));
                  setGameState("gameover");
                }
                return newLives;
              });
              player.isInvincible = true;
              player.invincibleUntil = timestamp + CONFIG.INVINCIBILITY_TIME;
              break;
            }
          }
        }
      }

      // =======================================================================
      // RENDER PHASE
      // =======================================================================
      // Clear canvas with background
      ctx.fillStyle = CONFIG.BG_COLOR;
      ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

      // Draw grid
      ctx.strokeStyle = CONFIG.GRID_COLOR;
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x <= CONFIG.WIDTH; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CONFIG.HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y <= CONFIG.HEIGHT; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CONFIG.WIDTH, y);
        ctx.stroke();
      }

      // Draw border glow
      const gradient = ctx.createLinearGradient(0, 0, CONFIG.WIDTH, 0);
      gradient.addColorStop(0, "rgba(0, 245, 255, 0.3)");
      gradient.addColorStop(0.5, "rgba(255, 0, 170, 0.3)");
      gradient.addColorStop(1, "rgba(0, 255, 136, 0.3)");
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.strokeRect(2, 2, CONFIG.WIDTH - 4, CONFIG.HEIGHT - 4);

      if (gameStateRef.current === "splash") {
        // Splash screen
        ctx.save();

        // Title
        ctx.font = "bold 48px Orbitron, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = CONFIG.UI_COLOR;
        ctx.shadowColor = CONFIG.UI_COLOR;
        ctx.shadowBlur = 20;
        ctx.fillText("COLLECTOR", CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 60);

        // Subtitle
        ctx.font = "18px 'Space Mono', monospace";
        ctx.fillStyle = CONFIG.PLAYER_COLOR;
        ctx.shadowColor = CONFIG.PLAYER_COLOR;
        ctx.shadowBlur = 10;
        ctx.fillText("A ConvertFlow Arcade Game", CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 20);

        // Instructions
        ctx.font = "16px 'Space Mono', monospace";
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 0;
        ctx.fillText("Arrow keys or WASD to move", CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 40);

        // Pulsing start prompt
        const pulse = Math.sin(timestamp / 300) * 0.3 + 0.7;
        ctx.globalAlpha = pulse;
        ctx.font = "bold 20px Orbitron, sans-serif";
        ctx.fillStyle = CONFIG.COLLECTIBLE_COLOR;
        ctx.shadowColor = CONFIG.COLLECTIBLE_COLOR;
        ctx.shadowBlur = 15;
        ctx.fillText("PRESS SPACE TO START", CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 100);

        ctx.restore();
      } else if (gameStateRef.current === "playing") {
        // Draw collectibles
        for (const c of collectibles) {
          const pulse = Math.sin(c.pulsePhase) * 0.2 + 1;
          const size = c.size * pulse;

          ctx.save();
          ctx.translate(c.x, c.y);

          // Glow
          ctx.shadowColor = CONFIG.COLLECTIBLE_COLOR;
          ctx.shadowBlur = 15;

          // Diamond shape
          ctx.fillStyle = CONFIG.COLLECTIBLE_COLOR;
          ctx.beginPath();
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(size / 2, 0);
          ctx.lineTo(0, size / 2);
          ctx.lineTo(-size / 2, 0);
          ctx.closePath();
          ctx.fill();

          // Inner highlight
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(-size / 6, -size / 6, size / 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        // Draw enemies
        for (const e of enemies) {
          ctx.save();
          ctx.translate(e.x, e.y);
          ctx.rotate(e.angle + Math.sin(e.wobblePhase) * 0.2);

          // Glow
          ctx.shadowColor = CONFIG.ENEMY_COLOR;
          ctx.shadowBlur = 12;

          // Spiky shape
          ctx.fillStyle = CONFIG.ENEMY_COLOR;
          ctx.beginPath();
          const spikes = 6;
          const outerRadius = e.size / 2;
          const innerRadius = e.size / 4;
          for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes;
            if (i === 0) {
              ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            } else {
              ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            }
          }
          ctx.closePath();
          ctx.fill();

          // Evil eye
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(0, 0, e.size / 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.arc(2, 0, e.size / 10, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        // Draw player
        ctx.save();
        ctx.translate(player.x, player.y);

        // Blinking when invincible
        if (!player.isInvincible || Math.floor(timestamp / 100) % 2 === 0) {
          // Glow
          ctx.shadowColor = CONFIG.PLAYER_COLOR;
          ctx.shadowBlur = 20;

          // Main body (rounded square with face)
          ctx.fillStyle = CONFIG.PLAYER_COLOR;
          const halfSize = player.size / 2;
          ctx.beginPath();
          ctx.roundRect(-halfSize, -halfSize, player.size, player.size, 6);
          ctx.fill();

          // Face - eyes
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.arc(-halfSize / 2, -2, 3, 0, Math.PI * 2);
          ctx.arc(halfSize / 2, -2, 3, 0, Math.PI * 2);
          ctx.fill();

          // Smile
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 2, halfSize / 2, 0.2, Math.PI - 0.2);
          ctx.stroke();
        }

        ctx.restore();

        // Draw UI
        ctx.save();

        // Score
        ctx.font = "bold 24px Orbitron, sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = CONFIG.UI_COLOR;
        ctx.shadowColor = CONFIG.UI_COLOR;
        ctx.shadowBlur = 10;
        ctx.fillText(`SCORE: ${scoreRef.current}`, 20, 35);

        // Lives
        ctx.textAlign = "right";
        ctx.fillStyle = CONFIG.ENEMY_COLOR;
        ctx.shadowColor = CONFIG.ENEMY_COLOR;
        for (let i = 0; i < livesRef.current; i++) {
          ctx.fillText("♥", CONFIG.WIDTH - 20 - i * 30, 35);
        }

        ctx.restore();
      } else if (gameStateRef.current === "gameover") {
        // Game over screen
        ctx.save();

        // Overlay
        ctx.fillStyle = "rgba(10, 10, 15, 0.85)";
        ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Game Over text
        ctx.font = "bold 56px Orbitron, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = CONFIG.ENEMY_COLOR;
        ctx.shadowColor = CONFIG.ENEMY_COLOR;
        ctx.shadowBlur = 30;
        ctx.fillText("GAME OVER", CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 60);

        // Final score
        ctx.font = "bold 28px Orbitron, sans-serif";
        ctx.fillStyle = CONFIG.UI_COLOR;
        ctx.shadowColor = CONFIG.UI_COLOR;
        ctx.shadowBlur = 15;
        ctx.fillText(`FINAL SCORE: ${scoreRef.current}`, CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);

        // High score
        if (highScore > 0) {
          ctx.font = "18px 'Space Mono', monospace";
          ctx.fillStyle = CONFIG.COLLECTIBLE_COLOR;
          ctx.shadowColor = CONFIG.COLLECTIBLE_COLOR;
          ctx.shadowBlur = 10;
          ctx.fillText(`HIGH SCORE: ${highScore}`, CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 35);
        }

        // Restart prompt
        const pulse = Math.sin(timestamp / 300) * 0.3 + 0.7;
        ctx.globalAlpha = pulse;
        ctx.font = "bold 18px Orbitron, sans-serif";
        ctx.fillStyle = CONFIG.PLAYER_COLOR;
        ctx.shadowColor = CONFIG.PLAYER_COLOR;
        ctx.shadowBlur = 15;
        ctx.fillText("PRESS SPACE TO PLAY AGAIN", CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 90);

        ctx.restore();
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [highScore]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CONFIG.WIDTH}
        height={CONFIG.HEIGHT}
        className="block rounded-lg crt-glow scanlines"
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </div>
  );
}
