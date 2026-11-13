"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * ScrollRevealObserver
 * High-performance, zero-dependency client component (<1.5 KB):
 * - Observes elements with class `.reveal` using IntersectionObserver.
 * - Automatically unobserves elements once revealed (no memory leaks, zero scroll overhead).
 * - Re-evaluates on Next.js route transitions.
 * - Respects `prefers-reduced-motion` by revealing elements immediately without animation.
 */
export default function ScrollRevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealElements = document.querySelectorAll<HTMLElement>(".reveal");

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            // Stop observing once animated to free memory and prevent CPU spikes
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -40px 0px", // Trigger slightly before element reaches bottom
        threshold: 0.08,
      }
    );

    revealElements.forEach((el) => {
      // If element is already in initial viewport, reveal quickly
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("is-revealed");
      } else {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
