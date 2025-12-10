"use client";

import { ChartBreakoutSquare, FilterLines, Lock01 } from "@untitledui/icons";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { FeatureTextFeaturedIconTopCentered } from "./base-components/feature-text";
import { cx } from "@/utils/cx";

export const FeaturesCenterMockup02 = () => {
    return (
        <section className="relative overflow-hidden bg-primary py-16 md:py-24">
            {/* Burgundy gradient - top right accent */}
            <div
                className="pointer-events-none absolute -right-32 -top-20 h-[400px] w-[500px] blur-[120px]"
                style={{
                    background: `radial-gradient(ellipse 100% 100% at 70% 30%, rgba(121, 39, 58, 0.12) 0%, rgba(121, 39, 58, 0.04) 50%, transparent 70%)`
                }}
            />
            {/* Burgundy gradient - behind charts left side */}
            <div
                className="pointer-events-none absolute -left-20 top-[40%] h-[500px] w-[600px] blur-[100px]"
                style={{
                    background: `radial-gradient(ellipse 80% 100% at 30% 60%, rgba(121, 39, 58, 0.18) 0%, rgba(121, 39, 58, 0.08) 40%, transparent 70%)`
                }}
            />
            {/* Warm accent gradient - bottom left behind charts */}
            <div
                className="pointer-events-none absolute -left-10 bottom-[15%] h-[350px] w-[450px] blur-[80px]"
                style={{
                    background: `radial-gradient(ellipse 100% 100% at 40% 50%, rgba(121, 39, 58, 0.22) 0%, rgba(180, 60, 90, 0.08) 50%, transparent 75%)`
                }}
            />
            {/* Subtle burgundy glow - bottom center behind features */}
            <div
                className="pointer-events-none absolute bottom-[8%] left-1/2 h-[400px] w-[800px] -translate-x-1/2 blur-[100px]"
                style={{
                    background: `radial-gradient(ellipse 100% 80% at 50% 70%, rgba(121, 39, 58, 0.15) 0%, rgba(121, 39, 58, 0.06) 50%, transparent 75%)`
                }}
            />
            {/* Rose accent - right side depth */}
            <div
                className="pointer-events-none absolute -right-16 bottom-[25%] h-[300px] w-[400px] blur-[90px]"
                style={{
                    background: `radial-gradient(ellipse 100% 100% at 80% 50%, rgba(121, 39, 58, 0.14) 0%, rgba(150, 50, 75, 0.05) 60%, transparent 80%)`
                }}
            />
            {/* Feature cards glow - left accent */}
            <div
                className="pointer-events-none absolute bottom-[10%] left-[10%] h-[250px] w-[350px] blur-[70px]"
                style={{
                    background: `radial-gradient(ellipse 100% 100% at 50% 50%, rgba(121, 39, 58, 0.2) 0%, rgba(121, 39, 58, 0.08) 50%, transparent 75%)`
                }}
            />
            {/* Feature cards glow - right accent */}
            <div
                className="pointer-events-none absolute bottom-[10%] right-[10%] h-[250px] w-[350px] blur-[70px]"
                style={{
                    background: `radial-gradient(ellipse 100% 100% at 50% 50%, rgba(121, 39, 58, 0.18) 0%, rgba(150, 50, 75, 0.06) 50%, transparent 75%)`
                }}
            />

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
                    <h2 className="mt-4 text-display-sm font-semibold text-primary md:text-display-md">iGrow Rentals Lead Management System</h2>
                    <p className="mt-4 text-lg text-tertiary md:mt-5 md:text-xl">
                        They were managing leads in a Google Sheet. I built them a secure app with real-time insights, filtering, and analytics all in one place.
                    </p>
                </div>
            </div>

            <div className="relative z-10 mx-auto w-full max-w-container px-4 md:px-8">
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

                        {/* Chart Images - Bottom Left Overlapping */}
                        <div className="absolute -bottom-4 left-4 flex gap-2 md:-bottom-8 md:left-8 md:gap-3 lg:left-12 lg:gap-4">
                            {/* Chart 1 - Bar Chart */}
                            <div className="w-40 md:w-64 lg:w-72">
                                <div
                                    className={cx(
                                        "size-full rounded-[6px] bg-primary p-[0.5px] shadow-modern-mockup-outer-md ring-[0.5px] ring-utility-gray-300 ring-inset md:rounded-[12px] md:p-[0.75px] md:shadow-modern-mockup-outer-lg md:ring-[1.5px]",
                                    )}
                                >
                                    <div className="size-full rounded-[5px] bg-primary p-[0.25px] shadow-modern-mockup-inner-md md:rounded-[10px] md:p-[3px] md:shadow-modern-mockup-inner-lg">
                                        <div className="relative size-full overflow-hidden rounded-[4px] ring-[0.5px] ring-utility-gray-200 md:rounded-[8px] md:ring-[1.5px]">
                                            <img
                                                src="https://cdn.prod.website-files.com/68f0849e4b2688b01e255a47/693965171905653eefd33bb1_Screenshot%202025-12-10%20at%2014.17.54.png"
                                                alt="Bar Chart Analytics"
                                                className="size-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Chart 2 - Pie Chart */}
                            <div className="w-32 md:w-48 lg:w-56">
                                <div
                                    className={cx(
                                        "size-full rounded-[6px] bg-primary p-[0.5px] shadow-modern-mockup-outer-md ring-[0.5px] ring-utility-gray-300 ring-inset md:rounded-[12px] md:p-[0.75px] md:shadow-modern-mockup-outer-lg md:ring-[1.5px]",
                                    )}
                                >
                                    <div className="size-full rounded-[5px] bg-primary p-[0.25px] shadow-modern-mockup-inner-md md:rounded-[10px] md:p-[3px] md:shadow-modern-mockup-inner-lg">
                                        <div className="relative size-full overflow-hidden rounded-[4px] ring-[0.5px] ring-utility-gray-200 md:rounded-[8px] md:ring-[1.5px]">
                                            <img
                                                src="https://cdn.prod.website-files.com/68f0849e4b2688b01e255a47/69396517e1e930ca99ffc642_Screenshot%202025-12-10%20at%2014.17.46.png"
                                                alt="Pie Chart Analytics"
                                                className="size-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ul className="flex flex-col gap-4 md:flex-row md:flex-wrap md:justify-center md:gap-5 lg:flex-nowrap">
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
                            <li key={item.title} className="flex-1 rounded-2xl border border-white/40 bg-white/50 p-6 shadow-lg shadow-black/[0.03] ring-1 ring-inset ring-white/60 backdrop-blur-md">
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
