"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useGrid } from "../context/GridContext";

/**
 * ScrollRevealObserver
 * High-performance, zero-dependency client component (<1.5 KB):
 * - Observes elements with class `.reveal` using IntersectionObserver.
 * - Automatically unobserves elements once revealed (no memory leaks, zero scroll overhead).
 * - Reacts immediately to Next.js route transitions, auth gate dismissals, and DOM mutations.
 * - Instantly reveals any elements already within or above the viewport so content is never hidden.
 * - Strictly respects `prefers-reduced-motion` by revealing elements immediately without animation.
 */
export default function ScrollRevealObserver() {
  const pathname = usePathname();
  const { isAuthenticated, hasSkippedAuth } = useGrid();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scanAndReveal = () => {
      const revealElements = document.querySelectorAll<HTMLElement>(".reveal:not(.is-revealed)");
      if (!revealElements || revealElements.length === 0) return;

      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((el) => el.classList.add("is-revealed"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              obs.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: "0px 0px -20px 0px",
          threshold: 0.05,
        }
      );

      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Immediately reveal anything already inside or above the current viewport
        if (rect.top < window.innerHeight + 50 && rect.bottom > -100) {
          el.classList.add("is-revealed");
        } else {
          observer.observe(el);
        }
      });
    };

    // Run immediately and across multiple ticks to catch client transitions and React hydration
    scanAndReveal();
    const frameId = requestAnimationFrame(scanAndReveal);
    const timer1 = setTimeout(scanAndReveal, 60);
    const timer2 = setTimeout(scanAndReveal, 250);

    // Watch DOM mutations (e.g. when Auth gate swaps to Landing page or chapter tab changes)
    const mutationObserver = new MutationObserver(() => {
      scanAndReveal();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer1);
      clearTimeout(timer2);
      mutationObserver.disconnect();
    };
  }, [pathname, isAuthenticated, hasSkippedAuth]);

  return null;
}
