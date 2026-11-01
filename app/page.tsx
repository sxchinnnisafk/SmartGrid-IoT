"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Cpu, Navigation, ChevronRight, ChevronLeft, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

// --- Components ---

function FeatureCard({ title, description, icon: Icon, delay }: { title: string; description: string; icon: React.ElementType; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 shadow-xl transition-all hover:border-cyan-500/50 hover:shadow-lg glow-cyan-hover"
    >
      <div className="mb-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 glow-cyan inline-flex">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-zinc-100 mb-1">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

// --- Main Landing Page Component ---

export default function LandingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: "Edge Rover (Layer 1)",
      description: "Deploying ESP32-powered autonomous rovers for real-time, on-site thermal FLIR scans and acoustic diagnostics.",
      icon: Navigation,
    },
    {
      id: 1,
      title: "Digital Twin (Layer 2)",
      description: "A cloud-hosted, live digital twin of the SmartGrid AIoT system, synchronizing ESP32 data for comprehensive monitoring.",
      icon: Cpu,
    },
    {
      id: 2,
      title: "Fault Kits (Jury-Ready)",
      description: "AI-driven fault analysis and mitigation recommendations, presented in an intuitive dashboard for rapid response.",
      icon: AlertTriangle,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/signin");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/signin");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden py-20 px-6">
        <div className="absolute inset-0 z-0 opacity-30 overflow-hidden">
          {/* Subtle background grid/pattern */}
          <svg className="w-full h-full">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#262626"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative z-10 text-center max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-zinc-100 mb-4 tracking-tight"
          >
            Team Celestia <span className="text-cyan-400">•</span> SmartGrid AIoT
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-xl lg:text-2xl text-zinc-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Harnessing the power of edge rover diagnostics and a live digital twin for unparalleled substation monitoring and control.
          </motion.p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={() => router.push("/signin")}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-lg rounded-xl shadow-lg glow-cyan transition-all"
            >
              Get Started
            </motion.button>
            <motion.a
              href="#features"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9 }}
              className="px-8 py-4 text-lg font-medium text-zinc-300 hover:text-cyan-400 transition-colors border border-zinc-800 bg-zinc-900/70 rounded-xl"
            >
              Learn More
            </motion.a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-zinc-100 mb-6 tracking-tight"
          >
            Core Pillars of Our System
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-zinc-400 mb-16 max-w-3xl mx-auto"
          >
            Experience the seamless integration of edge intelligence and cloud-based digital twins for robust substation management.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <FeatureCard
                key={step.id}
                title={step.title}
                description={step.description}
                icon={step.icon}
                delay={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Flow Section (Conditional) */}
      <AnimatePresence mode="wait">
        <motion.section
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="bg-zinc-900/90 py-8 border-t border-zinc-900/80"
        >
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 glow-cyan">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <h4 className="font-bold text-zinc-100">Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}</h4>
                <p className="text-zinc-400">{steps[currentStep].description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-cyan-400 transition-colors border border-zinc-800 bg-zinc-900/70 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 inline-block mr-1" /> Previous
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 text-sm font-bold text-zinc-950 bg-cyan-500 hover:bg-cyan-400 rounded-xl shadow glow-cyan transition-all"
              >
                {currentStep === steps.length - 1 ? "Sign In Now" : "Next Step"}
                <ChevronRight className="w-4 h-4 inline-block ml-1" />
              </button>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}