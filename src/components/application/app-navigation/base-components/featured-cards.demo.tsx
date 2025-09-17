"use client";

import type { FC, HTMLAttributes, ReactNode } from "react";
import { useState } from "react";
import { AlertCircle, Check, Copy01, Link03, MessageChatCircle } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { AvatarAddButton } from "@/components/base/avatar/base-components";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Input } from "@/components/base/input/input";
import { ProgressBarCircle } from "@/components/base/progress-indicators/progress-circles";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { PlayIcon } from "@/components/base/video-player/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { GradientScan, QRCode } from "@/components/shared-assets/qr-code";
import { useClipboard } from "@/hooks/use-clipboard";
import { cx } from "@/utils/cx";

interface FeaturedCardCommonProps {
    title: string;
    description: ReactNode;
    confirmLabel: string;
    className?: string;
    onDismiss: () => void;
    onConfirm: () => void;
}

export const FeaturedCardProgressBar = ({
    title,
    description,
    confirmLabel,
    progress,
    className,
    onDismiss,
    onConfirm,
}: FeaturedCardCommonProps & {
    progress: number;
}) => {
    return (
        <div className={cx("relative flex flex-col rounded-xl bg-secondary p-4", className)}>
            <p className="text-sm font-semibold text-primary">{title}</p>
            <p className="mt-1 text-sm text-tertiary">{description}</p>
            <div className="absolute top-2 right-2">
                <CloseButton onClick={onDismiss} size="sm" />
            </div>
            <div className="mt-4 flex">
                <ProgressBar value={progress} />
            </div>
            <div className="mt-4 flex gap-3">
                <Button onClick={onDismiss} color="link-gray" size="sm">
                    Dismiss
                </Button>
                <Button onClick={onConfirm} color="link-color" size="sm">
                    {confirmLabel}
                </Button>
            </div>
        </div>
    );
};

export const FeaturedCardProgressCircle = ({
    title,
    description,
    confirmLabel,
    progress,
    className,
    onDismiss,
    onConfirm,
}: FeaturedCardCommonProps & {
    progress: number;
}) => {
    return (
        <div className={cx("relative flex flex-col rounded-xl bg-secondary p-4", className)}>
            <div className="w-16">
                <ProgressBarCircle value={progress} size="xxs" />
            </div>

            <div className="absolute top-2 right-2">
                <CloseButton onClick={onDismiss} size="sm" />
            </div>
            <div className="mt-3">
                <p className="text-sm font-semibold text-primary">{title}</p>
                <p className="mt-1 text-sm text-tertiary">{description}</p>
            </div>
            <div className="mt-4 flex gap-3">
                <Button onClick={onDismiss} color="link-gray" size="sm">
                    Dismiss
                </Button>
                <Button onClick={onConfirm} color="link-color" size="sm">
                    {confirmLabel}
                </Button>
            </div>
        </div>
    );
};

export const FeaturedCardImage = ({
    title,
    description,
    confirmLabel,
    imageSrc,
    className,
    onDismiss,
    onConfirm,
}: FeaturedCardCommonProps & {
    imageSrc: string;
}) => {
    return (
        <div className={cx("relative flex flex-col rounded-xl bg-secondary p-4", className)}>
            <p className="text-sm font-semibold text-primary">{title}</p>
            <p className="mt-1 text-sm text-tertiary">{description}</p>

            <div className="absolute top-2 right-2">
                <CloseButton onClick={onDismiss} size="sm" />
            </div>

            <div className="relative mt-4 w-full">
                <img
                    src={imageSrc}
                    className="aspect-video w-full rounded-lg object-cover outline-1 -outline-offset-1 outline-avatar-contrast-border"
                    alt={title}
                />
                <PlayIcon className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 text-fg-white" />
            </div>

            <div className="mt-4 flex gap-3">
                <Button onClick={onDismiss} color="link-gray" size="sm">
                    Dismiss
                </Button>
                <Button onClick={onConfirm} color="link-color" size="sm">
                    {confirmLabel}
                </Button>
            </div>
        </div>
    );
};

export const FeaturedCardCookiePreferences = ({ title, description, confirmLabel, className, onDismiss, onConfirm }: FeaturedCardCommonProps) => {
    return (
        <div className={cx("relative flex flex-col rounded-xl bg-secondary p-4", className)}>
            <FeaturedIcon color="brand" icon={AlertCircle} theme="outline" size="md" />
            <div className="absolute top-2 right-2">
                <CloseButton onClick={onDismiss} size="sm" />
            </div>
            <div className="mt-3">
                <p className="text-sm font-semibold text-primary">{title}</p>
                <p className="mt-1 text-sm text-tertiary">{description}</p>
            </div>
            <div className="mt-4 flex gap-3">
                <Button onClick={onDismiss} color="link-gray" size="sm">
                    Reject all
                </Button>
                <Button onClick={onConfirm} color="link-color" size="sm">
                    {confirmLabel}
                </Button>
            </div>
        </div>
    );
};

