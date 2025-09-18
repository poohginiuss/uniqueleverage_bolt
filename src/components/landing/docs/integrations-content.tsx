import React, { useState } from "react";

// Integrations page built with React + TypeScript + Tailwind (drop-in TSX component)
// - No external UI libs required
// - Uses semantic HTML and accessible buttons
// - Matches the exact styling and structure of intro-content and install-content

export const ULIntegrationsPage = () => {
  return (
    <div className="flex items-start px-4 py-16 lg:px-8">
      <main className="relative mx-auto flex w-full min-w-0 flex-1 flex-col lg:flex-row max-w-180">
        {/* Main column */}
        <div className="size-full text-tertiary">
          {/* Intro header */}
          <div className="mb-10">
            <div className="mb-6">
              <div
                className="relative flex shrink-0 items-center justify-center *:data-icon:size-7 bg-primary_alt ring-1 ring-inset before:absolute before:inset-1 before:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1),0px_3px_3px_0px_rgba(0,0,0,0.09),1px_8px_5px_0px_rgba(0,0,0,0.05),2px_21px_6px_0px_rgba(0,0,0,0),0px_0px_0px_1px_rgba(0,0,0,0.08),1px_13px_5px_0px_rgba(0,0,0,0.01),0px_-2px_2px_0px_rgba(0,0,0,0.13)_inset] before:ring-1 before:ring-secondary_alt size-14 rounded-[14px] before:rounded-[10px] text-fg-secondary ring-primary dark:ring-secondary dark:before:opacity-0"
                data-featured-icon="true"
              >
                <div className="z-10">
                  {/* Integration icon placeholder */}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <h1 className="max-w-3xl text-2xl font-semibold text-primary">
                Integrations
              </h1>
            </div>

            <p className="typography mt-3 max-w-3xl text-base whitespace-pre-line">
              This is your hub for connecting external systems with Unique Leverage. Quickly link your inventory providers, ad accounts, calendar, and more — all from one dashboard.
            </p>
          </div>

          <Divider />

          {/* Inventory Providers Section */}
          <Section id="inventory-providers" title="Inventory Providers">
            <p>Select your provider below to connect your feed and start syncing vehicles automatically.</p>
            <div className="grid grid-cols-1 gap-3 mt-8 lg:grid-cols-2">
              {inventoryProviders.map((provider) => (
                <ProviderCard key={provider.name} {...provider} />
              ))}
            </div>
          </Section>

          <Divider />

          {/* Social Media Integration Section */}
          <Section id="social-media" title="Social Media Integration">
            <p>Connect your social media accounts to automatically share inventory updates and engage with customers.</p>
            <p className="mt-3">
              Automatically post new inventory to Facebook Marketplace, Instagram, and other social platforms. 
              Engage with customers through integrated messaging and track social media performance.
            </p>
            <div className="mt-8">
              <div className="rounded-xl bg-primary_alt p-5 ring-1 ring-secondary">
                <p className="text-sm text-tertiary">Social media integration features coming soon...</p>
              </div>
            </div>
          </Section>

          <Divider />

          {/* Calendar Integration Section */}
          <Section id="calendar-integration" title="Calendar Integration">
            <p>Sync your calendar with Unique Leverage to manage appointments and follow-ups seamlessly.</p>
            <p className="mt-3">
              Schedule test drives, follow-up calls, and service appointments directly from your inventory management system. 
              Sync with Google Calendar, Outlook, and other calendar applications.
            </p>
            <div className="mt-8">
              <div className="rounded-xl bg-primary_alt p-5 ring-1 ring-secondary">
                <p className="text-sm text-tertiary">Calendar integration features coming soon...</p>
              </div>
            </div>
          </Section>

          <Divider />

          {/* Meta Pixel Integration Section */}
          <Section id="meta-pixel" title="Meta Pixel Integration">
            <p>Track conversions and optimize your Facebook and Instagram ad campaigns with Meta Pixel integration.</p>
            <p className="mt-3">
              Monitor website visitors, track lead generation, and optimize your ad spend with detailed analytics. 
              Build custom audiences and retarget website visitors across Facebook and Instagram.
            </p>
            <div className="mt-8">
              <div className="rounded-xl bg-primary_alt p-5 ring-1 ring-secondary">
                <p className="text-sm text-tertiary">Meta Pixel integration features coming soon...</p>
              </div>
            </div>
          </Section>
        </div>

        
      </main>
      {/* Right rail: On this page */}
        <aside className="sticky top-25 right-4 ml-10 hidden w-64 shrink-0 overflow-y-auto pb-10 text-sm xl:block">
          <div className="flex flex-col max-h-[calc(100vh-7rem)] pb-8">
            <div className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4 text-fg-quaternary">
                <path d="M3 12h18M3 6h18M3 18h12"></path>
              </svg>
              <p className="text-xs font-semibold text-primary">On this page</p>
            </div>

            <nav className="mt-4">
              <ol className="flex flex-col gap-2 border-l border-secondary pl-3">
                {[
                  { id: "inventory-providers", label: "Inventory Providers" },
                  { id: "social-media", label: "Social Media" },
                  { id: "calendar-integration", label: "Calendar" },
                  { id: "meta-pixel", label: "Meta Pixel" },
                ].map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="text-sm font-semibold text-quaternary hover:text-brand-secondary">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </aside>
    </div>
  );
};

// Data for inventory providers
const inventoryProviders = [
  {
    name: "DealerCenter",
    description: "Inventory Management",
    href: "/docs/dealercenter",
  },
  {
    name: "CarsforSale",
    description: "Inventory Management", 
    href: "/docs/carsforsale",
  },
  {
    name: "AutoManager",
    description: "Inventory Management",
    href: "/docs/automanager",
  },
  {
    name: "vAuto",
    description: "Inventory Management",
    href: "/docs/vauto",
  },
  {
    name: "DealerCarSearch",
    description: "Inventory Management",
    href: "/docs/dealercarsearch",
  },
  {
    name: "Trailer Ops",
    description: "Inventory Management",
    href: "/docs/trailerops",
  },
  {
    name: "DealerON",
    description: "Inventory Management",
    href: "/docs/dealeron",
  },
  {
    name: "Auto Raptor",
    description: "Inventory Management",
    href: "/docs/autoraptor",
  },
];

// Provider Card Component
function ProviderCard({ name, description, href }: { name: string; description: string; href: string }) {
  return (
    <a
      className="group relative flex flex-col items-start rounded-xl bg-primary_alt p-5 ring-1 ring-secondary outline-focus-ring transition duration-100 ease-linear ring-inset hover:bg-primary_hover hover:ring-blue-300 hover:shadow-md no-underline"
      href={href}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="absolute top-4 right-4 size-4 text-fg-quaternary">
        <path d="M7 17 17 7m0 0H7m10 0v10"></path>
      </svg>
      <div className="flex flex-col">
        <p className="text-sm text-tertiary mt-0" style={{ marginTop: 0, marginBottom: 12 }}>{description}</p>
        <p className="text-sm font-semibold text-primary" style={{ marginTop: 0, marginBottom: 0 }}>{name}</p>
      </div>
    </a>
  );
}

// Section Component
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-xl font-semibold text-primary md:text-xl">
        <a href={`#${id}`}>{title}</a>
      </h2>
      <div className="typography prose prose-invert max-w-none mt-3 not-prose:text-base">
        {children}
      </div>
    </section>
  );
}

// Divider Component
function Divider() {
  return (
    <hr className="my-12 border-t-2 border-border-secondary" />
  );
}