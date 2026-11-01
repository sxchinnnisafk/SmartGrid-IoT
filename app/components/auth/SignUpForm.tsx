"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Briefcase, Eye, EyeOff, AlertCircle, CheckCircle2, Zap } from "lucide-react";
import { motion } from "framer-motion";

const teamRoles = [
  { value: "embedded", label: "Embedded Lead", icon: Zap, description: "ESP32, FreeRTOS, sensor fusion" },
  { value: "fullstack", label: "Full-Stack Lead", icon: Briefcase, description: "React, Next.js, API design" },
  { value: "cloud", label: "Cloud Lead", icon: User, description: "AWS, MQTT, data pipelines" },
  { value: "demo", label: "Demo Lead", icon: CheckCircle2, description: "Presentations, jury kits, UX" },
];

export default function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("embedded");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 glow-cyan inline-flex">
          <Zap className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Join Team Celestia</h1>
        <p className="text-zinc-400">Create your account to access the SmartGrid AIoT Command Center</p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-5 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-5 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Account created successfully. Redirecting to dashboard...</span>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
              required
              disabled={isLoading || success}
              className="w-full pl-10 pr-4 py-3 bg-zinc-900/80 border border-zinc-700/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-zinc-100 placeholder-zinc-500 text-sm transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="engineer@celestia.io"
              required
              disabled={isLoading || success}
              className="w-full pl-10 pr-4 py-3 bg-zinc-900/80 border border-zinc-700/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-zinc-100 placeholder-zinc-500 text-sm transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              disabled={isLoading || success}
              className="w-full pl-10 pr-12 py-3 bg-zinc-900/80 border border-zinc-700/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-zinc-100 placeholder-zinc-500 text-sm transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading || success}
              className="w-full pl-10 pr-12 py-3 bg-zinc-900/80 border border-zinc-700/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-zinc-100 placeholder-zinc-500 text-sm transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Role Selector */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Team Role
          </label>
          <div className="grid grid-cols-2 gap-3" role="radiogroup">
            {teamRoles.map(({ value, label, icon: Icon, description }) => (
              <label
                key={value}
                className={`relative cursor-pointer p-3 rounded-xl border-2 transition-all ${
                  role === value
                    ? "border-cyan-500 bg-cyan-500/10 glow-cyan"
                    : "border-zinc-700/50 hover:border-zinc-600 bg-zinc-900/50"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={value}
                  checked={role === value}
                  onChange={() => setRole(value)}
                  className="sr-only"
                  disabled={isLoading || success}
                />
                <div className="flex flex-col items-center gap-1.5">
                  <Icon className={`w-5 h-5 ${role === value ? "text-cyan-400" : "text-zinc-500"}`} />
                  <span className="text-sm font-medium text-zinc-100">{label}</span>
                  <span className="text-[10px] text-zinc-500 text-center">{description}</span>
                </div>
                {role === value && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-500 rotate-45" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || success}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:hover:bg-cyan-500 text-zinc-950 font-bold text-sm rounded-xl transition-all shadow glow-cyan disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Creating Account...</span>
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Footer Links */}
      <div className="mt-8 space-y-3 text-center">
        <p className="text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Sign In
          </Link>
        </p>
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Landing
        </Link>
      </div>
    </motion.div>
  );
}