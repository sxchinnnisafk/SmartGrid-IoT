"use client";

import React, { useState, useEffect } from "react";
import LandingHero from "./components/LandingHero";
import LandingStoryChapters from "./components/LandingStoryChapters";
import AuthPortalCard from "./components/AuthPortalCard";
import AuthLayout from "./components/AuthLayout";
import { useGrid } from "./context/GridContext";

export default function LandingPage() {
  const {
    isAuthenticated,
    hasSkippedAuth,
  } = useGrid();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show the branded Sign In & Sign Up gate before revealing the main landing page
  const showAuthGate = !isAuthenticated && !hasSkippedAuth;

  if (showAuthGate) {
    return (
      <AuthLayout>
        <AuthPortalCard initialMode="signin" />
      </AuthLayout>
    );
  }

  // Once authenticated or skipped, present the main landing page and 4-chapter editorial story
  return (
    <div className="min-h-screen bg-ink text-ink-text flex flex-col page-enter">
      {/* 1. Pixel-Perfect Landing Hero matching landing_page_design_concept.png */}
      <LandingHero />

      {/* 2. Four-Chapter Visual Editorial Story */}
      <LandingStoryChapters />
    </div>
  );
}
