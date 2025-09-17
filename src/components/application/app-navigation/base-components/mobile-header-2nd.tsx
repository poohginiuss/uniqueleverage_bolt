"use client";

import type { PropsWithChildren } from "react";
import { X as CloseIcon, Menu02, SearchLg } from "@untitledui/icons";
import {
    Button as AriaButton,
    Dialog as AriaDialog,
    DialogTrigger as AriaDialogTrigger,
    Modal as AriaModal,
    ModalOverlay as AriaModalOverlay,
} from "react-aria-components";
import { UntitledLogo } from "@/components/foundations/logo/untitledui-logo-2nd";
import { UntitledLogoMinimal } from "@/components/foundations/logo/untitledui-logo-minimal-2nd";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";

export const MobileNavigationHeader = ({ 
    children, 
    hideLogo = false, 
    showSearchOnMobile = false,
    showBackButton = false, 
    onBack,
    searchValue = "",
    onSearchChange
}: PropsWithChildren & { 
    hideLogo?: boolean; 
    showSearchOnMobile?: boolean;
    showBackButton?: boolean; 
    onBack?: () => void;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
}) => {
    return (
        <AriaDialogTrigger>
            <header className={`flex h-16 items-center justify-between border-b border-secondary bg-primary px-4 lg:hidden relative z-50`}>
                {/* Left side - consistent positioning */}
                <div className="flex items-center justify-start flex-1">
                    {showBackButton && onBack ? (
                        // Show back button for VSP pages
                        <button 
                            onClick={onBack} 
                            className="inline-flex items-center justify-center w-10 h-10 text-black hover:text-gray-700 transition-all rounded-full hover:bg-gray-100"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7"/>
                            </svg>
                        </button>
                    ) : hideLogo ? (
                        showSearchOnMobile ? (
                            // Show search bar for inventory/all page
                            <div className="flex items-center gap-3 flex-1">
                                {/* UL Logo - Always visible */}
                                <div className="flex items-center justify-start overflow-visible h-7 w-max">
                                    <UntitledLogoMinimal />
                                </div>
                                <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto px-2">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                            <SearchLg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            aria-label="Search"
                                            placeholder="Search"
                                            value={searchValue}
                                            onChange={(e) => onSearchChange?.(e.target.value)}
                                            className="w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm text-gray-900 placeholder-gray-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Empty space when logo is hidden but no search
                            <div className="flex-1"></div>
                        )
                    ) : (
                        // Default layout with logo
                        <UntitledLogo />
                    )}
                </div>

                {/* Right side - hamburger menu - consistent positioning */}
                <div className="flex items-center justify-end">
                    <AriaButton
                        aria-label="Expand navigation menu"
                        className="group flex items-center justify-center rounded-lg bg-primary p-2 text-fg-secondary outline-focus-ring hover:bg-primary_hover hover:text-fg-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2 w-10 h-10"
                    >
                        <Menu02 className="size-6 transition duration-200 ease-in-out group-aria-expanded:opacity-0" />
                        <CloseIcon className="absolute size-6 opacity-0 transition duration-200 ease-in-out group-aria-expanded:opacity-100" />
                    </AriaButton>
                </div>
            </header>

            <AriaModalOverlay
                isDismissable
                className={({ isEntering, isExiting }) =>
                    cx(
                        "fixed inset-0 z-50 cursor-pointer bg-overlay/70 pr-16 backdrop-blur-md lg:hidden",
                        isEntering && "duration-300 ease-in-out animate-in fade-in",
                        isExiting && "duration-200 ease-in-out animate-out fade-out",
                    )
                }
            >
                {({ state }) => (
                    <>
                        <AriaButton
                            aria-label="Close navigation menu"
                            onPress={() => state.close()}
                            className="fixed top-3 right-2 flex cursor-pointer items-center justify-center rounded-lg p-2 text-fg-white/70 outline-focus-ring hover:bg-white/10 hover:text-fg-white focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            <CloseIcon className="size-6" />
                        </AriaButton>

                        <AriaModal className="w-full cursor-auto will-change-transform">
                            <AriaDialog className="h-dvh outline-hidden focus:outline-hidden">{children}</AriaDialog>
                        </AriaModal>
                    </>
                )}
            </AriaModalOverlay>
        </AriaDialogTrigger>
    );
};
