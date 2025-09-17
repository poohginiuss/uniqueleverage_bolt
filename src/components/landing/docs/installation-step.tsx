import React, { useState } from "react";
import { FaClipboard } from "react-icons/fa";  // You can use FaClipboard for the copy icon

interface StepItem {
  id: string;
  title: string;
  description: React.ReactNode;
  code?: string;
}

export const StepNavigation = () => {
  const [copied, setCopied] = useState(false);

  const steps: StepItem[] = [
    {
      id: "1",
      title: "Choose Your Provider",
      description: (
        <>
          
        </>
      ),
    },
    {
      id: "2",
      title: "Request Feed Access",
      description: (
        <>
          Each provider works a little differently. Just click your provider and follow the instructions shown on their page to set up your feed.
        </>
      ),
    },
    {
      id: "3",
      title: "Confirm Connection",
      description: (
        <>
          Once setup is done, our system will detect the feed and begin syncing your inventory. We'll notify you when vehicles start appearing in Unique Leverage.
        </>
      ),
    },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="mt-8 grid w-full grid-cols-1 items-start justify-start mt-10">
      {steps.map((step, index) => (
        <div key={step.id} className="group flex flex-row gap-4">
          <div className="flex flex-col items-center gap-2 self-stretch pb-1.5 mt-0">
            <div className="relative flex shrink-0 items-center justify-center bg-primary shadow-xs-skeumorphic ring-1 ring-inset rounded-lg text-fg-secondary ring-primary size-8">
              <span className="text-sm font-semibold">{step.id}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="relative flex w-full flex-1 justify-center">
                <svg width="2" height="100%" className="absolute top-0 flex-1">
                  <line x1="1" y1="0" x2="1" y2="100%" className="stroke-border-primary" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" strokeDasharray="0.5,8"></line>
                </svg>
              </div>
            )}
          </div>

          <div className="flex w-full min-w-0 flex-col items-start mb-10">
            <p className="text-md font-semibold text-primary" style={{ marginTop: 5 }}>{step.title}</p>
            <div className="w-full">
              {step.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
