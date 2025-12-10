"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { ChevronDown } from "@untitledui/icons";
import { Button as AriaButton, Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Popover as AriaPopover } from "react-aria-components";
import { cx } from "@/utils/cx";

type HeaderNavItem = {
    label: string;
    href?: string;
    menu?: ReactNode;
    isExternal?: boolean;
};

const headerNavItems: HeaderNavItem[] = [
    { label: "About", href: "#about" },
    { label: "My Work", href: "#work" },
    { label: "Contact", href: "https://calendly.com/alfredvanderm/30min", isExternal: true },
];

const MobileNavItem = (props: { className?: string; label: string; href?: string; isExternal?: boolean }) => {
    return (
        <li>
            <a
                href={props.href}
                {...(props.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                onClick={(e) => {
                    if (!props.isExternal && props.href?.startsWith("#")) {
                        e.preventDefault();
                        const element = document.querySelector(props.href);
                        element?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                }}
                className="block rounded-xl px-4 py-3 text-md font-semibold text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
                {props.label}
            </a>
        </li>
    );
};

interface HeaderProps {
    items?: HeaderNavItem[];
    isFullWidth?: boolean;
    isFloating?: boolean;
    className?: string;
}

export const Header = ({ items = headerNavItems, isFullWidth, isFloating, className }: HeaderProps) => {
    const headerRef = useRef<HTMLElement>(null);

    return (
        <header
            ref={headerRef}
            className={cx(
                "relative flex h-18 w-full items-center justify-center md:h-20",
                isFloating && "h-16 md:h-19 md:pt-3",
                isFullWidth && !isFloating ? "has-aria-expanded:bg-primary" : "max-md:has-aria-expanded:bg-primary",
                className,
            )}
        >
            <div className="flex size-full max-w-container flex-1 items-center pr-3 pl-4 md:px-8">
                <div
                    className={cx(
                        "flex w-full items-center justify-between gap-4 rounded-2xl bg-white/10 px-4 py-2.5 ring-1 ring-white/20 backdrop-blur-md md:px-6 md:py-3",
                        isFloating && "ring-secondary_alt md:rounded-2xl md:bg-primary md:py-3 md:pr-3 md:pl-4 md:shadow-xs md:ring-1",
                    )}
                >
                    {/* Logo */}
                    <img src="https://cdn.prod.website-files.com/68e3d594e9aa869632065083/693978d03635627470c0c723_logo-02.svg" alt="Logo" className="h-10" />

                    {/* Desktop navigation - Centered with pill container */}
                    <nav className="absolute left-1/2 -translate-x-1/2 max-md:hidden">
                        <ul className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1.5 shadow-sm backdrop-blur-md">
                                {items.map((navItem) => (
                                    <li key={navItem.label}>
                                        {navItem.menu ? (
                                            <AriaDialogTrigger>
                                                <AriaButton className="group relative inline-flex cursor-pointer items-center gap-1 rounded-full px-5 py-2 text-sm font-medium text-white/80 outline-focus-ring transition-all duration-300 hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2">
                                                    {navItem.label}
                                                    <ChevronDown className="size-3.5 rotate-0 stroke-[2.5px] text-white/60 transition duration-200 ease-linear group-hover:text-white/80 in-aria-expanded:-rotate-180" />
                                                </AriaButton>

                                                <AriaPopover
                                                    className={({ isEntering, isExiting }) =>
                                                        cx(
                                                            "hidden origin-top will-change-transform md:block",
                                                            isFullWidth && "w-full",
                                                            isEntering && "duration-200 ease-out animate-in fade-in slide-in-from-top-1",
                                                            isExiting && "duration-150 ease-in animate-out fade-out slide-out-to-top-1",
                                                        )
                                                    }
                                                    offset={isFloating || isFullWidth ? 0 : 8}
                                                    containerPadding={0}
                                                    triggerRef={(isFloating && isFullWidth) || isFullWidth ? headerRef : undefined}
                                                >
                                                    {({ isEntering, isExiting }) => (
                                                        <AriaDialog
                                                            className={cx(
                                                                "mx-auto origin-top outline-hidden",
                                                                isFloating && "max-w-7xl px-8 pt-3",
                                                                // Have to use the scale animation inside the popover to avoid
                                                                // miscalculating the popover's position when opening.
                                                                isEntering && !isFullWidth && "duration-200 ease-out animate-in zoom-in-95",
                                                                isExiting && !isFullWidth && "duration-150 ease-in animate-out zoom-out-95",
                                                            )}
                                                        >
                                                            {navItem.menu}
                                                        </AriaDialog>
                                                    )}
                                                </AriaPopover>
                                            </AriaDialogTrigger>
                                        ) : (
                                            <a
                                                href={navItem.href}
                                                {...(navItem.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                                                onClick={(e) => {
                                                    if (!navItem.isExternal && navItem.href?.startsWith("#")) {
                                                        e.preventDefault();
                                                        const element = document.querySelector(navItem.href);
                                                        element?.scrollIntoView({ behavior: "smooth", block: "start" });
                                                    }
                                                }}
                                                className="group relative inline-flex items-center gap-1 rounded-full px-5 py-2 text-sm font-medium text-white/80 outline-focus-ring transition-all duration-300 hover:bg-white/15 hover:text-white focus:outline-offset-2 focus-visible:outline-2"
                                            >
                                                {navItem.label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                    </nav>

                    <div className="hidden items-center gap-3 md:flex">
                        <a
                            href="https://calendly.com/alfredvanderm/30min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-lg transition-all duration-500 ease-out hover:shadow-[0_8px_30px_-4px_rgba(234,148,225,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {/* Gradient background */}
                            <span className="absolute inset-0 bg-gradient-to-r from-[#F2B25C] via-[#EA94E1] to-[#F2B25C] bg-[length:200%_100%] transition-all duration-500 ease-out group-hover:bg-[position:100%_0]" />
                            {/* Shimmer effect */}
                            <span className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full group-hover:opacity-100 transition-all duration-700 ease-out" />
                            {/* Text */}
                            <span className="relative z-10">Book a Quick Call</span>
                        </a>
                    </div>

                    {/* Mobile menu and menu trigger */}
                    <AriaDialogTrigger>
                        <AriaButton
                            aria-label="Toggle navigation menu"
                            className={({ isFocusVisible, isHovered }) =>
                                cx(
                                    "group ml-auto cursor-pointer rounded-lg p-2 md:hidden",
                                    isHovered && "bg-primary_hover",
                                    isFocusVisible && "outline-2 outline-offset-2 outline-focus-ring",
                                )
                            }
                        >
                            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path
                                    className="hidden text-white group-aria-expanded:block"
                                    d="M18 6L6 18M6 6L18 18"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    className="text-white group-aria-expanded:hidden"
                                    d="M3 12H21M3 6H21M3 18H21"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </AriaButton>
                        <AriaPopover
                            triggerRef={headerRef}
                            className="scrollbar-hide w-full overflow-y-auto md:hidden"
                            offset={8}
                            crossOffset={0}
                            containerPadding={16}
                            placement="bottom"
                        >
                            <AriaDialog className="outline-hidden">
                                <nav className="mx-4 rounded-2xl border border-white/20 bg-black/40 p-4 shadow-2xl backdrop-blur-xl">
                                    <ul className="flex flex-col gap-1">
                                        {items.map((navItem) => (
                                            <MobileNavItem
                                                key={navItem.label}
                                                label={navItem.label}
                                                href={navItem.href}
                                                isExternal={navItem.isExternal}
                                            />
                                        ))}
                                    </ul>

                                    {/* Book a Quick Call button */}
                                    <div className="mt-4 border-t border-white/10 pt-4">
                                        <a
                                            href="https://calendly.com/alfredvanderm/30min"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative block overflow-hidden rounded-full px-5 py-3 text-center text-base font-semibold text-gray-900 shadow-lg transition-all duration-500 ease-out hover:shadow-[0_8px_30px_-4px_rgba(234,148,225,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <span className="absolute inset-0 bg-gradient-to-r from-[#F2B25C] via-[#EA94E1] to-[#F2B25C] bg-[length:200%_100%] transition-all duration-500 ease-out group-hover:bg-[position:100%_0]" />
                                            <span className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full group-hover:opacity-100 transition-all duration-700 ease-out" />
                                            <span className="relative z-10">Book a Quick Call</span>
                                        </a>
                                    </div>
                                </nav>
                            </AriaDialog>
                        </AriaPopover>
                    </AriaDialogTrigger>
                </div>
            </div>
        </header>
    );
};
