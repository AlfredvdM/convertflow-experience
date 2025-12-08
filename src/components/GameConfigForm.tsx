"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { HexColorPicker } from "react-colorful";
import { GameConfig } from "@/types/gameConfig";

interface Props {
  config: GameConfig;
  onGenerate: (config: GameConfig) => void;
}

const GAME_TYPES = [
  { id: "spaceDefender", name: "Space Defender", emoji: "🚀", description: "Shoot falling enemies" },
  { id: "coinCollector", name: "Coin Collector", emoji: "💰", description: "Catch falling coins" },
  { id: "bubblePopper", name: "Bubble Popper", emoji: "🫧", description: "Pop rising bubbles" },
  { id: "targetShooter", name: "Target Shooter", emoji: "🎯", description: "Hit moving targets" },
  { id: "runnerDash", name: "Runner Dash", emoji: "🏃", description: "Jump over obstacles" },
  { id: "memoryMatch", name: "Memory Match", emoji: "🧠", description: "Match card pairs" },
] as const;

export default function GameConfigForm({ config, onGenerate }: Props) {
  // Form fields
  const [gameType, setGameType] = useState(config.gameType);
  const [companyName, setCompanyName] = useState(config.brand.name);
  const [primaryColor, setPrimaryColor] = useState(config.brand.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(config.brand.secondaryColor);
  const [accentColor, setAccentColor] = useState(config.brand.accentColor);
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("");
  const [products, setProducts] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openPicker, setOpenPicker] = useState<"primary" | "secondary" | "accent" | null>(null);

  const isValidHex = (color: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(color);
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setLogoUrl(objectUrl);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isValidHex(primaryColor)) {
      setError("Please enter valid hex colors for all color fields");
      return;
    }

    if (!isValidHex(secondaryColor)) {
      setError("Please enter valid hex colors for all color fields");
      return;
    }

    if (!isValidHex(accentColor)) {
      setError("Please enter valid hex colors for all color fields");
      return;
    }

    if (!goal.trim() || !audience.trim()) {
      setError("Please fill in your goal and target audience");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          primaryColor,
          secondaryColor,
          accentColor,
          goal,
          audience,
          products,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate game");
      }

      const apiConfig: GameConfig = await response.json();

      // Log AI-generated config to console
      console.log("🎮 AI Generated Game Config:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("Game Type:", apiConfig.gameType);
      console.log("Brand:", apiConfig.brand.name);
      console.log("Primary Color:", apiConfig.brand.primaryColor);
      console.log("Secondary Color:", apiConfig.brand.secondaryColor);
      console.log("Accent Color:", apiConfig.brand.accentColor);
      console.log("Start Headline:", apiConfig.copy.startHeadline);
      console.log("End Headline:", apiConfig.copy.endWinHeadline);
      console.log("Settings:", apiConfig.settings);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Merge logo URL into the config
      const finalConfig: GameConfig = {
        ...apiConfig,
        brand: {
          ...apiConfig.brand,
          logoUrl: logoUrl || apiConfig.brand.logoUrl,
        },
      };

      onGenerate(finalConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate game");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-main)" }}>
        Configure your game
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium mb-2" style={{ color: "var(--text-main)" }}>
            Company Name
          </label>
          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="modern-input"
            placeholder="Enter company name"
            required
          />
        </div>

        {/* Brand Colors - 3 Column Grid */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-main)" }}>
            Brand Colors
          </label>

          <div className="grid grid-cols-3 gap-2">
            {/* Primary Color */}
            <div className="relative">
              <label htmlFor="primaryColor" className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Primary
              </label>
              <div
                className="w-full h-16 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 relative"
                style={{
                  backgroundColor: isValidHex(primaryColor) ? primaryColor : "#ffffff",
                  borderColor: openPicker === "primary" ? "var(--accent)" : "var(--border-subtle)",
                  boxShadow: openPicker === "primary" ? "0 0 0 3px var(--accent-glow)" : "none",
                }}
                onClick={() => setOpenPicker(openPicker === "primary" ? null : "primary")}
              />
              <input
                id="primaryColor"
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value.toUpperCase())}
                className="mt-1.5 w-full px-2 py-1 rounded-md border text-[11px] font-mono text-center"
                placeholder="#6366F1"
                required
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-main)",
                }}
              />
              {openPicker === "primary" && (
                <div className="absolute top-full left-0 mt-2 z-50 p-3 rounded-xl border shadow-xl" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-strong)" }}>
                  <HexColorPicker color={primaryColor} onChange={setPrimaryColor} />
                  <button
                    type="button"
                    onClick={() => setOpenPicker(null)}
                    className="mt-3 w-full px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{
                      backgroundColor: "var(--accent)",
                      color: "white",
                    }}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Secondary Color */}
            <div className="relative">
              <label htmlFor="secondaryColor" className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Secondary
              </label>
              <div
                className="w-full h-16 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 relative"
                style={{
                  backgroundColor: isValidHex(secondaryColor) ? secondaryColor : "#ffffff",
                  borderColor: openPicker === "secondary" ? "var(--accent)" : "var(--border-subtle)",
                  boxShadow: openPicker === "secondary" ? "0 0 0 3px var(--accent-glow)" : "none",
                }}
                onClick={() => setOpenPicker(openPicker === "secondary" ? null : "secondary")}
              />
              <input
                id="secondaryColor"
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value.toUpperCase())}
                className="mt-1.5 w-full px-2 py-1 rounded-md border text-[11px] font-mono text-center"
                placeholder="#818CF8"
                required
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-main)",
                }}
              />
              {openPicker === "secondary" && (
                <div className="absolute top-full left-0 mt-2 z-50 p-3 rounded-xl border shadow-xl" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-strong)" }}>
                  <HexColorPicker color={secondaryColor} onChange={setSecondaryColor} />
                  <button
                    type="button"
                    onClick={() => setOpenPicker(null)}
                    className="mt-3 w-full px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{
                      backgroundColor: "var(--accent)",
                      color: "white",
                    }}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Accent Color */}
            <div className="relative">
              <label htmlFor="accentColor" className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Accent
              </label>
              <div
                className="w-full h-16 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 relative"
                style={{
                  backgroundColor: isValidHex(accentColor) ? accentColor : "#ffffff",
                  borderColor: openPicker === "accent" ? "var(--accent)" : "var(--border-subtle)",
                  boxShadow: openPicker === "accent" ? "0 0 0 3px var(--accent-glow)" : "none",
                }}
                onClick={() => setOpenPicker(openPicker === "accent" ? null : "accent")}
              />
              <input
                id="accentColor"
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value.toUpperCase())}
                className="mt-1.5 w-full px-2 py-1 rounded-md border text-[11px] font-mono text-center"
                placeholder="#4F46E5"
                required
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-main)",
                }}
              />
              {openPicker === "accent" && (
                <div className="absolute top-full left-0 mt-2 z-50 p-3 rounded-xl border shadow-xl" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-strong)" }}>
                  <HexColorPicker color={accentColor} onChange={setAccentColor} />
                  <button
                    type="button"
                    onClick={() => setOpenPicker(null)}
                    className="mt-3 w-full px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{
                      backgroundColor: "var(--accent)",
                      color: "white",
                    }}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label htmlFor="logo" className="block text-sm font-medium mb-2" style={{ color: "var(--text-main)" }}>
            Company Logo <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(Optional)</span>
          </label>
          <div className="dropzone">
            <input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <label htmlFor="logo" className="cursor-pointer block">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo preview" className="h-12 object-contain mx-auto" />
              ) : (
                <div>
                  <div className="text-2xl mb-2">📤</div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Click to upload logo
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Goal */}
        <div>
          <label htmlFor="goal" className="block text-sm font-medium mb-2" style={{ color: "var(--text-main)" }}>
            What's your goal with this game?
          </label>
          <textarea
            id="goal"
            rows={3}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="modern-input resize-none"
            placeholder="E.g., I want to generate leads for my SaaS platform at our upcoming tech conference. I'm thinking something fast-paced and competitive that developers would enjoy."
            required
          />
        </div>

        {/* Audience */}
        <div>
          <label htmlFor="audience" className="block text-sm font-medium mb-2" style={{ color: "var(--text-main)" }}>
            Who's your target audience?
          </label>
          <input
            id="audience"
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="modern-input"
            placeholder="E.g., Software developers, tech enthusiasts, CTOs"
            required
          />
        </div>

        {/* Products & Services */}
        <div>
          <label htmlFor="products" className="block text-sm font-medium mb-2" style={{ color: "var(--text-main)" }}>
            Products & Services <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(Optional)</span>
          </label>
          <input
            id="products"
            type="text"
            value={products}
            onChange={(e) => setProducts(e.target.value)}
            className="modern-input"
            placeholder="E.g., Online Banking, eBucks Rewards, FNB App, Card Services"
          />
          <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
            Separate multiple items with commas to personalize game content
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="p-3 rounded-xl text-sm border animate-fade-in"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderColor: "var(--error)",
              color: "var(--error)",
            }}
          >
            {error}
          </div>
        )}

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isGenerating || !isValidHex(primaryColor) || !isValidHex(secondaryColor) || !isValidHex(accentColor)}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⚡</span>
              Generating...
            </span>
          ) : (
            "Generate Game"
          )}
        </button>
      </form>
    </div>
  );
}
