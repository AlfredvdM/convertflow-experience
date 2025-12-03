"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { GameConfig } from "@/types/gameConfig";

const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const COIN_SIZE = 25;
const PLAYER_SPEED = 7;
const COIN_FALL_SPEED = 3;
const COIN_SPAWN_RATE = 800;

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Coin {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
}

type GameState = "start" | "playing" | "gameover";

export default function CoinCollectorGame({ config }: { config: GameConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("start");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const gameStateRef = useRef<GameState>("start");
  const scoreRef = useRef(0);
  const timeLeftRef = useRef(30);
  const playerRef = useRef<Player>({
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT - 70,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
  });
  const coinsRef = useRef<Coin[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  const lastCoinSpawnRef = useRef(0);
  const gameStartTimeRef = useRef(0);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const interpolate = useCallback(
    (text: string) => {
      return text.replace(/\{companyName\}/g, config.brand.name);
    },
    [config.brand.name]
  );

  const initGame = useCallback(() => {
    playerRef.current = {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT - 70,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
    };
    coinsRef.current = [];
    setScore(0);
    setTimeLeft(30);
    lastCoinSpawnRef.current = 0;
    gameStartTimeRef.current = 0;
  }, []);

  const checkCollision = (a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }): boolean => {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current.add(key);

      if (e.key === " ") {
        e.preventDefault();
        if (gameStateRef.current === "start") {
          initGame();
          setGameState("playing");
          gameStartTimeRef.current = Date.now();
        } else if (gameStateRef.current === "gameover") {
          initGame();
          setGameState("playing");
          gameStartTimeRef.current = Date.now();
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
  }, [initGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const gameLoop = (timestamp: number) => {
      const player = playerRef.current;
      const coins = coinsRef.current;
      const keys = keysRef.current;

      if (gameStateRef.current === "playing") {
        // Update timer
        const elapsed = (Date.now() - gameStartTimeRef.current) / 1000;
        const newTimeLeft = Math.max(0, 30 - Math.floor(elapsed));
        if (newTimeLeft !== timeLeftRef.current) {
          setTimeLeft(newTimeLeft);
        }

        if (newTimeLeft <= 0) {
          setGameState("gameover");
        }

        // Player movement
        if (keys.has("arrowleft") || keys.has("a")) {
          player.x -= PLAYER_SPEED;
        }
        if (keys.has("arrowright") || keys.has("d")) {
          player.x += PLAYER_SPEED;
        }

        player.x = Math.max(player.width / 2, Math.min(GAME_WIDTH - player.width / 2, player.x));

        // Spawn coins
        if (timestamp - lastCoinSpawnRef.current > COIN_SPAWN_RATE) {
          const randomX = Math.random() * (GAME_WIDTH - COIN_SIZE * 2) + COIN_SIZE;
          coins.push({
            x: randomX,
            y: -COIN_SIZE,
            width: COIN_SIZE,
            height: COIN_SIZE,
            active: true,
          });
          lastCoinSpawnRef.current = timestamp;
        }

        // Update coins
        for (let i = coins.length - 1; i >= 0; i--) {
          const coin = coins[i];
          if (!coin.active) continue;

          coin.y += COIN_FALL_SPEED;

          // Check collision with player
          if (checkCollision(player, coin)) {
            coin.active = false;
            coins.splice(i, 1);
            setScore((s) => s + 10);
          } else if (coin.y > GAME_HEIGHT) {
            coins.splice(i, 1);
          }
        }
      }

      // Render
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      const isPrimaryValid = /^#[0-9A-F]{6}$/i.test(config.brand.primaryColor);
      const isSecondaryValid = /^#[0-9A-F]{6}$/i.test(config.brand.secondaryColor);

      if (isPrimaryValid) {
        ctx.fillStyle = config.brand.primaryColor + "30";
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
        ctx.save();
        ctx.font = "bold 28px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(interpolate(config.copy.startHeadline), GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40);

        ctx.font = "16px -apple-system, sans-serif";
        ctx.fillStyle = "#aaaaaa";
        ctx.fillText("Arrow keys to move • Catch the coins!", GAME_WIDTH / 2, GAME_HEIGHT / 2);

        const pulse = Math.sin(timestamp / 300) * 0.3 + 0.7;
        ctx.globalAlpha = pulse;
        ctx.font = "bold 18px -apple-system, sans-serif";
        ctx.fillStyle = isPrimaryValid ? config.brand.primaryColor : "#ffcc00";
        ctx.fillText("PRESS SPACE TO START", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60);
        ctx.restore();
      } else if (gameStateRef.current === "playing") {
        // Draw player (basket)
        ctx.save();
        const playerColor = isPrimaryValid ? config.brand.primaryColor : "#00d4ff";
        ctx.fillStyle = playerColor;
        ctx.shadowColor = playerColor;
        ctx.shadowBlur = 10;
        ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
        ctx.restore();

        // Draw coins
        for (const coin of coins) {
          if (!coin.active) continue;

          ctx.save();
          const coinColor = isSecondaryValid ? config.brand.secondaryColor : "#FFD700";
          ctx.fillStyle = coinColor;
          ctx.shadowColor = coinColor;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(coin.x, coin.y, coin.width / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Draw UI
        ctx.save();
        ctx.font = "bold 20px -apple-system, sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`SCORE: ${scoreRef.current}`, 20, 30);

        ctx.textAlign = "right";
        ctx.fillStyle = "#ff9900";
        ctx.fillText(`TIME: ${timeLeftRef.current}s`, GAME_WIDTH - 20, 30);
        ctx.restore();
      } else if (gameStateRef.current === "gameover") {
        ctx.save();
        ctx.fillStyle = "rgba(10, 10, 15, 0.9)";
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        ctx.font = "bold 36px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ff9900";
        ctx.shadowColor = "#ff9900";
        ctx.shadowBlur = 15;
        ctx.fillText("TIME'S UP!", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50);

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
        className="block w-full h-auto rounded-xl"
        style={{
          maxWidth: "100%",
          backgroundColor: "#0a0a0f",
        }}
      />
    </div>
  );
}
