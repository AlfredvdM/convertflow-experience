"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        UnicornStudio?: {
            isInitialized: boolean;
            init: () => void;
        };
    }
}

export const CTASplitImage04 = () => {
    useEffect(() => {
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

    return (
        <section id="about" className="bg-primary py-8 md:py-12 scroll-mt-20">
            <div className="mx-auto max-w-container px-4 md:px-8">
                <div className="relative flex flex-col overflow-hidden rounded-2xl shadow-xl md:flex-row md:items-center md:rounded-3xl">
                    {/* Unicorn Studio animated background - enlarged and shifted to hide badge */}
                    <div
                        data-us-project="7QvvEuaZpcQU0NSTuKPo"
                        className="absolute -left-4 -right-4 -top-24 -bottom-16 scale-110 translate-y-3"
                    />


                    <div className="relative z-10 flex flex-1 flex-col px-6 pt-10 pb-12 lg:p-16">
                        <h2 className="text-display-sm font-semibold text-primary_on-brand md:text-display-md">Built by an AI app and game developer who gets business</h2>
                        <p className="mt-4 text-lg text-tertiary_on-brand md:mt-5 md:text-xl">I'm Alfred, a developer based in South Africa. I've built lead systems, gamified platforms, and interactive experiences for companies like MTN, CASIO, and iGrow. I focus on one thing: delivering solutions that work and get results.</p>
                        <div className="mt-8 md:mt-12">
                            <a
                                href="https://calendly.com/alfredvanderm/30min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative inline-block overflow-hidden rounded-full px-8 py-4 text-base font-semibold text-gray-900 shadow-lg transition-all duration-500 ease-out hover:shadow-[0_8px_30px_-4px_rgba(234,148,225,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-[#F2B25C] via-[#EA94E1] to-[#F2B25C] bg-[length:200%_100%] transition-all duration-500 ease-out group-hover:bg-[position:100%_0]" />
                                <span className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full group-hover:opacity-100 transition-all duration-700 ease-out" />
                                <span className="relative z-10">Book a Quick Call</span>
                            </a>
                        </div>
                    </div>

                    <img alt="Person" src="https://cdn.prod.website-files.com/68e3d594e9aa869632065083/69396c911905653eefd57a2a_IMG-20250101-WA0067.png" className="relative z-10 h-80 w-full self-end object-contain md:h-120 md:w-110 lg:w-140" />
                </div>
            </div>
        </section>
    );
};
