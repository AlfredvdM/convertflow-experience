"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { GameConfig } from "@/types/gameConfig";

const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const CARD_WIDTH = 70;
const CARD_HEIGHT = 90;
const GRID_COLS = 4;
const GRID_ROWS = 4;
const GRID_OFFSET_X = (GAME_WIDTH - GRID_COLS * (CARD_WIDTH + 10)) / 2;
const GRID_OFFSET_Y = 60;
const CARD_BORDER_RADIUS = 16;

// Utility Functions
function adjustBrightness(hexColor: string, percent: number): string {
  const num = parseInt(hexColor.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + percent));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + percent));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Draw illustrated icon for card
function drawCardIcon(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
) {
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  // Check if it's an emoji
  const isEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(value);

  if (isEmoji) {
    // Draw emoji with glow effect
    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = color + "80";
    ctx.font = "32px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(value, centerX, centerY);
    ctx.restore();
  } else {
    // Draw illustrated icon for text (product names)
    ctx.save();

    // Glow background circle
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 25);
    glowGradient.addColorStop(0, color + "40");
    glowGradient.addColorStop(1, "transparent");
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
    ctx.fill();

    // Icon circle with gradient
    const iconGradient = ctx.createLinearGradient(centerX, centerY - 18, centerX, centerY + 18);
    iconGradient.addColorStop(0, color);
    iconGradient.addColorStop(1, adjustBrightness(color, -30));
    ctx.fillStyle = iconGradient;

    ctx.shadowBlur = 10;
    ctx.shadowColor = color + "60";
    ctx.beginPath();
    ctx.arc(centerX, centerY - 8, 18, 0, Math.PI * 2);
    ctx.fill();

    // Highlight on icon
    const highlightGradient = ctx.createRadialGradient(
      centerX - 5, centerY - 12, 0,
      centerX - 5, centerY - 12, 12
    );
    highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.6)");
    highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = highlightGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY - 8, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Text below icon
    const textLength = value.length;
    let fontSize = 9;
    if (textLength > 15) fontSize = 7;
    else if (textLength < 10) fontSize = 10;

    ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 3;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

    // Word wrap for long text
    const maxWidth = width - 10;
    const words = value.split(" ");
    let line = "";
    let lineY = centerY + 15;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line.trim(), centerX, lineY);
        line = words[i] + " ";
        lineY += fontSize + 2;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), centerX, lineY);

    ctx.restore();
  }
}

interface Card {
  id: number;
  value: string;
  x: number;
  y: number;
  isFlipped: boolean;
  isMatched: boolean;
  flipProgress?: number;
  matchProgress?: number;
}

type GameState = "start" | "playing" | "gameover";

