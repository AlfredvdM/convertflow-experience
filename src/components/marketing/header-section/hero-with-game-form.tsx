"use client";

declare global {
    interface Window {
        UnicornStudio?: {
            isInitialized: boolean;
            init: () => void;
        };
    }
}

import { useState, useCallback, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import { Upload01, Check, Loading02, Zap, PlayCircle } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Header } from "@/components/marketing/header-navigation/header";
import GameModal from "@/components/GameModal";
import {
    FormData,
    GAME_URL,
    generateGameConfig,
    encodeConfig,
} from "@/types";

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

    // Load Unicorn Studio script
    useEffect(() => {
        if (typeof window === "undefined") return;

        if (!window.UnicornStudio) {
            window.UnicornStudio = { isInitialized: false, init: () => {} };
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.2/dist/unicornStudio.umd.js";
            script.onload = () => {
                if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
                    window.UnicornStudio.init();
                    window.UnicornStudio.isInitialized = true;
                }
            };
            document.head.appendChild(script);
        } else if (!window.UnicornStudio.isInitialized) {
            window.UnicornStudio.init();
            window.UnicornStudio.isInitialized = true;
        }
    }, []);

    // Close color pickers when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                primaryPickerRef.current &&
                !primaryPickerRef.current.contains(event.target as Node)
            ) {
                setShowPrimaryPicker(false);
            }
            if (
                secondaryPickerRef.current &&
                !secondaryPickerRef.current.contains(event.target as Node)
            ) {
                setShowSecondaryPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogoUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
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
        },
        []
    );

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
            <div className="relative overflow-hidden overflow-clip bg-secondary pb-[450px] md:pb-[490px]">
                {/* Unicorn Studio Background */}
                <div className="pointer-events-none absolute inset-0 z-0">
                    <div
                        data-us-project="NKdwUa1JUPAx1vgMmyD7"
                        className="h-full w-full"
                    />
                </div>

                {/* Dark overlay */}
                <div className="pointer-events-none absolute inset-0 z-[1] bg-black/20" />

                <div className="relative z-[2]">
                    <Header />
                </div>

                <section className="relative z-[2] py-12 md:py-16">
                    <div className="mx-auto w-full max-w-container px-4 md:px-8">
                        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
                            <h1 className="text-display-md font-semibold text-white md:text-display-lg lg:text-display-xl">
                                Make your brand playable
                            </h1>
                            <p className="mt-4 max-w-3xl text-lg font-semibold text-balance text-white/80 md:mt-6 md:text-xl">
                                Custom branded games for engagement, training and learning. Try the generator below, see your brand come to life in 60 seconds.
                            </p>
                            <div className="mt-8 flex w-full flex-col-reverse items-stretch gap-3 sm:w-auto sm:flex-row sm:items-start md:mt-10">
                                <Button
                                    iconLeading={PlayCircle}
                                    color="secondary"
                                    size="xl"
                                    className="!bg-white/10 !text-white !ring-white/20 backdrop-blur-sm transition-all hover:!bg-white/20 hover:!ring-white/30"
                                >
                                    Demo
                                </Button>
                                <Button
                                    size="xl"
                                    className="bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/40 hover:from-violet-500 hover:to-purple-500"
                                >
                                    Sign up
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Form Card - Overlaps hero section */}
            <div className="relative z-10 mx-auto -mt-[430px] w-full max-w-container px-4 md:-mt-[475px] md:px-8">
                <div className="mx-auto w-full max-w-3xl">
                    <form
                        onSubmit={handleSubmit}
                        className="relative overflow-hidden rounded-2xl p-6 shadow-2xl ring-1 ring-white/60 backdrop-blur-2xl md:rounded-3xl md:p-8"
                        style={{
                            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.85) 50%, rgba(255, 255, 255, 0.95) 100%)',
                        }}
                    >
                                {/* Form Title */}
                                <h2 className="mb-6 text-center text-xl font-semibold text-gray-800 md:text-2xl">
                                    Generate your custom branded game in seconds
                                </h2>

                                <div className="space-y-4">
                                    {/* First Name & Email Row */}
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            value={formData.firstName}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                                            }
                                            required
                                            className="w-full rounded-full bg-white/70 px-5 py-3.5 text-gray-700 placeholder:text-gray-400 shadow-sm ring-1 ring-gray-200/50 backdrop-blur-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/50"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, email: e.target.value }))
                                            }
                                            required
                                            className="w-full rounded-full bg-white/70 px-5 py-3.5 text-gray-700 placeholder:text-gray-400 shadow-sm ring-1 ring-gray-200/50 backdrop-blur-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/50"
                                        />
                                    </div>

                                    {/* Company Name */}
                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        value={formData.companyName}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, companyName: e.target.value }))
                                        }
                                        required
                                        className="w-full rounded-full bg-white/70 px-5 py-3.5 text-gray-700 placeholder:text-gray-400 shadow-sm ring-1 ring-gray-200/50 backdrop-blur-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/50"
                                    />

                                    {/* Brand Colors */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Primary Color */}
                                        <div className="relative" ref={primaryPickerRef}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowPrimaryPicker(!showPrimaryPicker);
                                                    setShowSecondaryPicker(false);
                                                }}
                                                className="flex w-full items-center gap-3 rounded-full bg-white/70 px-5 py-3.5 shadow-sm ring-1 ring-gray-200/50 backdrop-blur-sm transition hover:bg-white"
                                            >
                                                <div
                                                    className="h-5 w-5 rounded-full ring-1 ring-black/10"
                                                    style={{ backgroundColor: formData.primaryColor }}
                                                />
                                                <span className="text-sm text-gray-500">Primary Color</span>
                                            </button>
                                            {showPrimaryPicker && (
                                                <div className="absolute top-full left-0 z-20 mt-2 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
                                                    <HexColorPicker
                                                        color={formData.primaryColor}
                                                        onChange={(color) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                primaryColor: color,
                                                            }))
                                                        }
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPrimaryPicker(false)}
                                                        className="mt-3 w-full rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
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
                                                className="flex w-full items-center gap-3 rounded-full bg-white/70 px-5 py-3.5 shadow-sm ring-1 ring-gray-200/50 backdrop-blur-sm transition hover:bg-white"
                                            >
                                                <div
                                                    className="h-5 w-5 rounded-full ring-1 ring-black/10"
                                                    style={{ backgroundColor: formData.secondaryColor }}
                                                />
                                                <span className="text-sm text-gray-500">Secondary Color</span>
                                            </button>
                                            {showSecondaryPicker && (
                                                <div className="absolute top-full right-0 z-20 mt-2 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
                                                    <HexColorPicker
                                                        color={formData.secondaryColor}
                                                        onChange={(color) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                secondaryColor: color,
                                                            }))
                                                        }
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowSecondaryPicker(false)}
                                                        className="mt-3 w-full rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
                                                    >
                                                        Done
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Logo Upload */}
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                            id="logo-upload"
                                        />
                                        {formData.logoBase64 ? (
                                            <div className="flex items-center gap-3 rounded-full bg-white/70 px-5 py-3 shadow-sm ring-1 ring-gray-200/50 backdrop-blur-sm">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-gray-200/50">
                                                    <img
                                                        src={formData.logoBase64}
                                                        alt="Logo preview"
                                                        className="h-6 w-6 object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                                                        <Check className="h-4 w-4" />
                                                        Logo uploaded
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={removeLogo}
                                                    className="text-sm text-gray-400 transition hover:text-gray-600"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor="logo-upload"
                                                className="flex cursor-pointer items-center gap-3 rounded-full bg-white/70 px-5 py-3.5 shadow-sm ring-1 ring-gray-200/50 backdrop-blur-sm transition hover:bg-white"
                                            >
                                                <Upload01 className="h-5 w-5 text-gray-400" />
                                                <span className="text-sm text-gray-500">Upload Logo (optional)</span>
                                            </label>
                                        )}
                                    </div>

                                    {/* Products/Services */}
                                    <textarea
                                        placeholder="Products/Services (e.g., Analytics, Security, Marketing)"
                                        value={formData.products}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, products: e.target.value }))
                                        }
                                        rows={3}
                                        className="w-full resize-none rounded-3xl bg-white/70 px-5 py-4 text-gray-700 placeholder:text-gray-400 shadow-sm ring-1 ring-gray-200/50 backdrop-blur-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/50"
                                    />

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isGenerating}
                                        className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:bg-violet-500 hover:shadow-xl hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loading02 className="h-5 w-5 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="h-5 w-5" />
                                                Generate Game
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

            <GameModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                gameUrl={gameUrl || ""}
            />
        </>
    );
};
