"use client";

import { Trophy01, MessageChatCircle, Settings01 } from "@untitledui/icons";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";
import { FeatureTextFeaturedIconTopCentered } from "./base-components/feature-text";

export const FeaturesCenterMockup01 = () => {
    return (
        <section className="bg-primary py-16 md:py-24">
            <div className="mx-auto w-full max-w-container px-4 md:px-8">
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
                    <h2 className="mt-4 text-display-sm font-semibold text-primary md:text-display-md">MTN MoMo Foot Soldiers Leaderboard</h2>
                    <p className="mt-4 text-lg text-tertiary md:mt-5 md:text-xl">
                        A gamified platform to manage and motivate MTN's influencer network. Scroll through the live app below.
                    </p>
                </div>

                <div className="mt-12 flex flex-col gap-12 md:mt-16 md:gap-24 lg:items-center">
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
                    <ul className="flex flex-1 flex-wrap justify-center gap-x-8 gap-y-10 lg:flex-nowrap">
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
                            <li key={item.title}>
                                <FeatureTextFeaturedIconTopCentered
                                    icon={item.icon}
                                    title={item.title}
                                    subtitle={item.subtitle}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};