export default function MemoryMatchGame({ config }: { config: GameConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("start");
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [showStartButton, setShowStartButton] = useState(true);

  const gameStateRef = useRef<GameState>("start");
  const scoreRef = useRef(0);
  const movesRef = useRef(0);
  const cardsRef = useRef<Card[]>([]);
  const flippedCardsRef = useRef<Card[]>([]);
  const canFlipRef = useRef(true);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
  }>>([]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  useEffect(() => {
    movesRef.current = moves;
  }, [moves]);

  // Load logo image
  useEffect(() => {
    if (config.brand.logoUrl) {
      const img = new Image();
      img.onload = () => setLogoImage(img);
      img.onerror = () => console.error("Failed to load logo");
      img.src = config.brand.logoUrl;
    }
  }, [config.brand.logoUrl]);

  const interpolate = useCallback(
    (text: string) => {
      return text.replace(/\{companyName\}/g, config.brand.name);
    },
    [config.brand.name]
  );

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initGame = useCallback(() => {
    // Use gameElements if available, otherwise fall back to emojis
    const baseSymbols = config.copy.gameElements && config.copy.gameElements.length > 0
      ? config.copy.gameElements.slice(0, 8)
      : ["🎯", "🚀", "💎", "⚡", "🎨", "🔥", "💰", "🌟"];

    const pairs = [...baseSymbols, ...baseSymbols];
    const shuffled = shuffleArray(pairs);

    const cards: Card[] = [];
    let id = 0;

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        cards.push({
          id: id,
          value: shuffled[id],
          x: GRID_OFFSET_X + col * (CARD_WIDTH + 10),
          y: GRID_OFFSET_Y + row * (CARD_HEIGHT + 10),
          isFlipped: false,
          isMatched: false,
          flipProgress: 0,
          matchProgress: 0,
        });
        id++;
      }
    }

    cardsRef.current = cards;
    flippedCardsRef.current = [];
    canFlipRef.current = true;
    particlesRef.current = [];
    setScore(0);
    setMoves(0);
  }, [config.copy.gameElements]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = (e: MouseEvent) => {
      if (gameStateRef.current !== "playing" || !canFlipRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = GAME_WIDTH / rect.width;
      const scaleY = GAME_HEIGHT / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      const cards = cardsRef.current;
      const flippedCards = flippedCardsRef.current;

      for (const card of cards) {
        if (
          x >= card.x &&
          x <= card.x + CARD_WIDTH &&
          y >= card.y &&
          y <= card.y + CARD_HEIGHT &&
          !card.isFlipped &&
          !card.isMatched
        ) {
          card.isFlipped = true;
          card.flipProgress = 0;
          flippedCards.push(card);

          if (flippedCards.length === 2) {
            canFlipRef.current = false;
            setMoves((m) => m + 1);

            setTimeout(() => {
              const [card1, card2] = flippedCards;

              if (card1.value === card2.value) {
                // Match! Create particles
                card1.isMatched = true;
                card2.isMatched = true;
                card1.matchProgress = 0;
                card2.matchProgress = 0;
                setScore((s) => s + 20);

                // Spawn celebration particles
                const particles = particlesRef.current;
                const isPrimaryValid = /^#[0-9A-F]{6}$/i.test(config.brand.primaryColor);
                const isSecondaryValid = /^#[0-9A-F]{6}$/i.test(config.brand.secondaryColor);
                const particleColor = isSecondaryValid ? config.brand.secondaryColor : "#818cf8";

                for (let i = 0; i < 12; i++) {
                  particles.push({
                    x: card1.x + CARD_WIDTH / 2,
                    y: card1.y + CARD_HEIGHT / 2,
                    vx: (Math.random() - 0.5) * 6,
                    vy: -Math.random() * 8 - 2,
                    life: 1.0,
                    color: particleColor,
                  });
                }

                const allMatched = cards.every((c) => c.isMatched);
                if (allMatched) {
                  setTimeout(() => {
                    setGameState("gameover");
                    setShowStartButton(true);
                  }, 800);
                }
              } else {
                card1.isFlipped = false;
                card2.isFlipped = false;
              }

              flippedCardsRef.current = [];
              canFlipRef.current = true;
            }, 1000);
          }

          break;
        }
      }
    };

    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, [config.brand.primaryColor, config.brand.secondaryColor]);

  const startGame = () => {
    setShowStartButton(false);
    initGame();
    setGameState("playing");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const gameLoop = (timestamp: number) => {
      const cards = cardsRef.current;
      const particles = particlesRef.current;

      // Enable high-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Validate colors
      const isPrimaryValid = /^#[0-9A-F]{6}$/i.test(config.brand.primaryColor);
      const isSecondaryValid = /^#[0-9A-F]{6}$/i.test(config.brand.secondaryColor);

      const primaryColor = isPrimaryValid ? config.brand.primaryColor : "#6366f1";
      const secondaryColor = isSecondaryValid ? config.brand.secondaryColor : "#818cf8";

      // Layer 1: Deep gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
      bgGradient.addColorStop(0, adjustBrightness(primaryColor, -50));
      bgGradient.addColorStop(1, adjustBrightness(primaryColor, -30));
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Layer 2: Radial atmospheric glow
      const glowGradient = ctx.createRadialGradient(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 3,
        0,
        GAME_WIDTH / 2,
        GAME_HEIGHT / 3,
        GAME_WIDTH * 0.8
      );
      glowGradient.addColorStop(0, secondaryColor + "30");
      glowGradient.addColorStop(1, "transparent");
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      if (gameStateRef.current === "start") {
        // Clean start screen - just gradient background
      } else if (gameStateRef.current === "playing") {
        // Draw floating logo
        if (logoImage) {
          const logoWidth = 50;
          const logoHeight = 50 * (logoImage.height / logoImage.width);
          const floatY = Math.sin(timestamp / 1500) * 3;
          const floatRotate = Math.sin(timestamp / 2000) * 1.5;

          ctx.save();
          ctx.translate(GAME_WIDTH / 2, 20 + logoHeight / 2 + floatY);
          ctx.rotate((floatRotate * Math.PI) / 180);

          ctx.shadowBlur = 15;
          ctx.shadowColor = secondaryColor + "80";
          ctx.drawImage(
            logoImage,
            -logoWidth / 2,
            -logoHeight / 2,
            logoWidth,
            logoHeight
          );
          ctx.restore();
        }

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.vy += 0.4; // gravity
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.02;

          if (p.life <= 0) {
            particles.splice(i, 1);
          } else {
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // Draw cards with animations
        for (const card of cards) {
          ctx.save();

          // Animate flip progress
          if (card.isFlipped && card.flipProgress !== undefined && card.flipProgress < 1) {
            card.flipProgress = Math.min(1, card.flipProgress + 0.12);
          }

          // Animate match progress
          if (card.isMatched && card.matchProgress !== undefined && card.matchProgress < 1) {
            card.matchProgress = Math.min(1, card.matchProgress + 0.06);
          }

          const flipScale = card.flipProgress !== undefined ?
            1 - Math.abs((card.flipProgress || 0) - 0.5) * 0.3 : 1;

          const matchScale = card.matchProgress !== undefined ?
            1 + easeOutCubic(card.matchProgress || 0) * 0.15 : 1;

          const cardCenterX = card.x + CARD_WIDTH / 2;
          const cardCenterY = card.y + CARD_HEIGHT / 2;

          ctx.translate(cardCenterX, cardCenterY);
          ctx.scale(flipScale * matchScale, matchScale);
          ctx.translate(-cardCenterX, -cardCenterY);

          if (card.isMatched) {
            // Matched card with soft pulsing glow
            const pulseGlow = Math.sin(timestamp / 500) * 0.3 + 0.7;

            ctx.shadowBlur = 25 * pulseGlow;
            ctx.shadowColor = secondaryColor + "60";

            const matchGradient = ctx.createLinearGradient(
              card.x, card.y, card.x, card.y + CARD_HEIGHT
            );
            matchGradient.addColorStop(0, secondaryColor + "50");
            matchGradient.addColorStop(1, secondaryColor + "30");
            ctx.fillStyle = matchGradient;
            drawRoundedRect(ctx, card.x, card.y, CARD_WIDTH, CARD_HEIGHT, CARD_BORDER_RADIUS);
            ctx.fill();

            ctx.shadowBlur = 0;

            // Draw icon with glow
            drawCardIcon(ctx, card.value, card.x, card.y, CARD_WIDTH, CARD_HEIGHT, secondaryColor);

          } else if (card.isFlipped) {
            // Flipped card - white glass-morphism
            ctx.shadowBlur = 20;
            ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
            ctx.shadowOffsetY = 8;

            const whiteGradient = ctx.createLinearGradient(card.x, card.y, card.x, card.y + CARD_HEIGHT);
            whiteGradient.addColorStop(0, "rgba(255, 255, 255, 0.98)");
            whiteGradient.addColorStop(1, "rgba(255, 255, 255, 0.92)");
            ctx.fillStyle = whiteGradient;
            drawRoundedRect(ctx, card.x, card.y, CARD_WIDTH, CARD_HEIGHT, CARD_BORDER_RADIUS);
            ctx.fill();

            // Border with brand accent
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;
            ctx.strokeStyle = secondaryColor + "80";
            ctx.lineWidth = 2.5;
            drawRoundedRect(ctx, card.x, card.y, CARD_WIDTH, CARD_HEIGHT, CARD_BORDER_RADIUS);
            ctx.stroke();

            // Inner highlight
            const highlightGradient = ctx.createLinearGradient(
              card.x, card.y, card.x, card.y + CARD_HEIGHT / 3
            );
            highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
            highlightGradient.addColorStop(1, "transparent");
            ctx.fillStyle = highlightGradient;
            drawRoundedRect(ctx, card.x + 1, card.y + 1, CARD_WIDTH - 2, CARD_HEIGHT / 2, CARD_BORDER_RADIUS);
            ctx.fill();

            // Draw illustrated icon
            drawCardIcon(ctx, card.value, card.x, card.y, CARD_WIDTH, CARD_HEIGHT, primaryColor);

          } else {
            // Face-down card - premium gradient with depth
            ctx.shadowBlur = 15;
            ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
            ctx.shadowOffsetY = 8;

            const cardGradient = ctx.createLinearGradient(card.x, card.y, card.x, card.y + CARD_HEIGHT);
            cardGradient.addColorStop(0, primaryColor);
            cardGradient.addColorStop(1, adjustBrightness(primaryColor, -40));
            ctx.fillStyle = cardGradient;
            drawRoundedRect(ctx, card.x, card.y, CARD_WIDTH, CARD_HEIGHT, CARD_BORDER_RADIUS);
            ctx.fill();

            // Outer border
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
            ctx.lineWidth = 2;
            drawRoundedRect(ctx, card.x, card.y, CARD_WIDTH, CARD_HEIGHT, CARD_BORDER_RADIUS);
            ctx.stroke();

            // Inner highlight for depth
            const highlightGradient = ctx.createLinearGradient(
              card.x, card.y, card.x, card.y + CARD_HEIGHT / 2
            );
            highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
            highlightGradient.addColorStop(1, "transparent");
            ctx.fillStyle = highlightGradient;
            drawRoundedRect(ctx, card.x + 2, card.y + 2, CARD_WIDTH - 4, CARD_HEIGHT / 2, CARD_BORDER_RADIUS - 2);
            ctx.fill();

            // Subtle pattern (question mark or dots)
            ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
            ctx.font = "bold 32px -apple-system, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("?", card.x + CARD_WIDTH / 2, card.y + CARD_HEIGHT / 2);
          }

          ctx.restore();
        }

        // UI: Score and Moves with premium styling
        ctx.save();
        ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

        // Score
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.fillText(`SCORE: ${scoreRef.current}`, 20, 35);

        // Moves
        ctx.textAlign = "right";
        ctx.fillStyle = secondaryColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = secondaryColor + "80";
        ctx.fillText(`MOVES: ${movesRef.current}`, GAME_WIDTH - 20, 35);

        ctx.restore();
      } else if (gameStateRef.current === "gameover") {
        // Game over screen with celebration
        ctx.save();

        // Dark overlay
        ctx.fillStyle = "rgba(10, 10, 15, 0.92)";
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Floating logo with victory glow
        if (logoImage) {
          const logoWidth = 80;
          const logoHeight = 80 * (logoImage.height / logoImage.width);
          const floatY = Math.sin(timestamp / 800) * 5;

          ctx.save();
          ctx.shadowBlur = 30;
          ctx.shadowColor = secondaryColor;
          ctx.drawImage(
            logoImage,
            GAME_WIDTH / 2 - logoWidth / 2,
            GAME_HEIGHT / 2 - 130 + floatY,
            logoWidth,
            logoHeight
          );
          ctx.restore();
        }

        // Victory text
        ctx.font = "bold 38px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = secondaryColor;
        ctx.shadowColor = secondaryColor;
        ctx.shadowBlur = 20;
        ctx.fillText("PERFECT!", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40);

        // Sub heading
        ctx.font = "bold 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 0;
        ctx.fillText(interpolate(config.copy.endWinHeadline), GAME_WIDTH / 2, GAME_HEIGHT / 2 + 5);

        // Stats
        ctx.font = "18px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillText(`Moves: ${movesRef.current} | Score: ${scoreRef.current}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);

        ctx.restore();
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [config, interpolate, logoImage]);

  return (
    <div className="device-frame relative">
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
      {(gameState === "start" || gameState === "gameover") && showStartButton && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={startGame}
            className="pointer-events-auto px-10 py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
            style={{
              backgroundColor: "#000000",
              color: "#FFFFFF",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
              fontSize: "18px",
              letterSpacing: "0.02em",
            }}
          >
            {gameState === "start" ? "Start Game" : "Play Again"}
          </button>
        </div>
      )}
    </div>
  );
}
