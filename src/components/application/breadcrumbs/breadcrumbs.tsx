"use client";

import React, { type ReactNode, createContext, useState } from "react";
import { Breadcrumbs as AriaBreadcrumbs } from "react-aria-components";
import { BreadcrumbItem } from "@/components/application/breadcrumbs/breadcrumb-item";
import { cx } from "@/utils/cx";

export type BreadcrumbType = "text" | "text-line" | "button";

export const BreadcrumbsContext = createContext<{ divider: "chevron" | "slash"; type: BreadcrumbType }>({
    divider: "chevron",
    type: "text",
});

interface BreadcrumbsProps {
    divider?: "chevron" | "slash";
    children: ReactNode;
    type?: BreadcrumbType;
    className?: string;
    /**
     * The maximum number of visible items. If the number of items
     * exceeds this value, the breadcrumbs will collapse into a single
     * item with an ellipsis that can be expanded.
     */
    maxVisibleItems?: number;
}

const styles = {
    text: "gap-1.5 md:gap-2",
    "text-line": "pl-2 gap-1.5 md:gap-2 py-2 after:pointer-events-none after:absolute after:inset-0 after:border-b after:border-t after:border-secondary",
    button: "gap-0.5 md:gap-1",
};

const Breadcrumbs = ({ children, divider = "chevron", type = "text", className, maxVisibleItems = 4 }: BreadcrumbsProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const visibleItems = (() => {
        const childrenArray = React.Children.toArray(children);

        if (!maxVisibleItems || childrenArray.length <= maxVisibleItems || isExpanded) {
            return childrenArray;
        }

        const firstItems = childrenArray.slice(0, Math.ceil(maxVisibleItems / 2));
        const lastItems = childrenArray.slice(-Math.floor((maxVisibleItems - 1) / 2));
        const ellipsisItem = <BreadcrumbItem isEllipsis divider={divider} type={type} onClick={() => setIsExpanded(true)} key="ellipsis" />;

        return [...firstItems, ellipsisItem, ...lastItems];
    })();

    return (
        <nav aria-label="Breadcrumbs" className={cx("min-w-0", className)}>
            <BreadcrumbsContext.Provider value={{ divider, type }}>
                <AriaBreadcrumbs className={cx("relative flex", styles[type])}>{visibleItems}</AriaBreadcrumbs>
            </BreadcrumbsContext.Provider>
        </nav>
    );
};

Breadcrumbs.Item = BreadcrumbItem;

export { Breadcrumbs };