export const FeaturedCardReferralLink = ({
    title,
    description,
    onDismiss,
    className,
}: Pick<FeaturedCardCommonProps, "title" | "description" | "onDismiss" | "className">) => {
    const { copy, copied } = useClipboard();
    const [value, setValue] = useState("uui.com/4060020");

    return (
        <div className={cx("relative flex flex-col rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset", className)}>
            <FeaturedIcon color="gray" icon={Link03} theme="modern" size="md" />
            <div className="absolute top-2 right-2">
                <CloseButton onClick={onDismiss} size="sm" />
            </div>
            <div className="mt-3">
                <p className="text-sm font-semibold text-primary">{title}</p>
                <p className="mt-1 text-sm text-tertiary">{description}</p>
            </div>
            <div className="mt-4 flex gap-1">
                <Input aria-label="Referral link" value={value} onChange={setValue} isReadOnly size="sm" />
                <Button iconLeading={copied ? Check : Copy01} onClick={() => copy(value)} size="md" color="tertiary" />
            </div>
        </div>
    );
};

export const FeaturedCardOnboardingSteps = ({
    title,
    supportingText,
    progress,
    description,
    confirmLabel,
    onConfirm,
}: FeaturedCardCommonProps & { supportingText: string; progress: number }) => {
    return (
        <div className="relative flex flex-col gap-4 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
            <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                    <span className="text-sm font-semibold text-primary">{title}</span>
                    <span className="text-sm text-quaternary">{supportingText}</span>
                </div>

                <div className="flex">
                    <ProgressBar value={progress} />
                </div>
            </div>
            {description}
            <Button size="sm" color="secondary" onClick={onConfirm}>
                {confirmLabel}
            </Button>
        </div>
    );
};

export const FeaturedCardUpgradeCTA = ({
    icon,
    title,
    badge,
    description,
    confirmLabel,
    onConfirm,
    onDismiss,
}: FeaturedCardCommonProps & { icon: FC<HTMLAttributes<HTMLOrSVGElement>>; badge?: string }) => {
    return (
        <div className="relative flex flex-col gap-4 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
            <div className="absolute top-2 right-2">
                <CloseButton size="sm" onClick={onDismiss} />
            </div>

            <div className="flex flex-col gap-3">
                <FeaturedIcon color="gray" icon={icon} theme="modern" size="md" />
                <div className="flex flex-col gap-1">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                        {title}
                        {badge && (
                            <Badge size="sm" type="modern" color="gray">
                                {badge}
                            </Badge>
                        )}
                    </p>
                    <p className="text-sm text-tertiary">{description}</p>
                </div>
            </div>
            <Button size="sm" color="primary" onClick={onConfirm}>
                {confirmLabel}
            </Button>
        </div>
    );
};

export const FeaturedCardSupportCTA = ({ badge, title, description, confirmLabel, onConfirm, onDismiss }: FeaturedCardCommonProps & { badge?: string }) => {
    return (
        <div className="relative flex flex-col gap-4 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
            <div className="absolute top-2 right-2">
                <CloseButton size="sm" onClick={onDismiss} />
            </div>

            <div className="flex flex-col gap-3">
                {badge && (
                    <BadgeWithDot color="success" type="modern" size="sm">
                        {badge}
                    </BadgeWithDot>
                )}
                <div className="flex flex-col gap-1">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">{title}</p>
                    <p className="text-sm text-tertiary">{description}</p>
                </div>
            </div>
            <Button iconLeading={MessageChatCircle} size="sm" color="secondary" onClick={onConfirm}>
                {confirmLabel}
            </Button>
        </div>
    );
};

