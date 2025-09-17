import React, { useState } from "react";
import { FaApple, FaWindows } from "react-icons/fa";

// Intro/Docs page built with React + TypeScript + Tailwind (drop-in TSX component)
// - No external UI libs required
// - Uses semantic HTML and accessible buttons for the FAQ accordion
// - You can swap the placeholder links/logos with your own

export const ULIntroPage = () => {
  return (
    <div className="flex items-start px-4 py-16 lg:px-8 2xl:py-20">
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
                  {/* Star icon */}
                  {/* <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="size-6 text-utility-gray-500"
                  >
                    <path d="M4.5 22v-5m0-10V2M2 4.5h5m-5 15h5M13 3l-1.734 4.509c-.282.733-.423 1.1-.643 1.408a3 3 0 0 1-.706.707c-.308.219-.675.36-1.408.642L4 12l4.509 1.734c.733.282 1.1.423 1.408.643.273.194.512.433.707.706.219.308.36.675.642 1.408L13 21l1.734-4.509c.282-.733.423-1.1.643-1.408.194-.273.433-.512.706-.707.308-.219.675-.36 1.408-.642L22 12l-4.509-1.734c-.733-.282-1.1-.423-1.408-.642a3 3 0 0 1-.706-.707c-.22-.308-.36-.675-.643-1.408L13 3Z" />
                  </svg> */}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <h1 className="max-w-3xl text-xl font-semibold text-primary md:text-2xl">
                Introduction
              </h1>
            </div>

            <p className="typography mt-3 max-w-3xl text-base whitespace-pre-line">
              Welcome to Unique Leverage! This platform is a collection of tools and integrations built specifically for automotive dealerships and sales professionals.
            </p>
          </div>

          <Divider />

          {/* What is */}
          <Section id="what-is-untitled-ui-react" title="What is Unique Leverage?">
            <p>
              A complete platform for dealers and salespeople to post inventory, run ads, schedule test drives, and track results in one place.
            </p>
            <p className="mt-3">
              Skip months of setup with built-in feed integrations, native scheduling pages, AI-powered ad creation, and automated posting to Facebook Marketplace. Unique Leverage includes a tracking pixel for accurate lead attribution.
            </p>
            <p className="mt-3">
              It's the perfect hub once your feed is connected—giving you everything you need to market and sell, with powerful, ready-to-use automotive tools.
            </p>
          </Section>

          <Divider />

          {/* Tech stack cards */}
          <Section id="tech-stack" title="Core Features">
            <p>We've kept the platform focused so you can get started - today.</p>
            <div className="grid grid-cols-1 gap-3 mt-8 mb-3 lg:grid-cols-2">
              <ActionCard
                href=""
                title="Download for Windows"
                subtitle="Windows 10+"
                icon={(
                  <FaWindows className="text-sm" />
                )}
              />
              <ActionCard
                href=""
                title="Download for Mac"
                subtitle="macOS 12+"
                icon={(
                  <FaApple className="text-sm" />
                )}
              />
            </div>
            <div
  className="group relative flex flex-col items-start rounded-xl bg-primary_alt p-5 ring-1 ring-secondary outline-focus-ring transition duration-100 ease-linear ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 not-dark:hover:bg-primary_hover lg:col-span-2 cursor-default"
>
  {/* Top-left icon */}
  <img
    src="/blue-icon.png"  // replace with your PNG path
    alt="Unique Leverage Logo"
    className="absolute top-4 left-4 w-6 h-6"
     style={{ marginTop: 0, marginBottom: 0, width: 24, height: 24  }}
  />

  {/* Right-top lock (if you still want it) */}
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="absolute top-4 right-4 size-4 text-fg-quaternary"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>

  <div className="flex flex-col gap-0.5 mt-11">
    <p className="text-sm font-semibold text-primary" style={{ marginTop: 0, marginBottom: 12 }}>
      Unique Leverage Business Manager
    </p>
    <p className="text-sm text-tertiary" style={{ marginTop: 0, marginBottom: 12 }}>
      Upgrade your account to PRO for campaigns, scheduling, and analytics.
    </p>
  </div>

  <button
    className="group relative inline-flex items-center gap-1 rounded-lg px-3.5 py-2.5 text-sm font-semibold bg-primary text-secondary ring-1 ring-inset ring-primary hover:bg-blue-600 hover:text-white hover:ring-blue-600 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 no-underline cursor-pointer"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Get PRO button clicked!');
      window.open('/pricing', '_blank');
    }}
  >
    <span className="px-0.5">Get PRO</span>
  </button>
