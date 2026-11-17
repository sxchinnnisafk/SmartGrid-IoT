"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useGrid } from "../context/GridContext";

/**
 * ScrollRevealObserver
 * Efficient, leak-free scroll reveal observer:
 * - Marks `html.js-ready` so `.reveal` elements remain visible if JS is disabled.
 * - Reuses a single persistent IntersectionObserver with WeakSet tracking (zero leaks).
 * - Coalesces DOM mutation scans via requestAnimationFrame to prevent layout thrash
 *   during periodic 2.5s telemetry ticks.
 * - Strictly honors `prefers-reduced-motion: reduce`.
 */
export default function ScrollRevealObserver() {
  const pathname = usePathname();
  const { isAuthenticated, hasSkippedAuth } = useGrid();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      document.documentElement.classList.remove("js-ready");
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        el.classList.add("is-revealed");
      });
      return;
    }

    document.documentElement.classList.add("js-ready");

    const observed = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -24px 0px",
        threshold: 0.05,
      }
    );

    let rafId: number | null = null;

    const scan = () => {
      rafId = null;
      const elements = document.querySelectorAll<HTMLElement>(
        ".reveal:not(.is-revealed)"
      );
      if (elements.length === 0) return;

      const viewportHeight = window.innerHeight;
      for (const el of elements) {
        if (observed.has(el)) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top < viewportHeight + 60 && rect.bottom > -100) {
          el.classList.add("is-revealed");
        } else {
          observed.add(el);
          observer.observe(el);
        }
      }
    };

    const scheduleScan = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(scan);
    };

    scan();
    const fallbackTimer = window.setTimeout(scheduleScan, 120);

    const mutationObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes.length > 0) {
          scheduleScan();
          break;
        }
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.clearTimeout(fallbackTimer);
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [pathname, isAuthenticated, hasSkippedAuth]);

  return null;
}
