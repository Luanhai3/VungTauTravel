"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Lenis?: new (opts?: { wrapper?: HTMLElement; content?: HTMLElement; duration?: number; easing?: (t: number) => number }) => {
      raf: (time: number) => void;
      destroy: () => void;
    };
  }
}

export function useLenis(options?: {
  duration?: number;
  enabled?: boolean;
}) {
  const lenisRef = useRef<InstanceType<NonNullable<typeof window.Lenis>> | null>(null);
  const rafRef = useRef<number>(0);
  const { duration = 1.2, enabled = true } = options ?? {};

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const initLenis = async () => {
      const Lenis = (await import("lenis")).default;
      lenisRef.current = new Lenis({
        duration,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      document.documentElement.classList.add("lenis", "lenis-smooth");

      function raf(time: number) {
        lenisRef.current?.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      }
      rafRef.current = requestAnimationFrame(raf);
    };

    initLenis();
    return () => {
      cancelAnimationFrame(rafRef.current);
      lenisRef.current?.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      lenisRef.current = null;
    };
  }, [duration, enabled]);

  return lenisRef.current;
}
