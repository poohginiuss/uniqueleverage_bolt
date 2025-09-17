import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { RouteProvider } from "@/providers/router-provider";
import { Theme } from "@/providers/theme";
import { cx } from "@/utils/cx";
import "@/styles/globals.css";
import Script from "next/script";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "UniqueLeverage",
    description: "uniqueleverage.com",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: "#7f56d9",
    colorScheme: "light dark",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" />
                {/* Optional: Add PNG/SVG variants */}
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="apple-touch-icon" href="/favicon-32x32.png" />
                {/* Calendly CSS */}
                <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
            </head>
            <body className={cx(inter.variable, "bg-primary antialiased")}>
                <RouteProvider>
                    <Theme>{children}</Theme>
                </RouteProvider>
                
                {/* Calendly Script - Load early for better performance */}
                <Script 
                    src="https://assets.calendly.com/assets/external/widget.js" 
                    strategy="afterInteractive"
                />
            </body>
        </html>
    );
}
