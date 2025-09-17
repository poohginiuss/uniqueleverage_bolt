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
import { ULInstallPage } from "@/components/landing/docs/install-content";

export default () => {
    return (
        <div className="flex flex-col lg:flex-row">
            <SidebarNavigationSimple
                activeUrl="/docs/request-feeds"
                items={[
                    {
                        label: "Getting started",
                        href: "/",
                        items: [
                            { label: "Introduction", href: "/docs/introduction", icon: Star06 },
                            { label: "Request Feed", href: "/docs/request-feeds", icon: Flag05 },
                        ],
                    },
                    {
                        label: "Integrations",
                        href: "/projects",
                        items: [
                            { label: "Inventory", href: "/projects/all" },
                            { label: "Social", href: "/projects/personal" },
                            { label: "Calendar", href: "/projects/team" },
                            { label: "Meta Pixel", href: "/projects/shared-with-me" },
                        ],
                    },
                ]}
            />
            <main className="min-w-0 flex-1 bg-secondary_subtle pb-12 shadow-none lg:bg-primary">
                <header className="max-lg:hidden sticky top-0 z-50 ">
                    <section
                        className="flex h-15 pl-7 w-full items-center bg-primary md:h-15 border-b border-secondary"
                    >
                        <div className="max-lg:hiddenflex flex-col gap-4 lg:flex-row lg:justify-between">
                            <Breadcrumbs type="button">
                                <Breadcrumbs.Item href="#">Docs</Breadcrumbs.Item>
                                <Breadcrumbs.Item href="#">Getting started</Breadcrumbs.Item>
                                <Breadcrumbs.Item href="#">Installation</Breadcrumbs.Item>
                            </Breadcrumbs>
                        </div>
                    </section>
                </header>
                <ULInstallPage />
            </main>
        </div>
    );
};
