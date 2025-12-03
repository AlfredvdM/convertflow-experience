"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { GameConfig } from "@/types/gameConfig";

const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const TARGET_SIZE = 40;
const TARGET_SPAWN_RATE = 1200;
const TARGET_SPEED = 2;

interface Target {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  active: boolean;
}

type GameState = "start" | "playing" | "gameover";

export default function TargetShooterGame({ config }: { config: GameConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("start");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const gameStateRef = useRef<GameState>("start");
  const scoreRef = useRef(0);
  const timeLeftRef = useRef(30);
  const targetsRef = useRef<Target[]>([]);
  const lastTargetSpawnRef = useRef(0);
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
    targetsRef.current = [];
    setScore(0);
    setTimeLeft(30);
    lastTargetSpawnRef.current = 0;
    gameStartTimeRef.current = 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = (e: MouseEvent) => {
      if (gameStateRef.current !== "playing") return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = GAME_WIDTH / rect.width;
      const scaleY = GAME_HEIGHT / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      // Check if clicked on a target
      const targets = targetsRef.current;
      for (let i = targets.length - 1; i >= 0; i--) {
        const target = targets[i];
        if (!target.active) continue;

        const dist = Math.sqrt((x - target.x) ** 2 + (y - target.y) ** 2);
        if (dist < target.size / 2) {
          target.active = false;
          targets.splice(i, 1);
          setScore((s) => s + 15);
          break;
        }
      }
    };

    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      const targets = targetsRef.current;

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

        // Spawn targets
        if (timestamp - lastTargetSpawnRef.current > TARGET_SPAWN_RATE) {
          const side = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
          let x, y, speedX, speedY;

          if (side === 0) {
            // Top
            x = Math.random() * GAME_WIDTH;
            y = -TARGET_SIZE;
            speedX = (Math.random() - 0.5) * TARGET_SPEED * 2;
            speedY = TARGET_SPEED;
          } else if (side === 1) {
            // Right
            x = GAME_WIDTH + TARGET_SIZE;
            y = Math.random() * GAME_HEIGHT;
            speedX = -TARGET_SPEED;
            speedY = (Math.random() - 0.5) * TARGET_SPEED * 2;
          } else if (side === 2) {
            // Bottom
            x = Math.random() * GAME_WIDTH;
            y = GAME_HEIGHT + TARGET_SIZE;
            speedX = (Math.random() - 0.5) * TARGET_SPEED * 2;
            speedY = -TARGET_SPEED;
          } else {
            // Left
            x = -TARGET_SIZE;
            y = Math.random() * GAME_HEIGHT;
            speedX = TARGET_SPEED;
            speedY = (Math.random() - 0.5) * TARGET_SPEED * 2;
          }

          targets.push({
            x,
            y,
            size: TARGET_SIZE,
            speedX,
            speedY,
            active: true,
          });
          lastTargetSpawnRef.current = timestamp;
        }

        // Update targets
        for (let i = targets.length - 1; i >= 0; i--) {
          const target = targets[i];
          if (!target.active) continue;

          target.x += target.speedX;
          target.y += target.speedY;

          // Remove if off screen
          if (
            target.x < -TARGET_SIZE ||
            target.x > GAME_WIDTH + TARGET_SIZE ||
            target.y < -TARGET_SIZE ||
            target.y > GAME_HEIGHT + TARGET_SIZE
          ) {
            targets.splice(i, 1);
          }
        }
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
        ctx.fillText("Click to shoot moving targets!", GAME_WIDTH / 2, GAME_HEIGHT / 2);

        const pulse = Math.sin(timestamp / 300) * 0.3 + 0.7;
        ctx.globalAlpha = pulse;
        ctx.font = "bold 18px -apple-system, sans-serif";
        ctx.fillStyle = isPrimaryValid ? config.brand.primaryColor : "#ffcc00";
        ctx.fillText("PRESS SPACE TO START", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60);
        ctx.restore();
      } else if (gameStateRef.current === "playing") {
        // Draw targets
        for (const target of targets) {
          if (!target.active) continue;

          ctx.save();

          // Outer ring (accent color)
          const outerColor = isAccentValid ? config.brand.accentColor : "#ff0055";
          ctx.strokeStyle = outerColor;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(target.x, target.y, target.size / 2, 0, Math.PI * 2);
          ctx.stroke();

          // Middle ring (secondary color)
          const middleColor = isSecondaryValid ? config.brand.secondaryColor : "#ffcc00";
          ctx.strokeStyle = middleColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(target.x, target.y, target.size / 3, 0, Math.PI * 2);
          ctx.stroke();

          // Center dot
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(target.x, target.y, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        // Draw crosshair cursor hint
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);

        ctx.restore();

        // Draw UI
        ctx.save();
        ctx.font = "bold 20px -apple-system, sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`SCORE: ${scoreRef.current}`, 20, 30);

        ctx.textAlign = "right";
        ctx.fillStyle = "#00ddff";
        ctx.fillText(`TIME: ${timeLeftRef.current}s`, GAME_WIDTH - 20, 30);
        ctx.restore();
      } else if (gameStateRef.current === "gameover") {
        ctx.save();
        ctx.fillStyle = "rgba(10, 10, 15, 0.9)";
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        ctx.font = "bold 36px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#00ddff";
        ctx.shadowColor = "#00ddff";
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
        className="block w-full h-auto rounded-xl cursor-crosshair"
        style={{
          maxWidth: "100%",
          backgroundColor: "#0a0a0f",
        }}
      />
    </div>
  );
}
