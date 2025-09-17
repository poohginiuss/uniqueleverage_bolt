"use client";

import { useEffect, useRef } from 'react';
import { useCalendlyOptimized } from '@/hooks/use-calendly-optimized';

export default function CalendlyInline() {
  const calendlyRef = useRef<HTMLDivElement>(null);
  const { initializeCalendly } = useCalendlyOptimized();

  useEffect(() => {
    // Immediate initialization - no delays
    if (calendlyRef.current) {
      initializeCalendly(
        calendlyRef.current,
        'https://calendly.com/uniqueleverage/scheduler?hide_event_type_details=1&hide_gdpr_banner=1'
      );
    }
  }, [initializeCalendly]);

  return (
    <div 
      ref={calendlyRef}
      style={{ minWidth: '320px', height: '700px' }}
    />
  );
}
