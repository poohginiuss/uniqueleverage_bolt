import React, { useState } from "react";
import { FaApple, FaWindows } from "react-icons/fa";
import { StepNavigation } from "@/components/landing/docs/installation-step"
// Intro/Docs page built with React + TypeScript + Tailwind (drop-in TSX component)
// - No external UI libs required
// - Uses semantic HTML and accessible buttons for the FAQ accordion
// - You can swap the placeholder links/logos with your own

export const ULInstallPage = () => {
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
                Request Feed
              </h1>
            </div>

            <p className="typography mt-3 max-w-3xl text-base whitespace-pre-line">
              Easily connect inventory feeds in just a few steps.
            </p>
          </div>

          <Divider />

          {/* Tech stack cards */}
          <Section id="partners" title="Partners">
            <p>Step-by-step guides for connecting.</p>
            <div className="grid grid-cols-1 gap-3 mt-8 lg:grid-cols-2">
              {techCards.map((c) => (
                <TechCard key={c.title} {...c} />
              ))}
              <a
                href="{href}"
                className="group relative flex flex-col items-start rounded-xl bg-primary_alt p-5 ring-1 ring-secondary outline-focus-ring transition duration-100 ease-linear ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 not-dark:hover:bg-primary_hover lg:col-span-2 no-underline"
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
                  <p className="text-sm font-semibold text-primary"  style={{ marginTop: 0, marginBottom: 12 }}>See more partners</p>
                  <p className="text-sm text-tertiary"  style={{ marginTop: 0, marginBottom: 12 }}>A complete list of inventory integrations.</p>
                </div>
              </a>
            </div>
            
          </Section>

          <Divider />

          <Section id="tech-stack" title="Inventory setup guide">
            <p className="mt-3">
              Follow these steps to connect your dealerships inventory feed to and start syncing vehicles automatically.
            </p>
            <StepNavigation />
          </Section>

          <Divider />

          {/* FAQs */}
          <div className="not-typography mx-auto w-full max-w-[72rem]">
            <h2 className="text-lg font-semibold text-primary md:text-xl">FAQs</h2>
            <p className="mt-3 text-base text-tertiary">
              Please refer to our {" "}
              <a className="font-medium text-primary underline underline-offset-4" href="">frequently asked questions</a> page for more.
            </p>

            <div className="mt-8 flex flex-col">
              {faqs.map((f, i) => (
                <FaqItem key={i} question={f.q} answer={f.a} />
              ))}
            </div>
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
                { id: "partners", label: "Partners" },
                { id: "tech-stack", label: "Setup guide" },
                { id: "accessibility", label: "Request status" },
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
      className="group relative flex flex-col items-start rounded-xl bg-primary_alt p-5 ring-1 ring-secondary outline-focus-ring transition duration-100 ease-linear ring-inset hover:bg-primary_hover no-underline"
      href={href}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="absolute top-4 right-4 size-4 text-fg-quaternary">
        <path d="M7 17 17 7m0 0H7m10 0v10"></path>
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
    details: "",
    title: "DealerCenter",
    version: "Click to open DealerCenter instructions.",
  },
  {
    href: "",
    details: "",
    title: "CarsforSale",
    version: "Click to open CarsforSale instructions.",
  },
  {
    href: "",
    details: "",
    title: "AutoManager",
    version: "Click to open AutoManager instructions.",
  },
  {
    href: "",
    details: "",
    title: "DealerCarSearch",
    version: "Click to open DealerCarSearch instructions.",
  },
  {
    href: "",
    details: "",
    title: "DealerON",
    version: "Click to open DealerON instructions.",
  },
  {
    href: "",
    details: "",
    title: "vAuto",
    version: "Click to open vAuto instructions.",
  },
] as const;

const faqs = [
  {
    q: "What...",
    a: (
      <>
        <p>
          <a href="" className="text-primary underline">...</a> ...
        </p>
        <p className="mt-3">...</p>
      </>
    ),
  },
  {
    q: " is Unique Leverage?",
    a: (
      <>
        <p>
          ...
        </p>
      </>
    ),
  },
  {
    q: "What...?",
    a: (
      <ul className="list-disc pl-5">
        <li>...</li>
        <li>...</li>
        <li>...</li>
        <li>...</li>
      </ul>
    ),
  },
  {
    q: "What...?",
    a: <p>...</p>,
  },
  {
    q: "Does...?",
    a: <p>...</p>,
  },
  {
    q: "What...?",
    a: <p>...</p>,
  },
  {
    q: "Can I ...?",
    a: (
      <p>
        ....
      </p>
    ),
  },
];
