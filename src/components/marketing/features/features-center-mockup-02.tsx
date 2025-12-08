"use client";

import { ChartBreakoutSquare, FilterLines, Lock01 } from "@untitledui/icons";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { FeatureTextFeaturedIconTopCentered } from "./base-components/feature-text";
import { cx } from "@/utils/cx";

export const FeaturesCenterMockup02 = () => {
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
                    <h2 className="mt-4 text-display-sm font-semibold text-primary md:text-display-md">iGrow Rentals Lead Management System</h2>
                    <p className="mt-4 text-lg text-tertiary md:mt-5 md:text-xl">
                        They were managing leads in a Google Sheet. I built them a secure app with real-time insights, filtering, and analytics all in one place.
                    </p>
                </div>
            </div>

            <div className="mx-auto w-full max-w-container px-4 md:px-8">
                <div className="flex flex-col gap-12 md:mt-8 md:gap-24 lg:items-center">
                    {/* Desktop and Mobile Mockup with overlapping layout */}
                    <div className="relative flex w-full items-center justify-center py-8 md:py-12">
                        {/* Desktop Mockup */}
                        <div className="relative w-full max-w-4xl">
                            <div
                                className={cx(
                                    "size-full rounded-[9.03px] bg-primary p-[0.9px] shadow-modern-mockup-outer-md ring-[0.56px] ring-utility-gray-300 ring-inset md:rounded-[32px] md:p-1 md:shadow-modern-mockup-outer-lg md:ring-[2px]",
                                )}
                            >
                                <div className="size-full rounded-[7.9px] bg-primary p-0.5 shadow-modern-mockup-inner-md md:rounded-[28px] md:p-[5.4px] md:shadow-modern-mockup-inner-lg">
                                    <div className="relative size-full overflow-hidden rounded-[6.77px] ring-[0.56px] ring-utility-gray-200 md:rounded-[24px] md:ring-[2px]">
                                        <img
                                            src="https://cdn.prod.website-files.com/67f8e3bea0ff07515caeadd4/6936e5e2492080541dddf70b_Screenshot%202025-12-08%20at%2016.49.12.png"
                                            alt="Desktop App Screenshot"
                                            className="size-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Mockup - Overlapping */}
                        <div className="absolute -bottom-8 right-4 w-32 md:-bottom-12 md:right-8 md:w-48 lg:right-16 lg:w-56">
                            <div
                                className={cx(
                                    "size-full rounded-[9.03px] bg-primary p-[0.9px] shadow-modern-mockup-outer-md ring-[0.56px] ring-utility-gray-300 ring-inset md:rounded-[24px] md:p-1 md:shadow-modern-mockup-outer-lg md:ring-[2px]",
                                )}
                            >
                                <div className="size-full rounded-[7.9px] bg-primary p-0.5 shadow-modern-mockup-inner-md md:rounded-[20px] md:p-[5.4px] md:shadow-modern-mockup-inner-lg">
                                    <div className="relative size-full overflow-hidden rounded-[6.77px] ring-[0.56px] ring-utility-gray-200 md:rounded-[16px] md:ring-[2px]">
                                        <img
                                            src="https://cdn.prod.website-files.com/67f8e3bea0ff07515caeadd4/6936e5e200e790eeb55db600_Screenshot%202025-12-08%20at%2016.50.32.png"
                                            alt="Mobile App Screenshot"
                                            className="size-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ul className="flex flex-1 flex-wrap justify-center gap-x-8 gap-y-10 lg:flex-nowrap">
                        {[
                            {
                                title: "Real-time insights",
                                subtitle: "Lead volume, top-performing properties, preferred contact methods. All visible at a glance.",
                                icon: ChartBreakoutSquare,
                            },
                            {
                                title: "Powerful filtering",
                                subtitle: "Search by name, apartment type, contact method, date range. Find any lead in seconds.",
                                icon: FilterLines,
                            },
                            {
                                title: "Secure and private",
                                subtitle: "No more shared spreadsheets. Role-based access keeps sensitive lead data protected.",
                                icon: Lock01,
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