</div>
            {/* <div className="grid grid-cols-1 gap-3 mt-8 lg:grid-cols-2">
              {techCards.map((c) => (
                <TechCard key={c.title} {...c} />
              ))}
            </div> */}
          </Section>

          <Divider />

          <Section id="accessibility" title="Accessibility">
            <p>Accessibility isn’t optional — it’s essential.</p>
            <p className="mt-3">
              We centralize your Pages, Ad Accounts, Pixels, Audiences, and every ad you’ve created so you can launch, manage, and track campaigns instantly — without bouncing between tools.
            </p>
          </Section>

          <Divider />

          <Section id="how-is-this-different-from-a-library" title="How is this different from other tools?">
            <p>Most platforms just post inventory or run basic ads. Unique Leverage connects your inventory, ads, scheduling, and follow-up in one system.</p>
            <p className="mt-3">
              Each ad drives customers to a booking page for that vehicle, synced with your calendar. With native pixel tracking and automation, you can launch campaigns, manage leads, and fill your schedule — without juggling tools.
            </p>
          </Section>

          <Divider />

          <Section id="next-steps" title="Next steps">
            <p>
              Start by following our <a href="/docs/request-feeds" className="text-primary underline">request feed</a> guide to connect your inventory.
            </p>
            <p className="mt-3">
              Once your feed is connected, install the Unique Leverage app for Windows or macOS. This lets you manage inventory and post vehicles directly to Marketplace.
            </p>
            <div className="grid grid-cols-1 gap-3 mt-8 lg:grid-cols-2">
            <a
              href="/docs/integrations"
              className="group relative flex flex-col items-start rounded-xl bg-primary_alt p-5 ring-1 ring-secondary outline-focus-ring transition duration-100 ease-linear ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 not-dark:hover:bg-primary_hover hover:ring-blue-300 hover:shadow-md lg:col-span-2 no-underline"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="absolute top-4 right-4 size-4 text-fg-quaternary"
              >
                <path d="M12 5v14m0 0 7-7m-7 7-7-7"></path>
              </svg>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-primary" >View inventory integrations</p>
                <p className="text-sm text-tertiary"  style={{ marginTop: 0, marginBottom: 2 }}>See the full list of supported partners</p>
              </div>
            </a>
            </div>
          </Section>

          <Divider />

          {/* FAQs */}
          <div className="not-typography mx-auto w-full max-w-[72rem]">
            <h2 className="text-lg font-semibold text-primary md:text-xl">FAQs</h2>
            <p className="mt-3 text-base text-tertiary">
              Please refer to our frequently asked questions page for more.
            </p>

            <div className="mt-8 flex flex-col">
              {faqs.map((f, i) => (
                <FaqItem key={i} question={f.q} answer={f.a} />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex w-full items-center mt-24">
            <a
              className="group relative inline-flex items-center gap-1 rounded-lg px-3.5 py-2.5 text-sm font-semibold bg-primary text-secondary ring-1 ring-inset ring-primary hover:bg-primary/90 ml-auto"
              href="/docs/request-feeds"
            >
              <span className="px-0.5">Request Feed</span>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-5"
              >
                <path d="M5 12h14m0 0-7-7m7 7-7 7"></path>
              </svg>
            </a>
          </div>
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
                { id: "what-is-untitled-ui-react", label: "What is Unique Leverage?" },
                { id: "tech-stack", label: "Core Features" },
                { id: "accessibility", label: "Accessibility" },
                { id: "how-is-this-different-from-a-library", label: "How is this different from a library?" },
                { id: "next-steps", label: "Next steps" },
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
}

function Divider() {
  return (
    <hr className="my-10 md:my-12 border-t-2 border-border-secondary" />
  );
}

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

function TechCard({ href, title, version, details }: { href: string; title: string; version: string; details?: string }) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col items-start rounded-xl bg-primary_alt p-5 ring-1 ring-secondary outline-focus-ring transition duration-100 ease-linear ring-inset hover:bg-primary_hover no-underline"
      href={href}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="absolute top-4 right-4 size-4 text-fg-quaternary">
        <path d="M7 17 17 7m0 0H7m10 0v10"></path>
      </svg>
      <div className="flex flex-col">
        <p className="text-sm text-tertiary mt-0" style={{ marginTop: 0, marginBottom: 12 }}>{details}</p>
        <p className="text-sm font-semibold text-primary" style={{ marginTop: 0, marginBottom: 0 }}>{title}</p>
        <p className="text-sm text-tertiary" style={{ marginTop: 0, marginBottom: 0 }}>{version}</p>
      </div>
    </a>
  );
}

