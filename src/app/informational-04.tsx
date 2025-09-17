"use client";

import { useMemo, useState } from "react";
import {
    ArrowLeft,
    BarChartSquare02,
    Check,
    CheckDone01,
    Download04,
    FilterFunnel01,
    HomeLine,
    LayoutAlt01,
    MessageChatCircle,
    PieChart03,
    ReverseLeft,
    Rows01,
    SearchLg,
    Settings01,
    Users01,
    X,
} from "@untitledui/icons";
import { type SortDescriptor } from "react-aria-components";
import { FeaturedCardReferralLink } from "@/components/application/app-navigation/base-components/featured-cards.demo";
import { SidebarNavigationSimple } from "@/components/landing/docs/sidebar-docs";
import { Breadcrumbs } from "@/components/application/breadcrumbs/breadcrumbs";
import { PaginationPageDefault } from "@/components/application/pagination/pagination";
import { Table, TableCard } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { BadgeWithDot, BadgeWithIcon } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { Dot } from "@/components/foundations/dot-icon";

// Helper functions for formatting
const formatDate = (timestamp: number): string =>
    new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

const orders = [
    {
        id: "order-01",
        invoice: "INV-3066",
        date: new Date(2025, 0, 6).getTime(),
        status: "paid",
        customer: {
            id: "olivia",
            name: "Olivia Rhye",
            email: "olivia@untitledui.com",
            avatarUrl: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80",
            initials: "OR",
        },
        purchase: "Monthly",
    },
    {
        id: "order-02",
        invoice: "INV-3065",
        date: new Date(2025, 0, 6).getTime(),
        status: "paid",
        customer: {
            id: "phoenix",
            name: "Phoenix Baker",
            email: "phoenix@untitledui.com",
            avatarUrl: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80",
            initials: "PB",
        },
        purchase: "Monthly",
    },
    {
        id: "order-03",
        invoice: "INV-3064",
        date: new Date(2025, 0, 6).getTime(),
        status: "paid",
        customer: { id: "lana", name: "Lana Steiner", email: "lana@untitledui.com", avatarUrl: "", initials: "LS" },
        purchase: "Monthly",
    },
    {
        id: "order-04",
        invoice: "INV-3063",
        date: new Date(2025, 0, 5).getTime(),
        status: "paid",
        customer: { id: "demi", name: "Demi Wilkinson", email: "demi@untitledui.com", avatarUrl: "", initials: "DW" },
        purchase: "Monthly",
    },
    {
        id: "order-05",
        invoice: "INV-3062",
        date: new Date(2025, 0, 5).getTime(),
        status: "refunded",
        customer: {
            id: "candice",
            name: "Candice Wu",
            email: "candice@untitledui.com",
            avatarUrl: "https://www.untitledui.com/images/avatars/candice-wu?fm=webp&q=80",
            initials: "CW",
        },
        purchase: "Monthly",
    },
    {
        id: "order-06",
        invoice: "INV-3061",
        date: new Date(2025, 0, 5).getTime(),
        status: "paid",
        customer: { id: "natali", name: "Natali Craig", email: "natali@untitledui.com", avatarUrl: "", initials: "NC" },
        purchase: "Monthly",
    },
    {
        id: "order-07",
        invoice: "INV-3060",
        date: new Date(2025, 0, 4).getTime(),
        status: "cancelled",
        customer: {
            id: "drew",
            name: "Drew Cano",
            email: "drew@untitledui.com",
            avatarUrl: "https://www.untitledui.com/images/avatars/drew-cano?fm=webp&q=80",
            initials: "DC",
        },
        purchase: "Monthly",
    },
];

