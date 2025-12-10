"use client";

import { PlayCircle, Trophy01, RefreshCcw01 } from "@untitledui/icons";
import { FeatureTextFeaturedIconLeft } from "./base-components/feature-text";
import { cx } from "@/utils/cx";

export const FeaturesIconsAndImage02 = () => {
    return (
        <section id="work" className="relative overflow-hidden bg-primary py-16 md:py-24 scroll-mt-20">
            {/* Left fluid gradient composition */}
            <div
                className="pointer-events-none absolute -left-32 top-[10%] h-[500px] w-[600px] rotate-[-15deg] blur-[60px]"
                style={{
                    background: `
                        radial-gradient(ellipse 120% 40% at 10% 25%, rgba(234, 51, 99, 0.55) 0%, transparent 50%),
                        radial-gradient(ellipse 90% 35% at 20% 50%, rgba(242, 178, 92, 0.5) 0%, transparent 55%),
                        radial-gradient(ellipse 100% 30% at 15% 75%, rgba(234, 148, 225, 0.45) 0%, transparent 50%),
                        radial-gradient(ellipse 80% 25% at 30% 90%, rgba(32, 79, 217, 0.4) 0%, transparent 55%)
                    `
                }}
            />
            {/* Left secondary wave */}
            <div
                className="pointer-events-none absolute -left-16 top-[35%] h-[250px] w-[350px] rotate-[10deg] blur-[50px]"
                style={{
                    background: `
                        radial-gradient(ellipse 100% 50% at 25% 50%, rgba(242, 178, 92, 0.4) 0%, transparent 60%),
                        radial-gradient(ellipse 80% 40% at 40% 70%, rgba(234, 148, 225, 0.35) 0%, transparent 55%)
                    `
                }}
            />
            {/* Right fluid gradient composition */}
            <div
                className="pointer-events-none absolute -right-32 top-[5%] h-[550px] w-[650px] rotate-[12deg] blur-[60px]"
                style={{
                    background: `
                        radial-gradient(ellipse 110% 35% at 90% 20%, rgba(234, 148, 225, 0.55) 0%, transparent 50%),
                        radial-gradient(ellipse 95% 40% at 80% 45%, rgba(32, 79, 217, 0.45) 0%, transparent 55%),
                        radial-gradient(ellipse 100% 30% at 85% 70%, rgba(242, 178, 92, 0.5) 0%, transparent 50%),
                        radial-gradient(ellipse 85% 35% at 75% 90%, rgba(234, 51, 99, 0.45) 0%, transparent 55%)
                    `
                }}
            />
            {/* Right secondary wave */}
            <div
                className="pointer-events-none absolute -right-16 top-[50%] h-[280px] w-[380px] rotate-[-8deg] blur-[50px]"
                style={{
                    background: `
                        radial-gradient(ellipse 90% 45% at 75% 40%, rgba(32, 79, 217, 0.35) 0%, transparent 60%),
                        radial-gradient(ellipse 100% 50% at 65% 65%, rgba(234, 51, 99, 0.4) 0%, transparent 55%)
                    `
                }}
            />

            <div className="relative z-10 mx-auto w-full max-w-container px-4 md:px-8">
                <div className="flex w-full flex-col items-center text-center">
                    <span className="text-sm font-semibold text-brand-secondary md:text-md">Featured Work</span>

                    <h2 className="mt-3 text-display-sm font-semibold text-primary md:text-display-md">James Ralph Co's Rubik's Cube Game</h2>
                    <p className="mt-4 max-w-3xl text-lg text-tertiary md:mt-5 md:text-xl">
                        A branded puzzle game for CASIO's official Southern Africa distributor — turning a product launch into a 6-month engagement campaign.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:gap-16 lg:grid-cols-2 lg:items-center">
                    <ul className="grid grid-cols-1 gap-4 md:gap-5">
                        {[
                            {
                                title: "500+ game plays",
                                subtitle: "Six months of sustained engagement from a single branded game — no ads, no gimmicks, just play.",
                                icon: PlayCircle,
                            },
                            {
                                title: "Played by a champion",
                                subtitle: "African Champion SpeedCuber Osman Badroodin played and endorsed the game, adding authentic credibility to the campaign.",
                                icon: Trophy01,
                            },
                            {
                                title: "6-month campaign",
                                subtitle: "What started as a launch activation became a long-running engagement tool — still generating plays months later.",
                                icon: RefreshCcw01,
                            },
                        ].map((item) => (
                            <li key={item.title} className="rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl">
                                <FeatureTextFeaturedIconLeft
                                    icon={item.icon}
                                    title={item.title}
                                    subtitle={item.subtitle}
                                />
                            </li>
                        ))}
                    </ul>

                    <div className="aspect-square w-full max-w-lg mx-auto lg:mx-0">
                        <div
                            className={cx(
                                "size-full rounded-[9.03px] bg-primary p-[0.9px] shadow-modern-mockup-outer-md ring-[0.56px] ring-utility-gray-300 ring-inset md:rounded-[32px] md:p-1 md:shadow-modern-mockup-outer-lg md:ring-[2px]",
                            )}
                        >
                            <div className="size-full rounded-[7.9px] bg-primary p-0.5 shadow-modern-mockup-inner-md md:rounded-[28px] md:p-[5.4px] md:shadow-modern-mockup-inner-lg">
                                <div className="relative size-full overflow-hidden rounded-[6.77px] ring-[0.56px] ring-utility-gray-200 md:rounded-[24px] md:ring-[2px]">
                                    <iframe
                                        src="https://rubiks-game.vercel.app/"
                                        title="James Ralph Co's Rubik's Cube Game"
                                        className="size-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