function ActionCard({ href, title, subtitle, icon }: { href: string; title: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col items-start rounded-xl bg-primary_alt p-5 ring-1 ring-secondary outline-focus-ring transition-all duration-200 ease-linear ring-inset hover:shadow-lg hover:border-blue-500 hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 no-underline"
      href={href}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="absolute top-4 right-4 size-4 text-fg-quaternary">
        <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
        <polyline points="8 17 12 21 16 17" />
        <line x1="12" y1="12" x2="12" y2="21" />
      </svg>
      {icon}
      <div className="mt-0 flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-primary" style={{ marginTop: 12, marginBottom: 0 }}>{title}</p>
        <p className="text-sm text-tertiary" style={{ marginTop: 0, marginBottom: 0 }}>{subtitle}</p>
      </div>
    </a>
  );
}

function FaqItem({ question, answer }: { question: string; answer: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = question.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div className="-mt-px border-t border-secondary last:border-b">
      <h3 className="py-4">
        <button
          aria-expanded={open}
          aria-controls={`faq-${id}`}
          className="flex w-full items-start justify-between gap-2 rounded-md text-left select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-base font-semibold text-primary">{question}</span>
          <span aria-hidden className="flex size-6 items-center text-fg-quaternary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line className={`origin-center transition ${open ? "rotate-90" : "rotate-0"}`} x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </span>
        </button>
      </h3>
      <div
        id={`faq-${id}`}
        role="region"
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden pb-4 pr-2 md:pr-6 text-base text-tertiary">
          {typeof answer === "string" ? <p className="mt-1">{answer}</p> : answer}
        </div>
      </div>
    </div>
  );
}

const techCards = [
  {
    href: "",
    details: "Auto-post, update, and remove vehicles on Facebook Marketplace.",
    title: "Marketplace Automation",
    version: "v2.3.4",
  },
  {
    href: "",
    details: "Turn inventory into bookable pages that sync with your calendar.",
    title: "VSP Scheduler",
    version: "v.1.3.4",
  },
  {
    href: "",
    details: "Generate winning ad copy and creatives in seconds.",
    title: "AI Ad Creator Library",
    version: "v2.0",
  },
  {
    href: "",
    details: "Trigger follow-ups, reminders, and actions on autopilot.",
    title: "Automation Workflows",
    version: "v1.9",
  },
] as const;

