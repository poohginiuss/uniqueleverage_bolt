import React, { useState } from "react";
import { StepNavigation } from "./installation-step";

function Divider() {
  return (
    <hr className="my-10 md:my-12 border-t-2 border-border-secondary" />
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="not-typography mx-auto w-full max-w-[72rem]">
      <h2 className="text-lg font-semibold text-primary md:text-xl">{title}</h2>
      {children}
    </section>
  );
}

function TechCard({ href, title, version, details }: { href: string; title: string; version: string; details?: string }) {
  return (
    <a
      className="group relative flex flex-col items-start rounded-xl bg-primary_alt p-5 ring-1 ring-secondary outline-focus-ring transition duration-100 ease-linear ring-inset hover:bg-primary_hover hover:ring-blue-300 hover:shadow-md no-underline"
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

export const DealerCenterPage = () => {

  const faqs = [
    {
      q: "How do I connect my DealerCenter feed?",
      a: "Follow the DealerCenter instructions above to set up your feed connection. The process typically takes 10-15 minutes."
    },
    {
      q: "What information does DealerCenter provide?",
      a: "DealerCenter provides comprehensive vehicle data including pricing, specifications, images, and availability status."
    },
    {
      q: "How often does DealerCenter sync?",
      a: "DealerCenter feeds sync automatically every 2-4 hours to ensure your inventory is always up-to-date."
    },
    {
      q: "Can I connect multiple DealerCenter accounts?",
      a: "Yes, you can connect multiple DealerCenter accounts if you manage inventory for multiple dealerships."
    },
    {
      q: "What if I have issues with my DealerCenter connection?",
      a: "Contact our support team and we'll help troubleshoot any connection issues with your DealerCenter feed."
    }
  ];

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
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <h1 className="max-w-3xl text-xl font-semibold text-primary md:text-2xl">
                DealerCenter
              </h1>
            </div>

            <p className="typography mt-3 max-w-3xl text-base whitespace-pre-line">
              Connect your DealerCenter inventory feed to sync vehicles automatically.
            </p>
          </div>

          <Divider />

          {/* Setup guide */}
          <Section id="setup-guide" title="Setup guide">
            <p>Follow these steps to connect your DealerCenter inventory feed and start syncing vehicles automatically.</p>
            <StepNavigation />
          </Section>

          <Divider />

          {/* FAQs */}
          <div id="faqs" className="not-typography mx-auto w-full max-w-[72rem]">
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
                { id: "setup-guide", label: "Setup guide" },
                { id: "faqs", label: "FAQs" },
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
