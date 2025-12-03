"use client";

import { useState } from "react";
import ArcadeGame from "@/components/ArcadeGame";
import GameConfigForm from "@/components/GameConfigForm";
import LeadCapturePanel from "@/components/LeadCapturePanel";
import { GameConfig, DEFAULT_CONFIG } from "@/types/gameConfig";

export default function Home() {
  const [gameConfig, setGameConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [configVersion, setConfigVersion] = useState(0);

  const handleConfigUpdate = (newConfig: GameConfig) => {
    setGameConfig(newConfig);
    setConfigVersion((v) => v + 1);
  };

  return (
    <div className="relative min-h-screen">
      {/* Navigation */}
      <nav className="relative z-20 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-xl font-bold gradient-text">ConvertFlow</span>
            </div>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Work
              </a>
              <a href="#" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                About
              </a>
              <a href="#" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Pricing
              </a>
              <button className="btn-secondary text-sm">Get in touch</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Width */}
      <section className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            <div className="eyebrow">Branded arcade experiences</div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6" style={{ letterSpacing: "-0.03em" }}>
              Build unforgettable{" "}
              <span className="gradient-text">arcade games</span> that convert.
            </h1>
            <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
              Create branded, playable experiences in seconds. Powered by AI, built for teams who want more than boring forms.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button className="btn-primary">
                Play the demo
              </button>
              <button className="btn-secondary">
                See how it works
              </button>
            </div>

            {/* Social proof */}
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Used by teams who want more than boring forms.
            </p>
          </div>
        </div>
      </section>

      {/* Arcade Studio - Almost Full Width */}
      <section className="relative z-10 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[95%] xl:max-w-7xl mx-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {/* Window Header */}
            <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <div className="window-dots">
                <span className="window-dot red"></span>
                <span className="window-dot yellow"></span>
                <span className="window-dot green"></span>
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                ConvertFlow Arcade Studio
              </span>
              <div className="w-16"></div> {/* Spacer for balance */}
            </div>

            {/* App Content */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              {/* Left: Form */}
              <div>
                <GameConfigForm
                  config={gameConfig}
                  onGenerate={handleConfigUpdate}
                />
              </div>

              {/* Right: Game + Lead Panel */}
              <div className="space-y-6">
                <div>
                  {configVersion > 0 && (
                    <div className="mb-3 flex items-center justify-end">
                      <div
                        className="px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5"
                        style={{
                          backgroundColor: "var(--accent-glow)",
                          color: "var(--accent)",
                          border: "1px solid var(--accent)",
                          opacity: 0.8,
                        }}
                      >
                        <span>✨</span>
                        <span>AI Generated</span>
                      </div>
                    </div>
                  )}
                  <ArcadeGame config={gameConfig} key={configVersion} />
                </div>

                <LeadCapturePanel gameConfig={gameConfig} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Row */}
      <section className="relative z-10 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-medium mb-8" style={{ color: "var(--text-muted)" }}>
            Built for teams who care about experience
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Acme Corp", "TechFlow", "BrandOne", "FintechCo", "CloudSync"].map((company) => (
              <div key={company} className="trust-logo">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
