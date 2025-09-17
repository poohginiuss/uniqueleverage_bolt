import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Key } from "react-aria-components";
import { Tabs } from "@/components/application/tabs/tabs";
import { NativeSelect } from "@/components/base/select/select-native";
import { useSmoothNavigation } from "@/hooks/use-smooth-navigation";
const tabs = [
    { id: "docs", label: "Documentation" },
    { id: "inventory", label: "Inventory" },
    { id: "marketing", label: "Marketing" },
    { id: "scheduling", label: "Scheduling" },
];

interface LineDemoProps { // Added interface
    onTabChange?: (tab: string) => void;
}

export const LineDemo = ({ onTabChange }: LineDemoProps) => { // Accepted prop
    const [selectedTab, setSelectedTab] = useState<string>("docs");
    const router = useRouter();
    const pathname = usePathname();
    const { navigate } = useSmoothNavigation();

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
        if (selectedTab !== newTab) {
            setSelectedTab(newTab);
        }
    }, [pathname, selectedTab]);

    const handleTabClick = (tabId: string, event: React.MouseEvent) => {
        event.preventDefault();
        
        // Update UI state immediately for responsive feel
        setSelectedTab(tabId);
        onTabChange?.(tabId);
        
        // Use smooth navigation for better transitions
        if (tabId === "inventory") {
            navigate("/inventory/all");
        } else if (tabId === "docs") {
            navigate("/docs/introduction");
        } else if (tabId === "marketing") {
            navigate("/marketing/wizard");
        } else if (tabId === "scheduling") {
            navigate("/scheduling");
        }
    };


    return (
        <div className="flex flex-col gap-4 px-4 pt-6 lg:px-4 lg:pt-6">
            <div className="relative mb-2 flex">
                {/* Gray background line */}
                <div className="w-0.5 bg-border-secondary"></div>

                {/* Active highlight bar (move & resize with JS/React state) */}
                <div
                    className="absolute left-0 w-0.5 bg-fg-brand-primary_alt transition-all duration-150 ease-linear"
                    style={{ 
                        top: selectedTab === "docs" ? "0px" : 
                             selectedTab === "inventory" ? "24px" : 
                             selectedTab === "marketing" ? "48px" : "72px", 
                        height: "20px" 
                    }}
                ></div>

                {/* Menu items */}
                <ul className="relative flex h-full w-full flex-col gap-1.5 pl-3 md:gap-1.5">
                    <li className="flex w-full">
                    <a
                        href="/docs"
                        onClick={(e) => handleTabClick("docs", e)}
                        className={`w-full rounded-xs py-0 text-sm font-semibold outline-focus-ring 
                                focus-visible:outline-2 focus-visible:outline-offset-2 md:py-0 md:text-sm 
                                ${selectedTab === "docs" ? "text-brand-secondary" : "text-quaternary"}`}
                    >
                        Documentation
                    </a>
                    </li>
                    <li className="flex w-full">
                    <a
                        href="/docs"
                        onClick={(e) => handleTabClick("inventory", e)}
                        className={`w-full rounded-xs py-0 text-sm font-semibold outline-focus-ring 
                                focus-visible:outline-2 focus-visible:outline-offset-2 md:py-0 md:text-sm 
                                ${selectedTab === "inventory" ? "text-brand-secondary" : "text-quaternary"}`}
                    >
                        Inventory
                    </a>
                    </li>
                    <li className="flex w-full">
                    <a
                        href="/docs"
                        onClick={(e) => handleTabClick("marketing", e)}
                        className={`w-full rounded-xs py-0 text-sm font-semibold outline-focus-ring 
                                focus-visible:outline-2 focus-visible:outline-offset-2 md:py-0 md:text-sm 
                                ${selectedTab === "marketing" ? "text-brand-secondary" : "text-quaternary"}`}
                    >
                        Marketing
                    </a>
                    </li>
                    <li className="flex w-full">
                    <a
                        href="/docs"
                        onClick={(e) => handleTabClick("scheduling", e)}
                        className={`w-full rounded-xs py-0 text-sm font-semibold outline-focus-ring 
                                focus-visible:outline-2 focus-visible:outline-offset-2 md:py-0 md:text-sm 
                                ${selectedTab === "scheduling" ? "text-brand-secondary" : "text-quaternary"}`}
                    >
                        Scheduling
                    </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};