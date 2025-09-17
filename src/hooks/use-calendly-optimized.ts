"use client";

import { useCallback } from 'react';

export const useCalendlyOptimized = () => {
  const initializeCalendly = useCallback((parentElement: HTMLElement, url: string, options: any = {}) => {
    // Ultra-fast direct initialization
    try {
      (window as any).Calendly.initInlineWidget({
        url,
        parentElement,
        prefill: {},
        utm: {},
        ...options
      });
      return true;
    } catch (error) {
      // If Calendly not ready, try again in next tick
      setTimeout(() => {
        try {
          (window as any).Calendly.initInlineWidget({
            url,
            parentElement,
            prefill: {},
            utm: {},
            ...options
          });
        } catch (retryError) {
          console.error('Error initializing Calendly:', retryError);
        }
      }, 0);
      return false;
    }
  }, []);

  const openCalendlyPopup = useCallback((url: string, options: any = {}) => {
    // Direct popup - no complex state management
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      try {
        (window as any).Calendly.initPopupWidget({
          url,
          ...options
        });
        return true;
      } catch (error) {
        console.error('Error opening Calendly popup:', error);
        return false;
      }
    }
    return false;
  }, []);

  return {
    isReady: typeof window !== 'undefined' && !!(window as any).Calendly,
    isLoading: false,
    initializeCalendly,
    openCalendlyPopup
  };
};
