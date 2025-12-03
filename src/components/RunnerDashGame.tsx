"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { GameConfig } from "@/types/gameConfig";

const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 40;
const OBSTACLE_WIDTH = 30;
const OBSTACLE_HEIGHT = 40;
const GROUND_Y = 320;
const GRAVITY = 0.6;
const JUMP_POWER = -12;
const GAME_SPEED = 4;
const OBSTACLE_SPAWN_RATE = 1800;

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
}

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isJumping: boolean;
}

type GameState = "start" | "playing" | "gameover";

export default function RunnerDashGame({ config }: { config: GameConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("start");
  const [score, setScore] = useState(0);

  const gameStateRef = useRef<GameState>("start");
  const scoreRef = useRef(0);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const playerRef = useRef<Player>({
    x: 100,
    y: GROUND_Y,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    velocityY: 0,
    isJumping: false,
  });
  const lastObstacleSpawnRef = useRef(0);
  const distanceRef = useRef(0);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const interpolate = useCallback(
    (text: string) => {
      return text.replace(/\{companyName\}/g, config.brand.name);
    },
    [config.brand.name]
  );

  const initGame = useCallback(() => {
    obstaclesRef.current = [];
    playerRef.current = {
      x: 100,
      y: GROUND_Y,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      velocityY: 0,
      isJumping: false,
    };
    setScore(0);
    distanceRef.current = 0;
    lastObstacleSpawnRef.current = 0;
  }, []);

  const checkCollision = (player: Player, obstacle: Obstacle): boolean => {
    return (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        if (gameStateRef.current === "start") {
          initGame();
          setGameState("playing");
        } else if (gameStateRef.current === "playing") {
          const player = playerRef.current;
          if (!player.isJumping) {
            player.velocityY = JUMP_POWER;
            player.isJumping = true;
          }
        } else if (gameStateRef.current === "gameover") {
          initGame();
          setGameState("playing");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [initGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const gameLoop = (timestamp: number) => {
      const obstacles = obstaclesRef.current;
      const player = playerRef.current;

      if (gameStateRef.current === "playing") {
        // Update player physics
        player.velocityY += GRAVITY;
        player.y += player.velocityY;

        // Ground collision
        if (player.y >= GROUND_Y) {
          player.y = GROUND_Y;
          player.velocityY = 0;
          player.isJumping = false;
        }

        // Spawn obstacles
        if (timestamp - lastObstacleSpawnRef.current > OBSTACLE_SPAWN_RATE) {
          const obstacleHeight = OBSTACLE_HEIGHT + Math.random() * 20;
          obstacles.push({
            x: GAME_WIDTH,
            y: GROUND_Y + PLAYER_HEIGHT - obstacleHeight,
            width: OBSTACLE_WIDTH,
            height: obstacleHeight,
            active: true,
          });
          lastObstacleSpawnRef.current = timestamp;
        }

        // Update obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
          const obstacle = obstacles[i];
          if (!obstacle.active) continue;

          obstacle.x -= GAME_SPEED;

          // Check collision
          if (checkCollision(player, obstacle)) {
            setGameState("gameover");
          }

          // Remove if off screen
          if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
            setScore((s) => s + 10);
          }
        }

        // Update distance score
        distanceRef.current += GAME_SPEED / 10;
      }

      // Render
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      const isPrimaryValid = /^#[0-9A-F]{6}$/i.test(config.brand.primaryColor);
      const isSecondaryValid = /^#[0-9A-F]{6}$/i.test(config.brand.secondaryColor);
      const isAccentValid = /^#[0-9A-F]{6}$/i.test(config.brand.accentColor);

      if (isPrimaryValid) {
        ctx.fillStyle = config.brand.primaryColor + "30";
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      }

      // Draw ground
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + PLAYER_HEIGHT);
      ctx.lineTo(GAME_WIDTH, GROUND_Y + PLAYER_HEIGHT);
      ctx.stroke();

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
        ctx.save();
        ctx.font = "bold 28px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(interpolate(config.copy.startHeadline), GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40);

        ctx.font = "16px -apple-system, sans-serif";
        ctx.fillStyle = "#aaaaaa";
        ctx.fillText("Press SPACE to jump over obstacles!", GAME_WIDTH / 2, GAME_HEIGHT / 2);

        const pulse = Math.sin(timestamp / 300) * 0.3 + 0.7;
        ctx.globalAlpha = pulse;
        ctx.font = "bold 18px -apple-system, sans-serif";
        ctx.fillStyle = isPrimaryValid ? config.brand.primaryColor : "#ffcc00";
        ctx.fillText("PRESS SPACE TO START", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60);
        ctx.restore();
      } else if (gameStateRef.current === "playing") {
        // Draw player
        ctx.save();
        const playerColor = isPrimaryValid ? config.brand.primaryColor : "#00d4ff";
        ctx.fillStyle = playerColor;
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Player outline
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(player.x, player.y, player.width, player.height);

        // Player eye
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(player.x + player.width - 10, player.y + 8, 6, 6);
        ctx.restore();

        // Draw obstacles
        for (const obstacle of obstacles) {
          if (!obstacle.active) continue;

          ctx.save();
          const obstacleColor = isAccentValid ? config.brand.accentColor : "#ff0055";
          ctx.fillStyle = obstacleColor;
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

          // Obstacle outline
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          ctx.restore();
        }

        // Draw UI
        ctx.save();
        ctx.font = "bold 20px -apple-system, sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`SCORE: ${scoreRef.current}`, 20, 30);

        ctx.textAlign = "right";
        ctx.fillStyle = "#00ddff";
        ctx.fillText(`DISTANCE: ${Math.floor(distanceRef.current)}m`, GAME_WIDTH - 20, 30);
        ctx.restore();
      } else if (gameStateRef.current === "gameover") {
        // Draw final player and obstacles in background
        ctx.globalAlpha = 0.3;

        // Draw player
        const playerColor = isPrimaryValid ? config.brand.primaryColor : "#00d4ff";
        ctx.fillStyle = playerColor;
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Draw obstacles
        for (const obstacle of obstacles) {
          const obstacleColor = isAccentValid ? config.brand.accentColor : "#ff0055";
          ctx.fillStyle = obstacleColor;
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }

        ctx.globalAlpha = 1;

        ctx.save();
        ctx.fillStyle = "rgba(10, 10, 15, 0.9)";
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        ctx.font = "bold 36px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ff0055";
        ctx.shadowColor = "#ff0055";
        ctx.shadowBlur = 15;
        ctx.fillText("CRASHED!", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50);

        ctx.font = "bold 24px -apple-system, sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 0;
        ctx.fillText(interpolate(config.copy.endWinHeadline), GAME_WIDTH / 2, GAME_HEIGHT / 2);

        ctx.font = "20px -apple-system, sans-serif";
        ctx.fillStyle = "#aaaaaa";
        ctx.fillText(`Final Score: ${scoreRef.current}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40);

        const pulse2 = Math.sin(timestamp / 300) * 0.3 + 0.7;
        ctx.globalAlpha = pulse2;
        ctx.font = "bold 16px -apple-system, sans-serif";
        ctx.fillStyle = isPrimaryValid ? config.brand.primaryColor : "#ffcc00";
        ctx.fillText("PRESS SPACE TO PLAY AGAIN", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 90);
        ctx.restore();
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [config, interpolate]);

  return (
    <div className="device-frame">
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="block w-full h-auto rounded-xl cursor-pointer"
        style={{
          maxWidth: "100%",
          backgroundColor: "#0a0a0f",
        }}
      />
    </div>
  );
}
