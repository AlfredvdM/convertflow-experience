"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import { Upload01, Check, Loading02, Zap, PlayCircle } from "@untitledui/icons";
import GameModal from "@/components/GameModal";
import {
    FormData,
    GAME_URL,
    generateGameConfig,
    encodeConfig,
} from "@/types";

// Glassmorphism Navbar Component
const GlassNavbar = () => {
    return (
        <header className="relative z-50 w-full">
            <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
                <nav className="relative flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]">
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-transparent to-cyan-500/20 opacity-50" style={{ padding: '1px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">ConvertFlow</span>
                    </div>

                    {/* Desktop Nav Links */}
                    <ul className="hidden md:flex items-center gap-1">
                        {['Products', 'Services', 'Pricing', 'About'].map((item) => (
                            <li key={item}>
                                <a href="#" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-3">
                        <button className="hidden sm:block px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
                            Log in
                        </button>
                        <button className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all hover:scale-105">
                            Sign up
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

// Star Field Component with multiple layers
const StarField = () => {
    const stars = useRef<Array<{ x: number; y: number; size: number; opacity: number; delay: number; duration: number }>>([]);

    if (stars.current.length === 0) {
        // Layer 1: Tiny distant stars (100+)
        for (let i = 0; i < 120; i++) {
            stars.current.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: 0.5 + Math.random() * 0.5,
                opacity: 0.2 + Math.random() * 0.4,
                delay: Math.random() * 5,
                duration: 2 + Math.random() * 3,
            });
        }
        // Layer 2: Medium stars (50)
        for (let i = 0; i < 50; i++) {
            stars.current.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: 1 + Math.random() * 1,
                opacity: 0.4 + Math.random() * 0.4,
                delay: Math.random() * 4,
                duration: 1.5 + Math.random() * 2,
            });
        }
        // Layer 3: Bright prominent stars (20)
        for (let i = 0; i < 20; i++) {
            stars.current.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: 2 + Math.random() * 1.5,
                opacity: 0.7 + Math.random() * 0.3,
                delay: Math.random() * 3,
                duration: 1 + Math.random() * 1.5,
            });
        }
    }

    return (
        <div className="absolute inset-0 overflow-hidden">
            {stars.current.map((star, i) => (
                <div
                    key={i}
                    className="absolute rounded-full animate-pulse"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        backgroundColor: star.size > 2 ? '#fff' : star.size > 1 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
                        opacity: star.opacity,
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`,
                        boxShadow: star.size > 2 ? `0 0 ${star.size * 3}px ${star.size}px rgba(255,255,255,0.3)` : 'none',
                    }}
                />
            ))}
        </div>
    );
};

// Realistic Planet Component
const Planet = ({
    size,
    position,
    colors,
    animationDuration,
    animationName,
    hasRings,
    hasCraters,
    hasAtmosphere,
    blur = 0,
}: {
    size: number;
    position: { top?: string; bottom?: string; left?: string; right?: string };
    colors: string[];
    animationDuration: number;
    animationName: string;
    hasRings?: boolean;
    hasCraters?: boolean;
    hasAtmosphere?: boolean;
    blur?: number;
}) => {
    return (
        <div
            className={`absolute rounded-full animate-[${animationName}_${animationDuration}s_ease-in-out_infinite]`}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                ...position,
                filter: blur > 0 ? `blur(${blur}px)` : undefined,
            }}
        >
            {/* Atmosphere glow */}
            {hasAtmosphere && (
                <div
                    className="absolute -inset-4 rounded-full opacity-40"
                    style={{
                        background: `radial-gradient(circle, ${colors[0]}40 0%, transparent 70%)`,
                    }}
                />
            )}

            {/* Main planet body */}
            <div
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{
                    background: `radial-gradient(circle at 30% 30%, ${colors.join(', ')})`,
                    boxShadow: `
                        inset -${size/8}px -${size/8}px ${size/4}px rgba(0,0,0,0.5),
                        inset ${size/16}px ${size/16}px ${size/8}px rgba(255,255,255,0.1),
                        0 0 ${size/2}px ${size/8}px ${colors[0]}30
                    `,
                }}
            >
                {/* Surface texture overlay */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Crater effects */}
                {hasCraters && (
                    <>
                        <div className="absolute w-[15%] h-[15%] rounded-full bg-black/20" style={{ top: '20%', left: '60%', boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.1)' }} />
                        <div className="absolute w-[10%] h-[10%] rounded-full bg-black/15" style={{ top: '50%', left: '25%', boxShadow: 'inset 1px 1px 3px rgba(255,255,255,0.1)' }} />
                        <div className="absolute w-[8%] h-[8%] rounded-full bg-black/20" style={{ top: '70%', left: '55%', boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.1)' }} />
                        <div className="absolute w-[12%] h-[12%] rounded-full bg-black/15" style={{ top: '35%', left: '40%', boxShadow: 'inset 2px 2px 3px rgba(255,255,255,0.05)' }} />
                    </>
                )}

                {/* Banding for gas giants */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute w-full h-[8%] top-[20%] bg-white/10" style={{ transform: 'scaleX(1.1)' }} />
                    <div className="absolute w-full h-[5%] top-[45%] bg-black/10" style={{ transform: 'scaleX(1.1)' }} />
                    <div className="absolute w-full h-[6%] top-[65%] bg-white/5" style={{ transform: 'scaleX(1.1)' }} />
                </div>
            </div>

            {/* Planetary rings */}
            {hasRings && (
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                        width: `${size * 1.8}px`,
                        height: `${size * 0.4}px`,
                        transform: 'translate(-50%, -50%) rotateX(75deg)',
                    }}
                >
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: `radial-gradient(ellipse, transparent 40%, ${colors[1]}40 45%, ${colors[0]}30 50%, ${colors[1]}20 60%, transparent 70%)`,
                        }}
                    />
                </div>
            )}
        </div>
    );
};

// Nebula Cloud Component
const NebulaCloud = ({ className, color, opacity = 0.3 }: { className: string; color: string; opacity?: number }) => (
    <div
        className={`absolute rounded-full ${className}`}
        style={{
            background: `radial-gradient(ellipse at center, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
            filter: 'blur(60px)',
        }}
    />
);

// Shooting Star Component
const ShootingStar = () => {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setPosition({
                x: Math.random() * 100,
                y: Math.random() * 50,
            });
            setVisible(true);
            setTimeout(() => setVisible(false), 1000);
        }, 8000 + Math.random() * 7000);

        return () => clearInterval(interval);
    }, []);

    if (!visible) return null;

    return (
        <div
            className="absolute h-0.5 w-20 animate-[shootingStar_1s_linear_forwards]"
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                background: 'linear-gradient(90deg, transparent, white, transparent)',
                transform: 'rotate(-45deg)',
            }}
        />
    );
};

