"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import { Upload01, Check, Loading02, Zap, PlayCircle } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
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
            <div className="relative overflow-hidden bg-secondary">
                {/* Background pattern */}
                <img
                    alt="Grid of dots"
                    aria-hidden="true"
                    loading="lazy"
                    src="https://www.untitledui.com/patterns/light/grid-sm-desktop.svg"
                    className="pointer-events-none absolute top-0 left-1/2 z-0 hidden max-w-none -translate-x-1/2 md:block dark:brightness-[0.2]"
                />
                <img
                    alt="Grid of dots"
                    aria-hidden="true"
                    loading="lazy"
                    src="https://www.untitledui.com/patterns/light/grid-sm-mobile.svg"
                    className="pointer-events-none absolute top-0 left-1/2 z-0 max-w-none -translate-x-1/2 md:hidden dark:brightness-[0.2]"
                />

                <Header />

                <section className="relative py-16 md:py-24">
                    <div className="mx-auto w-full max-w-container px-4 md:px-8">
                        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
                            <h1 className="text-display-sm font-semibold text-primary md:text-display-md lg:text-display-lg">
                                Create custom branded games in seconds
                            </h1>
                            <p className="mt-4 max-w-3xl text-lg text-balance text-tertiary md:mt-6 md:text-xl">
                                Enter your brand details below and watch as your custom game is generated instantly.
                                Engage your audience with interactive experiences that convert.
                            </p>
                            <div className="mt-8 flex w-full flex-col-reverse items-stretch gap-3 sm:w-auto sm:flex-row sm:items-start md:mt-10">
                                <Button iconLeading={PlayCircle} color="secondary" size="xl">
                                    Demo
                                </Button>
                                <Button size="xl">Sign up</Button>
                            </div>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="mx-auto mt-12 w-full max-w-container px-4 md:mt-16 md:px-8">
                        <div className="mx-auto w-full max-w-3xl">
                            <form
                                onSubmit={handleSubmit}
                                className="rounded-xl bg-primary p-6 shadow-xl ring-1 ring-primary md:rounded-2xl md:p-8 md:shadow-2xl"
                            >
                                <div className="space-y-6">
                                    {/* First Name & Email Row */}
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                                        <Input
                                            label="First Name"
                                            placeholder="e.g., John"
                                            value={formData.firstName}
                                            onChange={(value) =>
                                                setFormData((prev) => ({ ...prev, firstName: value }))
                                            }
                                            isRequired
                                        />
                                        <Input
                                            label="Email Address"
                                            type="email"
                                            placeholder="you@company.com"
                                            value={formData.email}
                                            onChange={(value) =>
                                                setFormData((prev) => ({ ...prev, email: value }))
                                            }
                                            isRequired
                                        />
                                    </div>

                                    {/* Company Name */}
                                    <Input
                                        label="Company Name"
                                        placeholder="e.g., Acme Corp"
                                        value={formData.companyName}
                                        onChange={(value) =>
                                            setFormData((prev) => ({ ...prev, companyName: value }))
                                        }
                                        isRequired
                                    />

                                    {/* Brand Colors */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-secondary">
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
                                                    className="flex w-full items-center gap-3 rounded-lg bg-primary px-3 py-2.5 shadow-xs ring-1 ring-primary ring-inset transition hover:bg-secondary"
                                                >
                                                    <div
                                                        className="h-6 w-6 rounded"
                                                        style={{ backgroundColor: formData.primaryColor }}
                                                    />
                                                    <span className="text-sm text-tertiary">
                                                        {formData.primaryColor}
                                                    </span>
                                                </button>
                                                {showPrimaryPicker && (
                                                    <div className="absolute top-full left-0 z-20 mt-2 rounded-lg bg-primary p-3 shadow-lg ring-1 ring-primary">
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
                                                            className="mt-2 w-full rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary hover:bg-tertiary"
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
                                                    className="flex w-full items-center gap-3 rounded-lg bg-primary px-3 py-2.5 shadow-xs ring-1 ring-primary ring-inset transition hover:bg-secondary"
                                                >
                                                    <div
                                                        className="h-6 w-6 rounded"
                                                        style={{ backgroundColor: formData.secondaryColor }}
                                                    />
                                                    <span className="text-sm text-tertiary">
                                                        {formData.secondaryColor}
                                                    </span>
                                                </button>
                                                {showSecondaryPicker && (
                                                    <div className="absolute top-full right-0 z-20 mt-2 rounded-lg bg-primary p-3 shadow-lg ring-1 ring-primary">
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
                                                            className="mt-2 w-full rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary hover:bg-tertiary"
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
                                        <label className="mb-1.5 block text-sm font-medium text-secondary">
                                            Logo (optional)
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                            id="logo-upload"
                                        />
                                        {formData.logoBase64 ? (
                                            <div className="flex items-center gap-3 rounded-lg bg-success-secondary p-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                                    <img
                                                        src={formData.logoBase64}
                                                        alt="Logo preview"
                                                        className="h-8 w-8 object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-success-primary">
                                                        <Check className="h-4 w-4" />
                                                        Logo uploaded
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={removeLogo}
                                                    className="text-sm font-medium text-tertiary hover:text-primary"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor="logo-upload"
                                                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-secondary bg-secondary py-4 transition hover:border-brand hover:bg-tertiary"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-xs ring-1 ring-primary">
                                                    <Upload01 className="h-5 w-5 text-quaternary" />
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-sm font-semibold text-brand-secondary">
                                                        Click to upload
                                                    </span>
                                                    <span className="text-sm text-tertiary"> or drag and drop</span>
                                                </div>
                                                <span className="text-xs text-tertiary">PNG, JPG, SVG (max. 2MB)</span>
                                            </label>
                                        )}
                                    </div>

                                    {/* Products/Services */}
                                    <TextArea
                                        label="Products/Services"
                                        placeholder="e.g., Analytics, Security, Marketing, Cloud Storage"
                                        value={formData.products}
                                        onChange={(value) =>
                                            setFormData((prev) => ({ ...prev, products: value }))
                                        }
                                        rows={3}
                                    />

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        size="xl"
                                        className="w-full"
                                        isDisabled={isGenerating}
                                        iconLeading={isGenerating ? Loading02 : Zap}
                                    >
                                        {isGenerating ? "Generating..." : "Generate Game"}
                                    </Button>
                                </div>
                            </form>
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