const faqs = [
  {
    q: "What is Unique Leverage?",
    a: (
      <>
        <p>
          Unique Leverage is an automotive marketing platform that connects your vehicle inventory to Facebook and Instagram with automated content generation. We help dealerships create powerful carousel and single-image ads that drive customers directly to vehicle-specific scheduling pages.
        </p>
        <p className="mt-3">
          Our platform includes an Ad Wizard for creating targeted campaigns, Vehicle Scheduling Pages (VSPs) for seamless test drive bookings, and native pixel tracking for complete campaign analytics.
        </p>
      </>
    ),
  },
  {
    q: "How does the Ad Wizard work?",
    a: (
      <>
        <p>
          The Ad Wizard lets you create targeted campaigns in two ways:
        </p>
        <ul className="list-disc pl-5 mt-3">
          <li><strong>Single Vehicle:</strong> Promote individual vehicles with custom ads</li>
          <li><strong>Vehicle Sets:</strong> Create campaigns for groups of vehicles (Sedans, Trucks, SUVs, or custom sets)</li>
        </ul>
        <p className="mt-3">
          Simply search your inventory, select vehicles, and the wizard generates Facebook-ready ads with vehicle images, pricing, and direct links to scheduling pages.
        </p>
      </>
    ),
  },
  {
    q: "What are Vehicle Scheduling Pages (VSPs)?",
    a: (
      <>
        <p>
          VSPs are dedicated landing pages for each vehicle in your inventory. When customers click on your ads, they're taken directly to a VSP where they can:
        </p>
        <ul className="list-disc pl-5 mt-3">
          <li>View detailed vehicle information and photos</li>
          <li>Schedule test drives through integrated Calendly</li>
          <li>Contact your dealership directly</li>
          <li>Access financing information</li>
        </ul>
        <p className="mt-3">
          Each VSP is automatically generated from your inventory feed and stays updated in real-time.
        </p>
      </>
    ),
  },
  {
    q: "Which inventory systems do you support?",
    a: (
      <>
        <p>
          We support all major automotive inventory management systems including:
        </p>
        <ul className="list-disc pl-5 mt-3">
          <li>DealerCenter</li>
          <li>CarsforSale</li>
          <li>AutoManager</li>
          <li>DealerCarSearch</li>
          <li>DealerON</li>
          <li>vAuto</li>
        </ul>
        <p className="mt-3">
          <a href="/docs/integrations" className="text-primary underline">View our complete list of supported partners</a> for step-by-step connection guides.
        </p>
      </>
    ),
  },
  {
    q: "How much does Unique Leverage cost?",
    a: (
      <>
        <p>
          We offer flexible pricing plans to fit dealerships of all sizes. Our pricing includes:
        </p>
        <ul className="list-disc pl-5 mt-3">
          <li>Unlimited vehicle campaigns</li>
          <li>Automated ad generation</li>
          <li>VSP hosting and management</li>
          <li>Calendly integration</li>
          <li>Analytics and reporting</li>
        </ul>
        <p className="mt-3">
          <a href="/pricing" className="text-primary underline">View our current pricing plans</a> or contact us for custom enterprise solutions.
        </p>
      </>
    ),
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: (
      <>
        <p>
          Yes, you can cancel your subscription at any time with no cancellation fees. Your campaigns will remain active until the end of your current billing period, and you'll retain access to all analytics and reporting data.
        </p>
        <p className="mt-3">
          We also offer a 30-day money-back guarantee for new customers to ensure you're completely satisfied with our platform.
        </p>
      </>
    ),
  },
  {
    q: "Do I need technical knowledge to use Unique Leverage?",
    a: (
      <>
        <p>
          Not at all! Unique Leverage is designed for automotive professionals, not tech experts. Our platform features:
        </p>
        <ul className="list-disc pl-5 mt-3">
          <li>Simple, intuitive interface</li>
          <li>One-click ad generation</li>
          <li>Automated inventory syncing</li>
          <li>Pre-built templates and designs</li>
        </ul>
        <p className="mt-3">
          If you can use Facebook and manage inventory, you can use Unique Leverage. Our support team is also available to help with setup and optimization.
        </p>
      </>
    ),
  },
];
