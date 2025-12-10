"use client";

import { Mail05, MarkerPin01, ArrowUpRight } from "@untitledui/icons";

export const FooterLarge15 = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative overflow-hidden bg-white pb-8 pt-8 md:pb-12 md:pt-12">
            {/* Yellow gradient rising from bottom */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
                style={{
                    background: `linear-gradient(to top, rgba(242, 178, 92, 0.25) 0%, rgba(242, 178, 92, 0.12) 30%, rgba(242, 178, 92, 0.03) 60%, transparent 100%)`
                }}
            />
            {/* Subtle pink accent on the sides */}
            <div
                className="pointer-events-none absolute -left-40 bottom-0 h-[500px] w-[500px] opacity-40 blur-[120px]"
                style={{
                    background: `radial-gradient(circle at 30% 70%, rgba(234, 148, 225, 0.2) 0%, transparent 60%)`
                }}
            />
            <div
                className="pointer-events-none absolute -right-32 bottom-0 h-[400px] w-[400px] opacity-30 blur-[100px]"
                style={{
                    background: `radial-gradient(circle at 70% 70%, rgba(234, 148, 225, 0.15) 0%, transparent 60%)`
                }}
            />

            {/* Subtle noise texture overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative z-10 mx-auto max-w-container px-4 md:px-8">
                {/* Main glass card */}
                <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/50 p-8 shadow-[0_8px_40px_-12px_rgba(234,148,225,0.15),0_0_0_1px_rgba(255,255,255,0.8)_inset] backdrop-blur-2xl md:rounded-[36px] md:p-12 lg:p-16">
                    {/* Inner glow effect */}
                    <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/80 via-transparent to-[#EA94E1]/10" />

                    {/* Content */}
                    <div className="relative z-10">
                        {/* Top section with logo and tagline */}
                        <div className="flex flex-col items-center text-center">
                            <img
                                src="https://cdn.prod.website-files.com/68e3d594e9aa869632065083/693978d040a562250299f8da_logo-03.svg"
                                alt="Logo"
                                className="h-12 w-auto md:h-14"
                            />
                            <p className="mt-5 max-w-md text-base text-gray-500/90 md:text-lg">
                                Crafting digital experiences that captivate, convert, and create lasting impact.
                            </p>
                        </div>

                        {/* Navigation pills */}
                        <nav className="mt-10 flex justify-center md:mt-12">
                            <ul className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-gray-200/60 bg-white/60 p-1.5 shadow-sm backdrop-blur-sm md:gap-1">
                                {([
                                    { label: "About", href: "#about", isExternal: false },
                                    { label: "My Work", href: "#work", isExternal: false },
                                    { label: "Contact", href: "https://calendly.com/alfredvanderm/30min", isExternal: true },
                                ] as const).map((item) => (
                                    <li key={item.label}>
                                        <a
                                            href={item.href}
                                            {...(item.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                                            onClick={(e) => {
                                                if (!item.isExternal && item.href.startsWith("#")) {
                                                    e.preventDefault();
                                                    const element = document.querySelector(item.href);
                                                    element?.scrollIntoView({ behavior: "smooth", block: "start" });
                                                }
                                            }}
                                            className="group relative inline-flex items-center gap-1 rounded-full px-5 py-2.5 text-sm font-medium text-gray-600 transition-all duration-300 hover:bg-[#EA94E1]/10 hover:text-[#c06ab8] md:px-6"
                                        >
                                            {item.label}
                                            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Contact info cards */}
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 md:mt-12 md:flex-row md:gap-6">
                            <a
                                href="mailto:hello@alfred.dev"
                                className="group flex items-center gap-3 rounded-2xl border border-gray-200/50 bg-white/70 px-5 py-3.5 shadow-sm transition-all duration-300 hover:border-[#EA94E1]/30 hover:bg-[#EA94E1]/5 hover:shadow-md"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#F2B25C] to-[#EA94E1] shadow-sm">
                                    <Mail05 className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 transition-colors group-hover:text-[#c06ab8]">
                                    hello@alfred.dev
                                </span>
                            </a>
                            <div className="flex items-center gap-3 rounded-2xl border border-gray-200/50 bg-white/70 px-5 py-3.5 shadow-sm">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#EA94E1] to-[#F2B25C] shadow-sm">
                                    <MarkerPin01 className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                    South Africa
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="relative mt-12 md:mt-16">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200/60" />
                            </div>
                            <div className="relative flex justify-center">
                                <div className="bg-white/80 px-4 backdrop-blur-sm">
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#EA94E1]/60" />
                                </div>
                            </div>
                        </div>

                        {/* Bottom section */}
                        <div className="mt-8 flex flex-col items-center justify-between gap-6 md:flex-row">
                            <p className="text-sm text-gray-400">
                                © {currentYear} ConvertFlow Pty (Ltd). All rights reserved.
                            </p>

                            <ul className="flex items-center gap-6">
                                {[
                                    { label: "Terms", href: "#" },
                                    { label: "Privacy", href: "#" },
                                ].map(({ label, href }) => (
                                    <li key={label}>
                                        <a
                                            href={href}
                                            className="text-sm text-gray-400 transition-colors duration-200 hover:text-[#c06ab8]"
                                        >
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            {/* Social links */}
                            <a
                                href="https://www.linkedin.com/in/alfredvdmerwe/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200/60 bg-white/80 text-gray-400 shadow-sm transition-all duration-300 hover:border-[#EA94E1]/30 hover:bg-[#EA94E1]/10 hover:text-[#c06ab8] hover:shadow-md"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom credit */}
                <p className="mt-8 text-center text-xs text-gray-400">
                    Designed & built with precision
                </p>
            </div>
        </footer>
    );
};