export const FeaturedCardEventCTA = ({ title, badge, description, confirmLabel, onConfirm, onDismiss }: FeaturedCardCommonProps & { badge?: string }) => {
    return (
        <div className="relative flex flex-col gap-4 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
            <div className="absolute top-2 right-2">
                <CloseButton size="sm" onClick={onDismiss} />
            </div>

            <div className="flex gap-2">
                <div className="flex -space-x-1">
                    <Avatar
                        className="ring-[1.5px] ring-bg-primary"
                        size="xs"
                        src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80"
                        alt="Olivia Rhye"
                    />
                    <Avatar
                        className="ring-[1.5px] ring-bg-primary"
                        size="xs"
                        src="https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80"
                        alt="Phoenix Baker"
                    />
                    <Avatar
                        className="ring-[1.5px] ring-bg-primary"
                        size="xs"
                        src="https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80"
                        alt="Lana Steiner"
                    />
                    <Avatar
                        className="ring-[1.5px] ring-bg-primary"
                        size="xs"
                        src="https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80"
                        alt="Demi Wilkinson"
                    />

                    <Avatar
                        size="xs"
                        className="ring-[1.5px] ring-bg-primary"
                        placeholder={<span className="flex items-center justify-center text-xs font-semibold text-quaternary">+5</span>}
                    />
                </div>
                <AvatarAddButton size="xs" className="pointer-events-none" />
            </div>

            <div className="flex flex-col gap-1">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {title}
                    {badge && (
                        <BadgeWithDot color="success" type="modern" size="sm">
                            {badge}
                        </BadgeWithDot>
                    )}
                </p>
                <p className="text-sm text-tertiary">{description}</p>
            </div>

            <div className="flex items-center gap-3">
                <Button color="link-gray" size="sm" onClick={onDismiss}>
                    Dismiss
                </Button>
                <Button color="link-color" size="sm" onClick={onConfirm}>
                    {confirmLabel}
                </Button>
            </div>
        </div>
    );
};

export const FeaturedCardMessage = ({
    title,
    supportingText,
    description,
    confirmLabel,
    onConfirm,
    onDismiss,
}: FeaturedCardCommonProps & { supportingText: string }) => {
    return (
        <div className="relative flex flex-col gap-4 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
            <div className="absolute top-2 right-2">
                <CloseButton size="sm" onClick={onDismiss} />
            </div>

            <div className="flex flex-col gap-3">
                <Avatar size="md" src="https://www.untitledui.com/images/avatars/mathilde-lewis?fm=webp&q=80" alt="Mathilde Lewis" status="online" />

                <div className="flex flex-col gap-1">
                    <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                        {title}
                        <span className="text-sm font-normal text-quaternary">{supportingText}</span>
                    </p>

                    <p className="text-sm text-tertiary">{description}</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button color="link-gray" size="sm" onClick={onDismiss}>
                    Dismiss
                </Button>
                <Button color="link-color" size="sm" onClick={onConfirm}>
                    {confirmLabel}
                </Button>
            </div>
        </div>
    );
};

export const FeaturedCardCurrentProjects = ({ title, description, confirmLabel, onConfirm, onDismiss }: FeaturedCardCommonProps) => {
    return (
        <div className="relative flex flex-col gap-4 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
            <div className="absolute top-2 right-2">
                <CloseButton size="sm" onClick={onDismiss} />
            </div>

            <div className="flex flex-col gap-3">
                <p className="flex items-center gap-2 text-sm font-semibold text-primary">{title}</p>
                {description}
            </div>

            <div className="flex items-center gap-3">
                <Button color="link-color" size="sm" onClick={onConfirm}>
                    {confirmLabel}
                </Button>
            </div>
        </div>
    );
};

export const FeaturedCardFreeTrialCTA = ({
    title,
    supportingText,
    progress,
    confirmLabel,
    onConfirm,
}: Omit<FeaturedCardCommonProps, "description"> & { supportingText: string; progress: number }) => {
    return (
        <div className="relative flex flex-col gap-4 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-semibold text-primary">{title}</span>
                    <span className="text-sm text-quaternary">{supportingText}</span>
                </div>
                <div className="flex">
                    <ProgressBar value={progress} />
                </div>
            </div>

            <Button color="secondary" size="sm" onClick={onConfirm}>
                {confirmLabel}
            </Button>
        </div>
    );
};

export const FeaturedCardQRCode = ({ title, description, confirmLabel, onConfirm, onDismiss }: FeaturedCardCommonProps) => {
    return (
        <div className="relative flex flex-col gap-4 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
            <div className="absolute top-2 right-2">
                <CloseButton size="sm" onClick={onDismiss} />
            </div>

            <div className="flex flex-col gap-1">
                <p className="truncate pr-6 text-sm font-semibold text-primary">{title}</p>
                <p className="text-sm text-tertiary">{description}</p>
            </div>
            <div className="relative flex w-full items-center justify-center">
                <QRCode value="https://www.untitledui.com/" size="md" />
                <GradientScan />
            </div>
            <Button color="secondary" size="sm" onClick={onConfirm}>
                {confirmLabel}
            </Button>
        </div>
    );
};