export const HeroWithGameForm = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        companyName: "",
        primaryColor: "#7F56D9",
        secondaryColor: "#9E77ED",
        products: "",
        email: "",
        logoBase64: undefined,
    });

    const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
    const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);
    const [gameUrl, setGameUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const primaryPickerRef = useRef<HTMLDivElement>(null);
    const secondaryPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (primaryPickerRef.current && !primaryPickerRef.current.contains(event.target as Node)) {
                setShowPrimaryPicker(false);
            }
            if (secondaryPickerRef.current && !secondaryPickerRef.current.contains(event.target as Node)) {
                setShowSecondaryPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({
                ...prev,
                logoBase64: reader.result as string,
            }));
        };
        reader.readAsDataURL(file);
    }, []);

    const removeLogo = () => {
        setFormData((prev) => ({ ...prev, logoBase64: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const config = generateGameConfig(formData);
        const encodedConfig = encodeConfig(config);
        const url = `${GAME_URL}?config=${encodedConfig}`;

        setGameUrl(url);
        setIsGenerating(false);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="relative min-h-screen overflow-hidden bg-[#05051a]">
                {/* Deep Space Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a2e] via-[#05051a] to-[#0f0a1a]" />

                {/* Nebula Clouds */}
                <NebulaCloud className="w-[800px] h-[600px] -left-40 top-0" color="#7c3aed" opacity={0.15} />
                <NebulaCloud className="w-[600px] h-[500px] right-0 top-20" color="#06b6d4" opacity={0.1} />
                <NebulaCloud className="w-[500px] h-[400px] left-1/3 bottom-20" color="#ec4899" opacity={0.08} />
                <NebulaCloud className="w-[400px] h-[300px] right-1/4 bottom-40" color="#8b5cf6" opacity={0.12} />

                {/* Star Field */}
                <StarField />

                {/* Shooting Stars */}
                <ShootingStar />
                <ShootingStar />

                {/* Planets */}
                {/* Large Gas Giant - Left */}
                <div className="absolute -left-48 top-1/4 animate-[float_25s_ease-in-out_infinite]">
                    <Planet
                        size={450}
                        position={{}}
                        colors={['#ff6b9d', '#c026d3', '#7c3aed', '#4c1d95']}
                        animationDuration={25}
                        animationName="float"
                        hasAtmosphere
                        hasRings
                    />
                </div>

                {/* Medium Ice Planet - Top Right */}
                <div className="absolute -right-20 top-10 animate-[floatReverse_18s_ease-in-out_infinite]">
                    <Planet
                        size={220}
                        position={{}}
                        colors={['#a5f3fc', '#22d3ee', '#0891b2', '#164e63']}
                        animationDuration={18}
                        animationName="floatReverse"
                        hasAtmosphere
                        hasCraters
                    />
                </div>

                {/* Small Rocky Planet - Bottom Right */}
                <div className="absolute right-[20%] bottom-24 animate-[float_15s_ease-in-out_infinite]">
                    <Planet
                        size={100}
                        position={{}}
                        colors={['#c4b5fd', '#8b5cf6', '#6d28d9', '#4c1d95']}
                        animationDuration={15}
                        animationName="float"
                        hasCraters
                    />
                </div>

                {/* Tiny Moon - Center Left */}
                <div className="absolute left-[30%] top-[35%] animate-[floatReverse_10s_ease-in-out_infinite]">
                    <Planet
                        size={50}
                        position={{}}
                        colors={['#e0e7ff', '#a5b4fc', '#6366f1']}
                        animationDuration={10}
                        animationName="floatReverse"
                        hasCraters
                    />
                </div>

                {/* Distant Red Planet */}
                <div className="absolute right-[40%] top-[15%] animate-[float_22s_ease-in-out_infinite] opacity-60">
                    <Planet
                        size={35}
                        position={{}}
                        colors={['#fca5a5', '#ef4444', '#b91c1c']}
                        animationDuration={22}
                        animationName="float"
                        blur={1}
                    />
                </div>

                {/* Cosmic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05051a] via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-cyan-900/10" />

                {/* Noise Texture */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-soft-light"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />

                <style jsx global>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
                        25% { transform: translateY(-30px) translateX(15px) rotate(1deg); }
                        50% { transform: translateY(-15px) translateX(-10px) rotate(-0.5deg); }
                        75% { transform: translateY(-35px) translateX(8px) rotate(0.5deg); }
                    }
                    @keyframes floatReverse {
                        0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
                        25% { transform: translateY(20px) translateX(-12px) rotate(-1deg); }
                        50% { transform: translateY(8px) translateX(15px) rotate(0.5deg); }
                        75% { transform: translateY(25px) translateX(-5px) rotate(-0.5deg); }
                    }
                    @keyframes shootingStar {
                        0% { transform: rotate(-45deg) translateX(0); opacity: 1; }
                        100% { transform: rotate(-45deg) translateX(300px); opacity: 0; }
                    }
                    @keyframes gradientShift {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                    }
                `}</style>

                {/* Glassmorphism Navbar */}
                <GlassNavbar />

                {/* Main Content */}
                <section className="relative py-12 md:py-20">
                    <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
                        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                            {/* Animated Badge */}
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 backdrop-blur-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
                                </span>
                                <span className="text-sm font-medium text-purple-300">Now with AI-powered game generation</span>
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                                <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                                    Make your brand
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                                    playable
                                </span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg text-white/60 md:text-xl">
                                Custom branded games for engagement, training and learning. Try the generator below — see your brand come to life in 60 seconds.
                            </p>

                            <div className="mt-8 flex w-full flex-col-reverse items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center md:mt-10">
                                <button className="group relative flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold text-white overflow-hidden transition-all hover:scale-105">
                                    {/* Glass background */}
                                    <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl" />
                                    {/* Gradient border on hover */}
                                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ padding: '1px', background: 'linear-gradient(135deg, rgba(139,92,246,0.5), rgba(236,72,153,0.5))', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
                                    <PlayCircle className="relative h-5 w-5" />
                                    <span className="relative">Watch Demo</span>
                                </button>
                                <button className="relative flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold text-white overflow-hidden shadow-2xl shadow-purple-500/20 transition-all hover:scale-105 hover:shadow-purple-500/30">
                                    {/* Animated gradient background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%] animate-[gradientShift_3s_ease-in-out_infinite]" />
                                    <span className="relative">Get Started Free</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Glassmorphism Form Card */}
                    <div className="mx-auto mt-16 w-full max-w-7xl px-4 md:mt-20 md:px-8">
                        <div className="mx-auto w-full max-w-3xl">
                            {/* Outer glow */}
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-cyan-500/30 rounded-[28px] blur-xl opacity-50" />

                                <form
                                    onSubmit={handleSubmit}
                                    className="relative rounded-3xl p-8 md:p-10 overflow-hidden"
                                >
                                    {/* Glass background */}
                                    <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-2xl" />

                                    {/* Gradient border */}
                                    <div
                                        className="absolute inset-0 rounded-3xl"
                                        style={{
                                            padding: '1px',
                                            background: 'linear-gradient(135deg, rgba(139,92,246,0.4) 0%, rgba(236,72,153,0.2) 50%, rgba(6,182,212,0.4) 100%)',
                                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                            WebkitMaskComposite: 'xor',
                                            maskComposite: 'exclude',
                                        }}
                                    />

                                    {/* Inner highlight */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent opacity-50" />

                                    {/* Form content */}
                                    <div className="relative space-y-6">
                                        {/* Form header */}
                                        <div className="text-center mb-8">
                                            <h3 className="text-xl font-semibold text-white">Generate Your Game</h3>
                                            <p className="mt-2 text-sm text-white/50">Fill in your brand details and watch the magic happen</p>
                                        </div>

                                        {/* First Name & Email Row */}
                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-white/80">
                                                    First Name <span className="text-pink-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., John"
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                                                    required
                                                    className="w-full rounded-xl bg-white/[0.03] backdrop-blur-sm px-4 py-3 text-white placeholder:text-white/30 border border-white/10 focus:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all hover:bg-white/[0.05]"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-white/80">
                                                    Email Address <span className="text-pink-400">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    placeholder="you@company.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                                    required
                                                    className="w-full rounded-xl bg-white/[0.03] backdrop-blur-sm px-4 py-3 text-white placeholder:text-white/30 border border-white/10 focus:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all hover:bg-white/[0.05]"
                                                />
                                            </div>
                                        </div>

                                        {/* Company Name */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-white/80">
                                                Company Name <span className="text-pink-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Acme Corp"
                                                value={formData.companyName}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                                                required
                                                className="w-full rounded-xl bg-white/[0.03] backdrop-blur-sm px-4 py-3 text-white placeholder:text-white/30 border border-white/10 focus:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all hover:bg-white/[0.05]"
                                            />
                                        </div>

                                        {/* Brand Colors */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-white/80">
                                                Brand Colors
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Primary Color */}
                                                <div className="relative" ref={primaryPickerRef}>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowPrimaryPicker(!showPrimaryPicker);
                                                            setShowSecondaryPicker(false);
                                                        }}
                                                        className="flex w-full items-center gap-3 rounded-xl bg-white/[0.03] backdrop-blur-sm px-4 py-3 border border-white/10 transition-all hover:bg-white/[0.05] hover:border-white/20"
                                                    >
                                                        <div
                                                            className="h-7 w-7 rounded-lg ring-2 ring-white/20 shadow-lg"
                                                            style={{ backgroundColor: formData.primaryColor, boxShadow: `0 4px 15px ${formData.primaryColor}50` }}
                                                        />
                                                        <span className="text-sm text-white/60 font-mono">
                                                            {formData.primaryColor}
                                                        </span>
                                                    </button>
                                                    {showPrimaryPicker && (
                                                        <div className="absolute top-full left-0 z-30 mt-2 rounded-2xl bg-[#1a1a2e]/98 backdrop-blur-2xl p-5 shadow-2xl border border-white/10">
                                                            <HexColorPicker
                                                                color={formData.primaryColor}
                                                                onChange={(color) => setFormData((prev) => ({ ...prev, primaryColor: color }))}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPrimaryPicker(false)}
                                                                className="mt-4 w-full rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2.5 text-sm font-medium text-white hover:from-purple-500/30 hover:to-pink-500/30 transition border border-purple-500/20"
                                                            >
                                                                Done
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Secondary Color */}
                                                <div className="relative" ref={secondaryPickerRef}>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowSecondaryPicker(!showSecondaryPicker);
                                                            setShowPrimaryPicker(false);
                                                        }}
                                                        className="flex w-full items-center gap-3 rounded-xl bg-white/[0.03] backdrop-blur-sm px-4 py-3 border border-white/10 transition-all hover:bg-white/[0.05] hover:border-white/20"
                                                    >
                                                        <div
                                                            className="h-7 w-7 rounded-lg ring-2 ring-white/20 shadow-lg"
                                                            style={{ backgroundColor: formData.secondaryColor, boxShadow: `0 4px 15px ${formData.secondaryColor}50` }}
                                                        />
                                                        <span className="text-sm text-white/60 font-mono">
                                                            {formData.secondaryColor}
                                                        </span>
                                                    </button>
                                                    {showSecondaryPicker && (
                                                        <div className="absolute top-full right-0 z-30 mt-2 rounded-2xl bg-[#1a1a2e]/98 backdrop-blur-2xl p-5 shadow-2xl border border-white/10">
                                                            <HexColorPicker
                                                                color={formData.secondaryColor}
                                                                onChange={(color) => setFormData((prev) => ({ ...prev, secondaryColor: color }))}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowSecondaryPicker(false)}
                                                                className="mt-4 w-full rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2.5 text-sm font-medium text-white hover:from-purple-500/30 hover:to-pink-500/30 transition border border-purple-500/20"
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
                                            <label className="mb-2 block text-sm font-medium text-white/80">
                                                Logo <span className="text-white/40">(optional)</span>
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                className="hidden"
                                                id="logo-upload"
                                            />
                                            {formData.logoBase64 ? (
                                                <div className="flex items-center gap-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                                                        <img
                                                            src={formData.logoBase64}
                                                            alt="Logo preview"
                                                            className="h-9 w-9 object-contain"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                                                            <Check className="h-4 w-4" />
                                                            Logo uploaded successfully
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={removeLogo}
                                                        className="text-sm font-medium text-white/40 hover:text-white/70 transition"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ) : (
                                                <label
                                                    htmlFor="logo-upload"
                                                    className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] py-6 transition-all hover:border-purple-400/30 hover:bg-white/[0.04]"
                                                >
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-all">
                                                        <Upload01 className="h-5 w-5 text-white/40 group-hover:text-purple-400 transition-colors" />
                                                    </div>
                                                    <div className="text-center">
                                                        <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                                            Click to upload
                                                        </span>
                                                        <span className="text-sm text-white/40"> or drag and drop</span>
                                                    </div>
                                                    <span className="text-xs text-white/30">PNG, JPG, SVG (max. 2MB)</span>
                                                </label>
                                            )}
                                        </div>

                                        {/* Products/Services */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-white/80">
                                                Products/Services
                                            </label>
                                            <textarea
                                                placeholder="e.g., Analytics, Security, Marketing, Cloud Storage"
                                                value={formData.products}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, products: e.target.value }))}
                                                rows={3}
                                                className="w-full rounded-xl bg-white/[0.03] backdrop-blur-sm px-4 py-3 text-white placeholder:text-white/30 border border-white/10 focus:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all resize-none hover:bg-white/[0.05]"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isGenerating}
                                            className="group relative w-full flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-base font-semibold text-white overflow-hidden transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {/* Animated gradient background */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-[length:200%_100%] animate-[gradientShift_4s_ease-in-out_infinite] group-hover:animate-[gradientShift_2s_ease-in-out_infinite]" />

                                            {/* Glow effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />

                                            {/* Button content */}
                                            <div className="relative flex items-center gap-2">
                                                {isGenerating ? (
                                                    <Loading02 className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    <Zap className="h-5 w-5" />
                                                )}
                                                {isGenerating ? "Generating Your Game..." : "Generate Game"}
                                            </div>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <GameModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                gameUrl={gameUrl || ""}
            />
        </>
    );
};
