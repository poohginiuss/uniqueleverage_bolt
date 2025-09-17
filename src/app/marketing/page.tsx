"use client";

import React from "react";
import { Breadcrumbs } from "@/components/application/breadcrumbs/breadcrumbs";
import { ChevronDown } from "@untitledui/icons";
import { ULIntroPage } from "@/components/landing/docs/intro-content";

export default function MarketingPage() {
    return (
        <>
            <section className="flex h-15 pl-7 pr-7 w-full items-center justify-between bg-primary md:h-15 border-b border-secondary">
                <Breadcrumbs type="button">
                    <Breadcrumbs.Item href="#">Marketing</Breadcrumbs.Item>
                    <Breadcrumbs.Item href="#">Ad Wizard</Breadcrumbs.Item>
                </Breadcrumbs>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <span>Account</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
            </section>
            <ULIntroPage />
        </>
    );
}
