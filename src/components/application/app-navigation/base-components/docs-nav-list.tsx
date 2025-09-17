"use client";

import { useState } from "react";
import { cx } from "@/utils/cx";
import type { NavItemDividerType, NavItemType } from "../config";
import { NavItemBase } from "./nav-item";

interface NavListProps {
    /** URL of the currently active item. */
    activeUrl?: string;
    /** Additional CSS classes to apply to the list. */
    className?: string;
    /** List of items to display. */
    items: (NavItemType | NavItemDividerType)[];
}

export const NavList = ({ activeUrl, items, className }: NavListProps) => {
    const [open, setOpen] = useState(false);
    const activeItem = items.find((item) => item.href === activeUrl || item.items?.some((subItem) => subItem.href === activeUrl));
    const [currentItem, setCurrentItem] = useState(activeItem);

    return (
        <ul className={cx("mt-4 flex flex-col px-1 lg:px-2", className)}>
            {items.map((item, index) => {
                if (item.divider) {
                    return (
                        <li key={index} className="w-full px-0.5 py-2">
                            <hr className="h-px w-full border-none bg-border-secondary" />
                        </li>
                    );
                }

                if (item.items?.length) {
                    return (
                        <details
                            key={item.label}
                            open={true}
                            className="appearance-none py-0.5"
                            onToggle={(e) => {
                                setOpen(e.currentTarget.open);
                                setCurrentItem(item);
                            }}
                        >
                            <NavItemBase href={item.href} badge={item.badge} icon={item.icon} type="collapsible">
                                {item.label}
                            </NavItemBase>

                            <dd>
                                <ul className="">
                                    {item.items.map((childItem) => (
                                        <li key={childItem.label} className="">
                                            <NavItemBase
                                                href={childItem.href}
                                                badge={childItem.badge}
                                                icon={childItem.icon}
                                                type="collapsible-child"
                                                current={activeUrl === childItem.href}
                                            >
                                                {childItem.label}
                                            </NavItemBase>
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </details>
                    );
                }

                return (
                    <li key={item.label} className="py-0.5">
                        <NavItemBase
                            type="link"
                            badge={item.badge}
                            icon={item.icon}
                            href={item.href}
                            current={currentItem?.href === item.href}
                            open={open}
                        >
                            {item.label}
                        </NavItemBase>
                    </li>
                );
            })}
        </ul>
    );
};
