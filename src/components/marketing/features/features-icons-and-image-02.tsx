"use client";

import { PlayCircle, Trophy01, RefreshCcw01 } from "@untitledui/icons";
import { FeatureTextFeaturedIconLeft } from "./base-components/feature-text";
import { cx } from "@/utils/cx";

export const FeaturesIconsAndImage02 = () => {
    return (
        <section className="bg-primary py-16 md:py-24">
            <div className="mx-auto w-full max-w-container px-4 md:px-8">
                <div className="flex w-full flex-col lg:max-w-3xl">
                    <span className="text-sm font-semibold text-brand-secondary md:text-md">Featured Work</span>

                    <h2 className="mt-3 text-display-sm font-semibold text-primary md:text-display-md">James Ralph Co's Rubik's Cube Game</h2>
                    <p className="mt-4 text-lg text-tertiary md:mt-5 md:text-xl">
                        A branded puzzle game for CASIO's official Southern Africa distributor — turning a product launch into a 6-month engagement campaign.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:gap-16 lg:grid-cols-2 lg:items-center">
                    <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-1">
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
                            <li key={item.title}>
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
