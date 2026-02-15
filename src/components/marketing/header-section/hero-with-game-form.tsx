"use client";

declare global {
    interface Window {
        UnicornStudio?: {
            isInitialized: boolean;
            init: () => void;
        };
    }
}

import { useEffect } from "react";
import { Header } from "@/components/marketing/header-navigation/header";

export const HeroWithGameForm = () => {
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

    const logos = [
        {
            alt: "IGrow Rentals",
            src: "https://cdn.prod.website-files.com/68f0849e4b2688b01e255a47/692e6a5e0702f81659a267ac_IGrow%20Rentals_Logo_Landscape%202.jpg",
        },
        {
            alt: "Momo",
            src: "https://cdn.prod.website-files.com/637e343e048bc783c8646431/66a09cb78a6ef3229fa59ad6_momologo.avif",
        },
        {
            alt: "Partner",
            src: "https://cdn.prod.website-files.com/68e3d594e9aa869632065083/693825ac6441de7e67a12708_logo.webp",
        },
    ];

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden overflow-clip bg-secondary">
            {/* Unicorn Studio Background */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div
                    data-us-project="NKdwUa1JUPAx1vgMmyD7"
                    className="h-full w-full"
                />
            </div>

            {/* Dark overlay */}
            <div className="pointer-events-none absolute inset-0 z-[1] bg-black/20" />

            {/* Header */}
            <div className="relative z-[2]">
                <Header />
            </div>

            {/* Hero content — vertically centered above logo bar */}
            <div className="relative z-[2] flex flex-1 flex-col items-center justify-center px-4 md:px-8">
                <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
                    {/* Headline */}
                    <h1
                        className="animate-fade-in-up text-display-lg leading-[1.1] font-bold tracking-tight text-white md:text-display-xl md:leading-[1.1] lg:text-display-2xl lg:leading-[1.1]"
                        style={{ textShadow: "0 2px 24px rgba(0,0,0,0.3)" }}
                    >
                        Save Time. Cut Costs.
                        <br />
                        Scale Faster.
                    </h1>

                    {/* Subheadline */}
                    <p
                        className="mt-4 max-w-2xl text-base leading-relaxed font-medium text-white/85 md:mt-7 md:text-xl"
                        style={{
                            animationDelay: "0.15s",
                            animationFillMode: "backwards",
                        }}
                    >
                        I build custom apps and AI-powered automation that streamline
                        your operations, from lead management to internal workflows,
                        so you grow without the growing pains.
                    </p>
                </div>
            </div>

            {/* White logo bar at bottom — covers Unicorn Studio watermark */}
            <div className="relative z-[2]">
                <div className="flex flex-col items-center gap-4 bg-white px-4 py-6 md:gap-5 md:py-10">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-8 bg-black/15" />
                        <p className="text-xs font-semibold tracking-widest text-black/40 uppercase">
                            Companies I&apos;ve worked with
                        </p>
                        <div className="h-px w-8 bg-black/15" />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-x-14 md:gap-y-5">
                        {logos.map((logo) => (
                            <img
                                key={logo.alt}
                                alt={logo.alt}
                                src={logo.src}
                                className="h-12 w-auto rounded-md object-contain opacity-80 transition-all duration-300 hover:opacity-100 hover:scale-105 md:h-14 lg:h-16"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