export const Informational04 = () => {
    const [status, setStatus] = useState("paid");
    const [category, setCategory] = useState("all");
    const [customer, setCustomer] = useState("all");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "invoice",
        direction: "descending",
    });

    const sortedItems = useMemo(() => {
        if (!sortDescriptor) return orders;

        return orders.toSorted((a, b) => {
            const first = a[sortDescriptor.column as keyof typeof a];
            const second = b[sortDescriptor.column as keyof typeof b];

            // Handle numbers
            if (typeof first === "number" && typeof second === "number") {
                return sortDescriptor.direction === "ascending" ? first - second : second - first;
            }

            // Handle strings
            if (typeof first === "string" && typeof second === "string") {
                const result = first.localeCompare(second);
                return sortDescriptor.direction === "ascending" ? result : -result;
            }

            return 0;
        });
    }, [sortDescriptor]);

    return (
        <div className="flex flex-col lg:flex-row">
            <SidebarNavigationSimple
                items={[
                    {
                        label: "Home",
                        href: "/",
                        icon: HomeLine,
                        items: [
                            { label: "Overview", href: "/overview" },
                            { label: "Products", href: "/products" },
                            { label: "Orders", href: "/orders" },
                            { label: "Customers", href: "/customers" },
                        ],
                    },
                    {
                        label: "Dashboard",
                        href: "/dashboard",
                        icon: BarChartSquare02,
                        items: [
                            { label: "Overview", href: "/dashboard/overview" },
                            { label: "Notifications", href: "/dashboard/notifications", badge: 10 },
                            { label: "Analytics", href: "/dashboard/analytics" },
                            { label: "Saved reports", href: "/dashboard/saved-reports" },
                        ],
                    },
                    {
                        label: "Projects",
                        href: "/projects",
                        icon: Rows01,
                        items: [
                            { label: "View all", href: "/projects/all" },
                            { label: "Personal", href: "/projects/personal" },
                            { label: "Team", href: "/projects/team" },
                            { label: "Shared with me", href: "/projects/shared-with-me" },
                            { label: "Archive", href: "/projects/archive" },
                        ],
                    },
                    {
                        label: "Tasks",
                        href: "/tasks",
                        icon: CheckDone01,
                        badge: 8,
                        items: [
                            { label: "My tasks", href: "/tasks/my-tasks" },
                            { label: "Assigned to me", href: "/tasks/assigned" },
                            { label: "Completed", href: "/tasks/completed" },
                            { label: "Upcoming", href: "/tasks/upcoming" },
                        ],
                    },
                    {
                        label: "Reporting",
                        href: "/reporting",
                        icon: PieChart03,
                        items: [
                            { label: "Dashboard", href: "/reporting/dashboard" },
                            { label: "Revenue", href: "/reporting/revenue" },
                            { label: "Performance", href: "/reporting/performance" },
                            { label: "Export data", href: "/reporting/export" },
                        ],
                    },
                    {
                        label: "Users",
                        href: "/users",
                        icon: Users01,
                        items: [
                            { label: "All users", href: "/users/all" },
                            { label: "Admins", href: "/users/admins" },
                            { label: "Team members", href: "/users/team" },
                            { label: "Permissions", href: "/users/permissions" },
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
            <main className="min-w-0 flex-1 bg-secondary_subtle pt-8 pb-12 shadow-none lg:bg-primary">
                <div className="mx-auto mb-8 flex max-w-container flex-col gap-5 px-4 lg:px-8">
                    {/* Page header simple */}
                    <div className="relative flex flex-col gap-4">
                        <div className="max-lg:hidden">
                            <Breadcrumbs type="button">
                                <Breadcrumbs.Item href="#" icon={HomeLine} />
                                <Breadcrumbs.Item href="#">Dashboard</Breadcrumbs.Item>
                                <Breadcrumbs.Item href="#">Orders</Breadcrumbs.Item>
                            </Breadcrumbs>
                        </div>
                        <div className="flex lg:hidden">
                            <Button href="#" color="link-gray" size="md" iconLeading={ArrowLeft}>
                                Back
                            </Button>
                        </div>
                        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                            <div className="flex flex-col gap-0.5 md:gap-1">
                                <p className="text-xl font-semibold text-primary lg:text-display-xs">Orders</p>
                            </div>
                            <div className="flex flex-col gap-4 lg:flex-row">
                                <div className="flex items-start gap-3">
                                    <Button iconLeading={Download04} color="secondary" size="md">
                                        <span className="hidden lg:inline">Download </span>
                                        PDF
                                    </Button>
                                    <Button iconLeading={Download04} color="secondary" size="md">
                                        <span className="hidden lg:inline">Download </span>
                                        CSV
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-auto flex max-w-container flex-col px-4 lg:gap-8 lg:px-8">
                    <div className="hidden gap-x-3 rounded-xl bg-secondary p-5 lg:flex">
                        <Input label="Search for order" className="lg:max-w-90" size="sm" shortcut aria-label="Search" placeholder="Search" icon={SearchLg} />
                        <div className="flex flex-1 gap-x-3">
                            <Select
                                className="flex-1"
                                label="Status"
                                selectedKey={status}
                                placeholderIcon={<Dot className="size-2.5 shrink-0 text-fg-success-secondary in-disabled:text-fg-disabled_subtle" />}
                                onSelectionChange={(value) => setStatus(value as string)}
                                items={[
                                    {
                                        id: "all",
                                        label: "All",
                                        icon: <Dot className="size-2.5 shrink-0 text-fg-brand-secondary in-disabled:text-fg-disabled_subtle" />,
                                    },
                                    {
                                        id: "paid",
                                        label: "Paid",
                                        icon: <Dot className="size-2.5 shrink-0 text-fg-success-secondary in-disabled:text-fg-disabled_subtle" />,
                                    },
                                    {
                                        id: "refunded",
                                        label: "Refunded",
                                        icon: <Dot className="size-2.5 shrink-0 text-fg-quaternary in-disabled:text-fg-disabled_subtle" />,
                                    },
                                    {
                                        id: "cancelled",
                                        label: "Cancelled",
                                        icon: <Dot className="size-2.5 shrink-0 text-fg-error-primary in-disabled:text-fg-disabled_subtle" />,
                                    },
                                ]}
                            >
                                {(item) => (
                                    <Select.Item id={item.id} icon={item.icon}>
                                        {item.label}
                                    </Select.Item>
                                )}
                            </Select>
                            <Select
                                className="flex-1"
                                label="Category"
                                selectedKey={category}
                                onSelectionChange={(value) => setCategory(value as string)}
                                items={[
                                    { id: "all", label: "All" },
                                    { id: "books", label: "Books" },
                                    { id: "tech", label: "Tech" },
                                    { id: "legal", label: "Legal" },
                                ]}
                            >
                                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                            </Select>
                            <Select
                                className="flex-1"
                                label="Customer"
                                selectedKey={customer}
                                onSelectionChange={(value) => setCustomer(value as string)}
                                items={[
                                    { id: "all", label: "All" },
                                    { id: "olivia", label: "Olivia Rhye" },
                                    { id: "phoenix", label: "Phoenix Baker" },
                                    { id: "lana", label: "Lana Steiner" },
                                    { id: "demi", label: "Demi Wilkinson" },
                                    { id: "candice", label: "Candice Wu" },
                                    { id: "natali", label: "Natali Craig" },
                                    { id: "drew", label: "Drew Cano" },
                                ]}
                            >
                                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                            </Select>
                        </div>
                    </div>
                    <div className="mb-6 flex flex-col gap-4 lg:hidden">
                        <Input className="lg:max-w-90" size="sm" shortcut aria-label="Search" placeholder="Search" icon={SearchLg} />
                        <Button iconLeading={FilterFunnel01} color="secondary" size="md">
                            Filters
                        </Button>
                    </div>
                    <TableCard.Root className="-mx-4 rounded-none shadow-xs lg:mx-0 lg:rounded-xl">
                        <Table
                            aria-label="Trades"
                            selectionMode="multiple"
                            sortDescriptor={sortDescriptor}
                            onSortChange={setSortDescriptor}
                            className="bg-primary"
                        >
                            <Table.Header>
                                <Table.Head id="invoice" isRowHeader allowsSorting label="Invoice" className="w-full" />
                                <Table.Head id="date" label="Date" />
                                <Table.Head id="status" label="Status" />
                                <Table.Head id="customer" label="Customer" />
                                <Table.Head id="purchase" label="Purchase" />
                                <Table.Head id="actions" />
                            </Table.Header>
                            <Table.Body items={sortedItems}>
                                {(order) => (
                                    <Table.Row id={order.id}>
                                        <Table.Cell className="text-sm font-medium whitespace-nowrap text-primary">{order.invoice}</Table.Cell>
                                        <Table.Cell className="whitespace-nowrap">{formatDate(order.date)}</Table.Cell>
                                        <Table.Cell>
                                            <BadgeWithIcon
                                                color={
                                                    order.status === "paid"
                                                        ? "success"
                                                        : order.status === "refunded"
                                                          ? "gray"
                                                          : order.status === "cancelled"
                                                            ? "error"
                                                            : "gray"
                                                }
                                                iconLeading={
                                                    order.status === "paid"
                                                        ? Check
                                                        : order.status === "refunded"
                                                          ? ReverseLeft
                                                          : order.status === "cancelled"
                                                            ? X
                                                            : Check
                                                }
                                                size="sm"
                                                type="color"
                                                className="capitalize"
                                            >
                                                {order.status}
                                            </BadgeWithIcon>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="group flex items-center gap-3 outline-hidden">
                                                <Avatar src={order.customer.avatarUrl} alt={order.customer.name} size="sm" initials={order.customer.initials} />
                                                <div>
                                                    <p className="text-sm font-medium text-primary">{order.customer.name}</p>
                                                    <p className="text-sm font-medium text-tertiary">{order.customer.email}</p>
                                                </div>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell className="font-medium!">{order.purchase}</Table.Cell>
                                        <Table.Cell>
                                            <div className="flex gap-3">
                                                <Button size="sm" color="link-gray">
                                                    Delete
                                                </Button>
                                                <Button size="sm" color="link-color">
                                                    Edit
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </TableCard.Root>
                </div>
                <div className="mt-6 px-4 lg:px-8">
                    <PaginationPageDefault rounded page={1} total={10} />
                </div>
            </main>
        </div>
    );
};
