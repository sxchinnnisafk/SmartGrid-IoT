"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Cpu,
  Navigation,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Radio,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Server,
  Terminal,
  Layers,
  Sparkles,
  Bot,
} from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";
import { useRouter } from "next/navigation";

function FeatureCard({ title, description, icon: Icon, delay }: { title: string; description: string; icon: React.ElementType; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="card p-6 shadow-xl transition-all hover:border-[var(--color-accent)] hover:shadow-2xl group"
    >
      <div className="mb-4 p-3 bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/30 rounded-xl text-[var(--color-accent)] glow-accent inline-flex group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: "Edge Rover Patrol (Layer 1)",
      description: "ESP32-powered autonomous rovers deployed across substations for real-time thermal FLIR imaging and acoustic partial discharge inspection.",
      icon: Navigation,
    },
    {
      id: 1,
      title: "Real-Time Digital Twin (Layer 2)",
      description: "Cloud-hosted live digital twin synchronizing ESP32 MQTT telemetry streams for comprehensive grid load and voltage stability monitoring.",
      icon: Cpu,
    },
    {
      id: 2,
      title: "Jury-Ready Fault Kits & AI",
      description: "Automated fault ticket generation with AI-driven root cause analysis and instant mitigation recommendations for rapid operator response.",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] selection:bg-[var(--color-accent)] selection:text-[var(--color-text-inverse)]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-[var(--z-sticky)] glass border-b border-[var(--color-header-border)] px-6 py-4">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/30 rounded-xl text-[var(--color-accent)] glow-accent">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-wider text-[var(--color-text)] uppercase">
                SmartGrid <span className="text-[var(--color-accent)]">AIoT</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-accent-muted)] text-[var(--color-accent)] border border-[var(--color-accent)]/30">
                Team Celestia
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/signin"
              className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="btn btn-primary btn-sm glow-accent"
            >
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden py-24 px-6">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-border)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-xs font-mono mb-6 glow-accent"
          >
            <Sparkles className="w-4 h-4" />
            <span>Next-Generation Energy Technology & Substation Automation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[var(--color-text)] mb-6 tracking-tight leading-tight"
          >
            Autonomous Substation Monitoring & <span className="text-gradient-accent">Digital Twin Platform</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg lg:text-xl text-[var(--color-text-muted)] mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Bridging ESP32 edge intelligence with cloud digital twins. Eliminate thermal runaways, predict voltage sags, and deploy autonomous inspection rovers in real time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => router.push("/dashboard")}
              className="btn btn-primary btn-lg glow-accent w-full sm:w-auto"
            >
              <span>Explore Live Command Center</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#about"
              className="btn btn-secondary btn-lg w-full sm:w-auto"
            >
              <span>Learn How It Works</span>
            </a>
          </motion.div>

          {/* Mini Interactive Preview Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-16 card p-4 max-w-4xl mx-auto flex flex-wrap items-center justify-around gap-6 text-left font-mono text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[var(--color-success-border)]">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[var(--color-text-muted)]">MQTT Broker</div>
                <div className="font-bold text-[var(--color-success)]">Connected (192.168.1.105)</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--color-accent-muted)] text-[var(--color-accent)] border border-[var(--color-accent)]/30">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[var(--color-text-muted)]">ESP32 Nodes</div>
                <div className="font-bold text-[var(--color-text)]">3 Active (Node A, B, C)</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--color-warning-bg)] text-[var(--color-warning)] border border-[var(--color-warning-border)]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[var(--color-text-muted)]">Safety Interlock</div>
                <div className="font-bold text-[var(--color-warning)]">Armed & Operational</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section bg-[var(--color-bg-elevated)] border-y border-[var(--color-border)]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-4">
              Solving Modern Grid Vulnerabilities
            </h2>
            <p className="text-base text-[var(--color-text-muted)] leading-relaxed">
              As renewable integration and EV charging surge, traditional substations face unprecedented thermal and load stress. SmartGrid AIoT combines edge microcontrollers with real-time digital twins to prevent catastrophic failures before they occur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Autonomous Patrol Rovers"
              description="ESP32-driven robotic rovers navigate substation perimeters executing thermal FLIR scans and acoustic partial discharge diagnostics."
              icon={Navigation}
              delay={0}
            />
            <FeatureCard
              title="Live Digital Twin Sync"
              description="Bi-directional MQTT synchronization maps physical transformers and feeders into an interactive React Flow topology canvas."
              icon={Activity}
              delay={1}
            />
            <FeatureCard
              title="AI-Driven Mitigation"
              description="Automated fault ticket generation with intelligent root-cause diagnosis and instantaneous circuit breaker load-shedding protocols."
              icon={Bot}
              delay={2}
            />
          </div>
        </div>
      </section>

      {/* Interactive Step-by-Step Architecture Showcase */}
      <section className="section container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-4">
            Platform Architecture & Workflow
          </h2>
          <p className="text-base text-[var(--color-text-muted)]">
            Explore the three-tier architecture powering SmartGrid AIoT from edge sensor to command center.
          </p>
        </div>

        <div className="card p-8 max-w-4xl mx-auto shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-6 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/30 rounded-xl text-[var(--color-accent)] glow-accent">
                {React.createElement(steps[currentStep].icon, { className: "w-8 h-8" })}
              </div>
              <div>
                <span className="text-xs font-mono text-[var(--color-accent)]">STEP {currentStep + 1} OF 3</span>
                <h3 className="text-xl font-bold text-[var(--color-text)]">{steps[currentStep].title}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
                className="btn btn-secondary btn-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
                className="btn btn-primary btn-sm glow-accent"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-8">
            {steps[currentStep].description}
          </p>

          <div className="flex items-center justify-center gap-2">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx ? "w-12 bg-[var(--color-accent)] glow-accent" : "w-3 bg-[var(--color-border)]"
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Use Cases */}
      <section className="section bg-[var(--color-bg-elevated)] border-t border-[var(--color-border)]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-4">
              Real-World Impact & Value
            </h2>
            <p className="text-base text-[var(--color-text-muted)]">
              Designed for utility operators, emergency response teams, and smart city infrastructure managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card p-6 flex items-start gap-4">
              <div className="p-3 bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[var(--color-success-border)] rounded-xl shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">Zero-Downtime Prevention</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Early detection of thermal runaway on transformer winding coils prevents multi-million dollar substation failures and outages.
                </p>
              </div>
            </div>

            <div className="card p-6 flex items-start gap-4">
              <div className="p-3 bg-[var(--color-accent-muted)] text-[var(--color-accent)] border border-[var(--color-accent)]/30 rounded-xl shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">EV Peak Load Balancing</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Dynamic threshold sliders and automated load-shedding protect local residential feeders during simultaneous fast-charging surges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)] py-12 px-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/30 rounded-xl text-[var(--color-accent)] glow-accent">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-[var(--color-text)]">SmartGrid AIoT</span>
              <p className="text-xs text-[var(--color-text-muted)]">Command & Digital Twin Control Center • Team Celestia</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
            <Link href="/signin" className="hover:text-[var(--color-text)] transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-[var(--color-text)] transition-colors">Register</Link>
            <Link href="/dashboard" className="hover:text-[var(--color-text)] transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}