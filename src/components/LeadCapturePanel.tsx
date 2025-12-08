"use client";

import { useState, FormEvent } from "react";
import { GameConfig } from "@/types/gameConfig";

interface Props {
  gameConfig: GameConfig;
}

export default function LeadCapturePanel({ gameConfig }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [embedCode, setEmbedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    // Clear error
    setError(null);

    // Compute slug from company name or fallback to brand name
    const companyName = company.trim() || gameConfig.brand.name;
    const slug = slugify(companyName);

    // Generate fake URLs
    const generatedShareUrl = `https://convertflow.games/demo/${slug}`;
    const generatedEmbedCode = `<iframe src="${generatedShareUrl}" width="800" height="600" frameborder="0"></iframe>`;

    // Set state
    setShareUrl(generatedShareUrl);
    setEmbedCode(generatedEmbedCode);
    setHasSubmitted(true);

    // Log for future API integration
    console.log({
      name,
      email,
      company: companyName,
      gameConfig,
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log(`${type} copied to clipboard`);
    });
  };

  return (
    <div className="modern-card p-5">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-main)" }}>
          Use this game in a real campaign
        </h3>
        <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
          Enter your details and we'll generate a share link and embed snippet.
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Perfect for landing pages, internal competitions, or event activations.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Name */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="modern-input text-sm"
            placeholder="Name"
          />

          {/* Email */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="modern-input text-sm"
            placeholder="Email *"
            style={{
              borderColor: error ? "var(--error)" : "var(--border-subtle)",
            }}
          />

          {/* Company */}
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="modern-input text-sm"
            placeholder="Company"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-xs animate-fade-in" style={{ color: "var(--error)" }}>
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary w-full text-sm"
          style={{ padding: "10px 24px" }}
        >
          Get game link & embed code
        </button>
      </form>

      {/* Success State */}
      {hasSubmitted && shareUrl && embedCode && (
        <div className="mt-5 pt-5 space-y-4 animate-scale-in" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          {/* Share URL */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-main)" }}>
              Your game link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 rounded-lg border text-xs font-mono"
                style={{
                  backgroundColor: "var(--bg)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-secondary)",
                }}
              />
              <button
                type="button"
                onClick={() => copyToClipboard(shareUrl, "URL")}
                className="px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 border"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-strong)",
                  color: "var(--text-main)",
                }}
              >
                Copy
              </button>
            </div>
          </div>

          {/* Embed Code */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-main)" }}>
              Embed code
            </label>
            <div className="space-y-2">
              <textarea
                value={embedCode}
                readOnly
                rows={3}
                className="w-full px-3 py-2 rounded-lg border text-xs font-mono resize-none"
                style={{
                  backgroundColor: "var(--bg)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-secondary)",
                }}
              />
              <button
                type="button"
                onClick={() => copyToClipboard(embedCode, "Embed code")}
                className="px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 border"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-strong)",
                  color: "var(--text-main)",
                }}
              >
                Copy code
              </button>
            </div>
          </div>

          {/* Demo Notice */}
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Note: These are demo values. In production, this will generate real hosted game links.
          </p>
        </div>
      )}
    </div>
  );
}
