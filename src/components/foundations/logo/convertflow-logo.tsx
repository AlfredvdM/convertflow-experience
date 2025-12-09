"use client";

import type { HTMLAttributes } from "react";
import { cx } from "@/utils/cx";

export const ConvertFlowLogo = (props: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            {...props}
            className={cx(
                "flex h-8 w-max items-center justify-start gap-2.5",
                props.className
            )}
        >
            {/* Logo Icon - Abstract conversion/flow symbol */}
            <svg
                viewBox="0 0 36 36"
                fill="none"
                className="h-full w-auto shrink-0"
            >
                <defs>
                    <linearGradient
                        id="convertflow-gradient"
                        x1="0"
                        y1="0"
                        x2="36"
                        y2="36"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#8B5CF6" />
                        <stop offset="0.5" stopColor="#A78BFA" />
                        <stop offset="1" stopColor="#C4B5FD" />
                    </linearGradient>
                    <linearGradient
                        id="convertflow-glow"
                        x1="18"
                        y1="0"
                        x2="18"
                        y2="36"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="white" stopOpacity="0.3" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Outer rounded square */}
                <rect
                    x="2"
                    y="2"
                    width="32"
                    height="32"
                    rx="8"
                    fill="url(#convertflow-gradient)"
                />
                {/* Gloss effect */}
                <rect
                    x="2"
                    y="2"
                    width="32"
                    height="16"
                    rx="8"
                    fill="url(#convertflow-glow)"
                />
                {/* Flow arrows - representing conversion */}
                <path
                    d="M12 14L18 10L24 14"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
                <path
                    d="M18 10V22"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
                <path
                    d="M12 22L18 26L24 22"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </svg>

            {/* Logomark text */}
            <span className="text-xl font-bold tracking-tight text-white">
                ConvertFlow
            </span>
        </div>
    );
};

export const ConvertFlowLogoMinimal = (props: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            {...props}
            className={cx("flex h-8 w-8 items-center justify-center", props.className)}
        >
            <svg viewBox="0 0 36 36" fill="none" className="h-full w-full">
                <defs>
                    <linearGradient
                        id="convertflow-gradient-min"
                        x1="0"
                        y1="0"
                        x2="36"
                        y2="36"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#8B5CF6" />
                        <stop offset="0.5" stopColor="#A78BFA" />
                        <stop offset="1" stopColor="#C4B5FD" />
                    </linearGradient>
                    <linearGradient
                        id="convertflow-glow-min"
                        x1="18"
                        y1="0"
                        x2="18"
                        y2="36"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="white" stopOpacity="0.3" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <rect
                    x="2"
                    y="2"
                    width="32"
                    height="32"
                    rx="8"
                    fill="url(#convertflow-gradient-min)"
                />
                <rect
                    x="2"
                    y="2"
                    width="32"
                    height="16"
                    rx="8"
                    fill="url(#convertflow-glow-min)"
                />
                <path
                    d="M12 14L18 10L24 14"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
                <path
                    d="M18 10V22"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
                <path
                    d="M12 22L18 26L24 22"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </svg>
        </div>
    );
};
