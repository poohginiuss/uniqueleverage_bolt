
"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SearchLg } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { UntitledLogo } from "@/components/foundations/logo/untitledui-logo-2nd";
import { cx } from "@/utils/cx";
import { MobileNavigationHeader } from "../../application/app-navigation/base-components/mobile-header-2nd";
import { NavList } from "../../application/app-navigation/base-components/docs-nav-list";
import { LineDemo } from "@/components/landing/docs/docs-navmenu";
import type { NavItemType } from "../../application/app-navigation/config";

interface SidebarNavigationProps {
    /** URL of the currently active item. */
    activeUrl?: string;
    /** List of items to display. */
    items: NavItemType[];
    /** List of footer items to display. */
    footerItems?: NavItemType[];
    /** Feature card to display. */
    featureCard?: ReactNode;
    /** Whether to show the account card. */
    showAccountCard?: boolean;
    /** Whether to hide the right side border. */
    hideBorder?: boolean;
    /** Additional CSS classes to apply to the sidebar. */
    className?: string;
    /** Currently selected tab from LineDemo */
    selectedTab?: string; // Added prop
    /** Search functionality */
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    /** Whether to hide logo on mobile (for VSP pages) */
    hideLogoOnMobile?: boolean;
    /** Whether to show search bar on mobile (only for inventory/all page) */
    showSearchOnMobile?: boolean;
    /** Whether to show back button on mobile */
    showBackButton?: boolean;
    /** Back button click handler */
    onBack?: () => void;
}

export const SidebarNavigationSimple = ({
    activeUrl,
    items,
    footerItems = [],
    featureCard,
    showAccountCard = true,
    hideBorder = false,
    className,
    selectedTab, // Destructured prop
    searchValue = "",
    onSearchChange,
    hideLogoOnMobile = false,
    showSearchOnMobile = false,
    showBackButton = false,
    onBack,
}: SidebarNavigationProps) => {
    const MAIN_SIDEBAR_WIDTH = 249;
    const [currentTab, setCurrentTab] = useState<string>("docs");
    const router = useRouter();
    const pathname = usePathname();

    // Set initial tab based on current URL - optimized to prevent unnecessary updates
    useEffect(() => {
        let newTab = "docs";
        if (pathname.includes("/inventory")) {
            newTab = "inventory";
        } else if (pathname.includes("/marketing")) {
            newTab = "marketing";
        } else if (pathname.includes("/scheduling")) {
            newTab = "scheduling";
        }
        
        // Only update if the tab actually changed
        if (currentTab !== newTab) {
            setCurrentTab(newTab);
        }
    }, [pathname, currentTab]);

    const handleTabChange = (tab: string) => { // Added handler
        setCurrentTab(tab);
    };

    const handleInventoryClick = () => {
        setCurrentTab("inventory");
        router.push("/inventory/all");
    };

    const content = (
        <aside
            style={
                {
                    "--width": `${MAIN_SIDEBAR_WIDTH}px`,
                } as React.CSSProperties
            }
            className={cx(
                "flex h-full w-full max-w-full flex-col justify-between overflow-auto bg-primary pt-5 lg:w-(--width) page-transition",
                !hideBorder && "border-secondary md:border-r",
                className,
            )}
        >
            <div className="flex flex-col gap-4 px-4">
                <UntitledLogo />
                <Input 
                    size="sm" 
                    aria-label="Search" 
                    placeholder="Search vehicles..." 
                    icon={SearchLg}
                    value={searchValue}
                    onChange={(value) => onSearchChange?.(value)}
                />
            </div>
            <LineDemo onTabChange={handleTabChange} />
            {/* <hr className="border-t-1 border-border-secondary mt-2 mx-4"></hr> */}
            <div className="flex-1 px-2">
                {currentTab === "docs" && <NavList activeUrl={activeUrl} items={items} />}
                {currentTab === "inventory" && (
                    <NavList 
                        activeUrl={pathname} 
                        items={[
                            {
                                label: "Catalog",
                                href: "/inventory",
                                items: [
                                    { label: "All Inventory", href: "/inventory/all" },
                                ],
                            },
                        ]} 
                    />
                )}
                {currentTab === "marketing" && (
                    <NavList 
                        activeUrl="/marketing/wizard"
                        items={[
                            {
                                label: "Campaigns",
                                href: "/marketing",
                                items: [
                                    { label: "Ad Wizard", href: "/marketing/wizard" },
                                ],
                            },
                        ]} 
                    />
                )}
            </div>

            <div className="mt-auto flex flex-col gap-4 px-2 py-4">
            </div>
        </aside>
    );

    return (
        <>
            {/* Mobile header navigation */}
            <MobileNavigationHeader 
                hideLogo={hideLogoOnMobile} 
                showSearchOnMobile={showSearchOnMobile}
                showBackButton={showBackButton} 
                onBack={onBack}
                searchValue={searchValue}
                onSearchChange={onSearchChange}
            >
                {content}
            </MobileNavigationHeader>

            {/* Desktop sidebar navigation */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex">{content}</div>

            {/* Placeholder to take up physical space because the real sidebar has `fixed` position. */}
            <div
                style={{
                    paddingLeft: MAIN_SIDEBAR_WIDTH,
                }}
                className="invisible hidden lg:sticky lg:top-0 lg:bottom-0 lg:left-0 lg:block"
            />
        </>
    );
};
