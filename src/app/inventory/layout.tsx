"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarNavigationSimple } from "@/components/landing/docs/sidebar-docs";
import { SearchContext } from "@/contexts/search-context";

export default function InventoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    
    // Check if we're on a vehicle detail page (VSP) or inventory/all page - hide logo on mobile
    const isVehicleDetailPage = pathname.includes('/stock/');
    const isInventoryAllPage = pathname === '/inventory/all';
    const hideLogoOnMobile = isVehicleDetailPage || isInventoryAllPage;
    const showSearchOnMobile = isInventoryAllPage; // Only show search on inventory/all page, not VSP
    
    // Debug log
    console.log('Current pathname:', pathname, 'isVehicleDetailPage:', isVehicleDetailPage);

    return (
        <SearchContext.Provider value={{ searchValue, setSearchValue }}>
            <div className="flex flex-col lg:flex-row min-h-screen layout-container">
                <SidebarNavigationSimple
                    activeUrl={pathname}
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    hideLogoOnMobile={hideLogoOnMobile}
                    showSearchOnMobile={showSearchOnMobile}
                    showBackButton={isVehicleDetailPage}
                    onBack={() => {
                        // Navigate back to inventory listing
                        console.log('Back button clicked, navigating to /inventory/all');
                        router.push('/inventory/all');
                    }}
                    items={[
                        {
                            label: "Catalog",
                            items: [
                                { label: "All Inventory", href: "/inventory/all" },
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
