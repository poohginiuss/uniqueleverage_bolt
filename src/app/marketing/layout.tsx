"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarNavigationSimple } from "@/components/landing/docs/sidebar-docs";
import { SearchContext } from "@/contexts/search-context";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    
    // Check if we're on a marketing sub-page
    const isMarketingSubPage = pathname.includes('/marketing/');
    const hideLogoOnMobile = false;
    const showSearchOnMobile = false; // No search for marketing pages
    
    return (
        <SearchContext.Provider value={{ searchValue, setSearchValue }}>
            <div className="flex flex-col lg:flex-row min-h-screen layout-container">
                <SidebarNavigationSimple
                    activeUrl={pathname}
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    hideLogoOnMobile={hideLogoOnMobile}
                    showSearchOnMobile={showSearchOnMobile}
                    showBackButton={false}
                    onBack={() => {}}
                    items={[
                        {
                            label: "Campaigns",
                            items: [
                                { label: "Ad Wizard", href: "/marketing/wizard" },
                            ],
                        },
                    ]}
                />
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </SearchContext.Provider>
    );
}
