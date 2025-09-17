"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useSmoothNavigation = () => {
  const router = useRouter();

  const navigate = useCallback((path: string) => {
    // Add a small delay to allow UI state to update first
    requestAnimationFrame(() => {
      router.replace(path, { scroll: false });
    });
  }, [router]);

  return { navigate };
};
