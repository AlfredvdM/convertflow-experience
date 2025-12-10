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
import { Upload01, Check, Loading02, Zap } from "@untitledui/icons";
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
                            <p className="mt-4 max-w-3xl text-lg font-semibold text-balance text-white md:mt-6 md:text-xl">
                                Custom branded games for engagement, training and learning. Try the generator below, see your brand come to life in 60 seconds.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Form Card - Overlaps hero section */}
            <div className="relative z-10 mx-auto -mt-[430px] w-full max-w-container px-4 md:-mt-[475px] md:px-8">
                <div className="mx-auto w-full max-w-3xl">
                    <form
                        onSubmit={handleSubmit}
                        className="relative overflow-hidden rounded-2xl bg-white/90 p-6 shadow-2xl backdrop-blur-2xl md:rounded-3xl md:p-8"
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
                                    className="w-full rounded-full bg-white/70 px-5 py-3.5 text-gray-700 placeholder:text-gray-400 shadow-sm ring-1 ring-gray-200/50 backdrop-blur-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                                    }
                                    required
                                    className="w-full rounded-full bg-white/70 px-5 py-3.5 text-gray-700 placeholder:text-gray-400 shadow-sm ring-1 ring-gray-200/50 backdrop-blur-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
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
                                className="w-full rounded-full bg-white/70 px-5 py-3.5 text-gray-700 placeholder:text-gray-400 shadow-sm ring-1 ring-gray-200/50 backdrop-blur-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
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
                                                className="mt-3 w-full rounded-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800"
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
                                                className="mt-3 w-full rounded-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800"
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
                                className="w-full resize-none rounded-3xl bg-white/70 px-5 py-4 text-gray-700 placeholder:text-gray-400 shadow-sm ring-1 ring-gray-200/50 backdrop-blur-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                            />

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isGenerating}
                                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-4 text-base font-semibold text-gray-900 shadow-lg transition-all duration-500 ease-out hover:shadow-[0_12px_40px_-6px_rgba(234,148,225,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-[#F2B25C] via-[#EA94E1] to-[#F2B25C] bg-[length:200%_100%] transition-all duration-500 ease-out group-hover:bg-[position:100%_0]" />
                                <span className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full group-hover:opacity-100 transition-all duration-700 ease-out" />
                                {isGenerating ? (
                                    <>
                                        <Loading02 className="relative z-10 h-5 w-5 animate-spin" />
                                        <span className="relative z-10">Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap className="relative z-10 h-5 w-5" />
                                        <span className="relative z-10">Generate Game</span>
                                    </>
                                )}
                            </button>

                            {/* Social Proof Logos */}
                            <div className="pt-6">
                                <p className="mb-5 text-center text-sm font-medium text-gray-500">
                                    These companies trust and use our games and AI apps through freelancing and agency work.
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16">
                                    <img
                                        alt="IGrow Rentals"
                                        src="https://cdn.prod.website-files.com/68f0849e4b2688b01e255a47/692e6a5e0702f81659a267ac_IGrow%20Rentals_Logo_Landscape%202.jpg"
                                        className="h-12 w-auto object-contain md:h-16"
                                    />
                                    <img
                                        alt="Momo"
                                        src="https://cdn.prod.website-files.com/637e343e048bc783c8646431/66a09cb78a6ef3229fa59ad6_momologo.avif"
                                        className="h-12 w-auto object-contain md:h-16"
                                    />
                                    <img
                                        alt="Partner"
                                        src="https://cdn.prod.website-files.com/68e3d594e9aa869632065083/693825ac6441de7e67a12708_logo.webp"
                                        className="h-12 w-auto object-contain md:h-16"
                                    />
                                </div>
                            </div>
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
