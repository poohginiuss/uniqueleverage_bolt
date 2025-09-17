"use client";

import {
    Colors,
    Cube01,
    Figma,
    File04,
    Flag05,
    Globe01,
    LayoutAlt01,
    MessageChatCircle,
    Settings01,
    Star06,
} from "@untitledui/icons";
import { FeaturedCardReferralLink } from "@/components/application/app-navigation/base-components/featured-cards.demo";
import { SidebarNavigationSimple } from "@/components/landing/docs/sidebar-docs";
import { Breadcrumbs } from "@/components/application/breadcrumbs/breadcrumbs";
import { BadgeWithDot, BadgeWithIcon } from "@/components/base/badges/badges";
import { VAutoPage } from "@/components/landing/docs/vauto-content";
import { ChevronDown } from "@untitledui/icons";

export default () => {
    return (
        <div className="flex flex-col lg:flex-row">
            <SidebarNavigationSimple
                activeUrl="/docs/vauto"
                items={[
                    {
                        label: "Getting started",
                        href: "/docs/introduction",
                        items: [
                            { label: "Introduction", href: "/docs/introduction", icon: Star06 },
                            { label: "Request Feed", href: "/docs/request-feeds", icon: Flag05 },
                        ],
                    },
                    {
                        label: "Partners",
                        href: "/docs/integrations",
                        items: [
                            { label: "Integrations", href: "/docs/integrations" },
                        ],
                    },
                ]}
                footerItems={[
                    {
                        label: "Settings",
                        href: "/settings",
                        icon: Settings01,
                    },
                    {
                        label: "Support",
                        href: "/support",
                        icon: MessageChatCircle,
                        badge: (
                            <BadgeWithDot color="success" type="modern" size="sm">
                                Online
                            </BadgeWithDot>
                        ),
                    },
                    {
                        label: "Open in browser",
                        href: "https://www.untitledui.com/",
                        icon: LayoutAlt01,
                    },
                ]}
                featureCard={
                    <FeaturedCardReferralLink
                        title="Refer a friend"
                        description="Earn 50% back for 12 months when someone uses your link."
                        onDismiss={() => {}}
                    />
                }
            />
            <main className="min-w-0 flex-1 bg-secondary_subtle pb-12 shadow-none lg:bg-primary page-transition content-area">
                <header className="max-lg:hidden sticky top-0 z-50 ">
                    <section
                        className="flex h-15 pl-7 pr-7 w-full items-center justify-between bg-primary md:h-15 border-b border-secondary"
                    >
                        <Breadcrumbs type="button">
                            <Breadcrumbs.Item href="#">Docs</Breadcrumbs.Item>
                            <Breadcrumbs.Item href="/docs/introduction">Getting started</Breadcrumbs.Item>
                            <Breadcrumbs.Item href="#">vAuto</Breadcrumbs.Item>
                        </Breadcrumbs>
                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            <span>Account</span>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        </button>
                    </section>
                </header>
                <VAutoPage />
            </main>
        </div>
    );
};
