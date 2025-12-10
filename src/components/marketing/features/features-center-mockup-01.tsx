"use client";

import { Trophy01, MessageChatCircle, Settings01 } from "@untitledui/icons";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";
import { FeatureTextFeaturedIconTopCentered } from "./base-components/feature-text";

export const FeaturesCenterMockup01 = () => {
    return (
        <section className="relative overflow-hidden bg-black py-16 md:py-24">
            {/* Left blue glow */}
            <div
                className="pointer-events-none absolute -left-20 top-[20%] h-[600px] w-[500px] blur-[100px]"
                style={{
                    background: `radial-gradient(ellipse 100% 80% at 20% 50%, rgba(37, 138, 197, 0.75) 0%, rgba(37, 138, 197, 0.45) 40%, transparent 70%)`
                }}
            />
            {/* Right blue glow */}
            <div
                className="pointer-events-none absolute -right-20 top-[15%] h-[650px] w-[550px] blur-[100px]"
                style={{
                    background: `radial-gradient(ellipse 100% 80% at 80% 50%, rgba(37, 138, 197, 0.75) 0%, rgba(37, 138, 197, 0.45) 40%, transparent 70%)`
                }}
            />
            {/* Bottom blue glow for features */}
            <div
                className="pointer-events-none absolute -left-10 bottom-[5%] h-[300px] w-[400px] blur-[80px]"
                style={{
                    background: `radial-gradient(ellipse 100% 100% at 30% 50%, rgba(37, 138, 197, 0.65) 0%, transparent 60%)`
                }}
            />
            <div
                className="pointer-events-none absolute -right-10 bottom-[5%] h-[300px] w-[400px] blur-[80px]"
                style={{
                    background: `radial-gradient(ellipse 100% 100% at 70% 50%, rgba(37, 138, 197, 0.65) 0%, transparent 60%)`
                }}
            />
            {/* Large bottom-left glow behind features */}
            <div
                className="pointer-events-none absolute -left-48 bottom-[-15%] h-[700px] w-[900px] blur-[140px]"
                style={{
                    background: `radial-gradient(ellipse 100% 100% at 40% 60%, rgba(37, 138, 197, 0.55) 0%, rgba(37, 138, 197, 0.25) 50%, transparent 75%)`
                }}
            />

            {/* Stars - Left side */}
            <div className="pointer-events-none absolute left-[8%] top-[15%] size-[2px] rounded-full bg-white/90 shadow-[0_0_2px_1px_rgba(255,255,255,0.4)]" />
            <div className="pointer-events-none absolute left-[12%] top-[22%] size-px rounded-full bg-white/70 shadow-[0_0_1px_0.5px_rgba(255,255,255,0.3)]" />
            <div className="pointer-events-none absolute left-[5%] top-[28%] size-[3px] rounded-full bg-white shadow-[0_0_3px_1px_rgba(255,255,255,0.5)]" />
            <div className="pointer-events-none absolute left-[15%] top-[35%] size-px rounded-full bg-white/60 shadow-[0_0_1px_0.5px_rgba(255,255,255,0.2)]" />
            <div className="pointer-events-none absolute left-[3%] top-[45%] size-[2px] rounded-full bg-white/80 shadow-[0_0_2px_1px_rgba(255,255,255,0.3)]" />
            <div className="pointer-events-none absolute left-[10%] top-[55%] size-px rounded-full bg-white/50 shadow-[0_0_1px_0.5px_rgba(255,255,255,0.2)]" />
            <div className="pointer-events-none absolute left-[7%] top-[65%] size-[2px] rounded-full bg-white/70 shadow-[0_0_2px_1px_rgba(255,255,255,0.3)]" />

            {/* Stars - Right side */}
            <div className="pointer-events-none absolute right-[10%] top-[12%] size-[3px] rounded-full bg-white shadow-[0_0_3px_1px_rgba(255,255,255,0.5)]" />
            <div className="pointer-events-none absolute right-[6%] top-[20%] size-px rounded-full bg-white/60 shadow-[0_0_1px_0.5px_rgba(255,255,255,0.2)]" />
            <div className="pointer-events-none absolute right-[14%] top-[30%] size-[2px] rounded-full bg-white/80 shadow-[0_0_2px_1px_rgba(255,255,255,0.3)]" />
            <div className="pointer-events-none absolute right-[4%] top-[38%] size-px rounded-full bg-white/70 shadow-[0_0_1px_0.5px_rgba(255,255,255,0.2)]" />
            <div className="pointer-events-none absolute right-[12%] top-[48%] size-[2px] rounded-full bg-white/70 shadow-[0_0_2px_1px_rgba(255,255,255,0.3)]" />
            <div className="pointer-events-none absolute right-[8%] top-[58%] size-[3px] rounded-full bg-white/90 shadow-[0_0_3px_1px_rgba(255,255,255,0.4)]" />
            <div className="pointer-events-none absolute right-[5%] top-[68%] size-px rounded-full bg-white/50 shadow-[0_0_1px_0.5px_rgba(255,255,255,0.2)]" />

            {/* Scattered faint stars */}
            <div className="pointer-events-none absolute left-[25%] top-[8%] size-px rounded-full bg-white/40 shadow-[0_0_1px_0.5px_rgba(255,255,255,0.15)]" />
            <div className="pointer-events-none absolute right-[22%] top-[75%] size-[2px] rounded-full bg-white/60 shadow-[0_0_2px_1px_rgba(255,255,255,0.25)]" />
            <div className="pointer-events-none absolute left-[20%] top-[80%] size-px rounded-full bg-white/50 shadow-[0_0_1px_0.5px_rgba(255,255,255,0.2)]" />

            <div className="relative z-10 mx-auto w-full max-w-container px-4 md:px-8">
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
                    <span className="hidden md:flex">
                        <BadgeWithDot color="brand" type="modern" size="lg">
                            Featured Work
                        </BadgeWithDot>
                    </span>
                    <span className="flex md:hidden">
                        <BadgeWithDot color="brand" type="modern" size="md">
                            Featured Work
                        </BadgeWithDot>
                    </span>
                    <h2 className="mt-4 text-display-sm font-semibold text-white md:text-display-md">MTN MoMo Foot Soldiers Leaderboard</h2>
                    <p className="mt-4 text-lg text-white/70 md:mt-5 md:text-xl">
                        A gamified platform to manage and motivate MTN's influencer network. Scroll through the live app below.
                    </p>
                </div>

                <div className="mt-12 flex flex-col gap-8 md:mt-16 md:gap-12 lg:items-center">
                    <div className="flex h-full w-full items-center justify-center md:max-h-204 md:w-full">
                        <div
                            className={cx(
                                "size-full rounded-[9.03px] bg-primary p-[0.9px] shadow-modern-mockup-outer-md ring-[0.56px] ring-utility-gray-300 ring-inset md:rounded-[32px] md:p-1 md:shadow-modern-mockup-outer-lg md:ring-[2px]",
                            )}
                        >
                            <div className="size-full rounded-[7.9px] bg-primary p-0.5 shadow-modern-mockup-inner-md md:rounded-[28px] md:p-[5.4px] md:shadow-modern-mockup-inner-lg">
                                <div className="relative size-full overflow-hidden rounded-[6.77px] ring-[0.56px] ring-utility-gray-200 md:rounded-[24px] md:ring-[2px]">
                                    <iframe
                                        src="https://influencers.mtnmomo.co.za/"
                                        title="MTN MoMo Influencers App"
                                        className="size-full min-h-[400px] md:min-h-[600px]"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <ul className="flex flex-col gap-4 md:flex-row md:flex-wrap md:justify-center md:gap-5 lg:flex-nowrap">
                        {[
                            {
                                title: "Live leaderboard",
                                subtitle: "Real-time rankings that drive competition and keep influencers pushing for the top.",
                                icon: Trophy01,
                            },
                            {
                                title: "AI-powered coach",
                                subtitle: "Each influencer gets a personal MoMo Coach to answer questions and keep them on track.",
                                icon: MessageChatCircle,
                            },
                            {
                                title: "Full admin portal",
                                subtitle: "MTN manages everything — upload data, track performance, update rewards. Zero dev needed.",
                                icon: Settings01,
                            },
                        ].map((item) => (
                            <li key={item.title} className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <FeatureTextFeaturedIconTopCentered
                                    icon={item.icon}
                                    title={item.title}
                                    subtitle={item.subtitle}
                                    darkMode
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};
