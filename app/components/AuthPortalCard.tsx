"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGrid } from "../context/GridContext";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface LocalAccountRecord {
  email: string;
  name: string;
  role: string;
  passwordHash: string;
}

const LOCAL_ACCOUNTS_KEY = "celestia_rover_accounts_v1";

function readLocalAccounts(): LocalAccountRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as LocalAccountRecord[]) : [];
  } catch {
    return [];
  }
}

function saveLocalAccount(record: LocalAccountRecord): void {
  try {
    const accounts = readLocalAccounts().filter(
      (a) => a.email.toLowerCase() !== record.email.toLowerCase()
    );
    accounts.push(record);
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    // Ignore storage quota errors
  }
}

interface AuthPortalCardProps {
  initialMode?: "signin" | "signup";
  onSuccess?: () => void;
  redirectTo?: string;
}

export default function AuthPortalCard({
  initialMode = "signin",
  onSuccess,
  redirectTo = "/",
}: AuthPortalCardProps) {
  const router = useRouter();
  const { login, register, skipAuth } = useGrid();

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Patrol Operations");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError("Please provide your operator email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const localAccount =
        readLocalAccounts().find((a) => a.email.toLowerCase() === normalizedEmail) || null;

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
          localAccount,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Invalid email or password.");
        return;
      }

      const authUser = data.user || { email: normalizedEmail, name: "", role: "Patrol Operations" };
      setSuccessMsg("Operator authenticated! Initializing patrol console...");
      login(authUser.email, authUser.name || undefined, authUser.role);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(redirectTo);
        }
      }, 450);
    } catch {
      setError("Unable to reach authentication server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!name.trim() || !normalizedEmail || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: normalizedEmail,
          password,
          role,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not create account.");
        return;
      }

      if (data.storage === "local" && data.localRecord) {
        const existingLocal = readLocalAccounts().find(
          (a) => a.email.toLowerCase() === normalizedEmail
        );
        if (existingLocal) {
          setError("An account with this email already exists. Please sign in.");
          return;
        }
        saveLocalAccount(data.localRecord as LocalAccountRecord);
      }

      const createdUser = data.user || { name: name.trim(), email: normalizedEmail, role };
      setSuccessMsg(
        data.storage === "supabase"
          ? "Account saved to Supabase database! Entering patrol console..."
          : "Account registered! Entering patrol console..."
      );
      register(createdUser.name, createdUser.email, createdUser.role);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(redirectTo);
        }
      }, 450);
    } catch {
      setError("Unable to reach registration server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    skipAuth();
    if (onSuccess) {
      onSuccess();
    } else {
      router.push(redirectTo);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl bg-[#ede4d8] border-2 border-[#d8cdbd] text-[#1c1f28] p-6 sm:p-10 shadow-2xl relative overflow-hidden select-none">
      {/* Background Subtle Contour Lines */}
      <div className="absolute inset-0 topographic-lines opacity-10 pointer-events-none" />

      {/* Top Brand Header */}
      <div className="text-center mb-6 relative z-10">
        {/* 6-Dot Matrix Icon */}
        <div className="inline-grid grid-cols-3 gap-1 p-2 rounded-xl bg-[#1a1f2c] border border-[#2b3347] mb-3 shadow">
          <span className="w-2 h-2 rounded-full bg-[#3b59f8]" />
          <span className="w-2 h-2 rounded-full bg-[#3b59f8]" />
          <span className="w-2 h-2 rounded-full bg-[#3b59f8]" />
          <span className="w-2 h-2 rounded-full bg-[#3b59f8]" />
          <span className="w-2 h-2 rounded-full bg-[#3b59f8]" />
          <span className="w-2 h-2 rounded-full bg-[#3b59f8]" />
        </div>

        <div className="text-[11px] font-mono tracking-widest text-[#717888] uppercase mb-1">
          CELESTIA ROVER • SURVEILLANCE &amp; PATROL
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#181a24] tracking-tight">
          {mode === "signin" ? "Operator Portal" : "Join Team Celestia"}
        </h1>

        <p className="text-xs sm:text-sm text-[#5d6475] font-sans mt-1 max-w-md mx-auto">
          {mode === "signin"
            ? "Sign in with operator credentials to monitor patrol paths and guide the ESP32-S3 surveillance rover."
            : "Register your operator profile for live rover status, path monitoring, and AI patrol advisory."}
        </p>
      </div>

      {/* Mode Switcher Tabs: Sign In vs Sign Up */}
      <div className="flex items-center justify-center mb-6 relative z-10">
        <div className="inline-flex p-1 rounded-full bg-[#dfd4c3] border border-[#cfc3b0] shadow-inner">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError("");
            }}
            className={`px-6 py-2 rounded-full text-xs font-semibold transition-all ${
              mode === "signin"
                ? "bg-[#3b59f8] text-white shadow-sm"
                : "text-[#525968] hover:text-[#181a24]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            className={`px-6 py-2 rounded-full text-xs font-semibold transition-all ${
              mode === "signup"
                ? "bg-[#3b59f8] text-white shadow-sm"
                : "text-[#525968] hover:text-[#181a24]"
            }`}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Error / Success Notifications */}
      {error && (
        <div className="mb-5 p-3.5 bg-[#fee2e2] border border-[#fecaca] rounded-2xl text-[#991b1b] text-xs flex items-center gap-2.5 font-mono shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#ef4444]" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-5 p-3.5 bg-[#dcfce7] border border-[#bbf7d0] rounded-2xl text-[#166534] text-xs flex items-center gap-2.5 font-mono shadow-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#22c55e]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* SIGN IN FORM */}
      {mode === "signin" && (
        <form onSubmit={handleSignIn} className="space-y-4 text-xs relative z-10">
          <div>
            <div className="flex items-center justify-between mb-1 font-mono text-[11px] text-[#555d6e]">
              <span className="uppercase">Operator Email</span>
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a92a3]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator.diaz@celestiarover.io"
                required
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-[#f7f2ea] border border-[#d6c7b3] text-[#181a24] placeholder-[#8a92a3] focus:outline-none focus:border-[#3b59f8] focus:ring-2 focus:ring-[#3b59f8]/20 transition-all text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 font-mono text-[11px] text-[#555d6e]">
              <span className="uppercase">Access Key / Password</span>
              <span className="text-[#8a92a3]">Verified against database</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a92a3]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#f7f2ea] border border-[#d6c7b3] text-[#181a24] placeholder-[#8a92a3] focus:outline-none focus:border-[#3b59f8] focus:ring-2 focus:ring-[#3b59f8]/20 transition-all text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a92a3] hover:text-[#181a24]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full pill-button-cobalt text-xs py-3.5 font-bold shadow-cobalt flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Patrol Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* SIGN UP FORM */}
      {mode === "signup" && (
        <form onSubmit={handleSignUp} className="space-y-4 text-xs relative z-10">
          <div>
            <label className="block font-mono text-[11px] text-[#555d6e] mb-1 uppercase">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a92a3]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Diaz"
                required
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-[#f7f2ea] border border-[#d6c7b3] text-[#181a24] placeholder-[#8a92a3] focus:outline-none focus:border-[#3b59f8] focus:ring-2 focus:ring-[#3b59f8]/20 transition-all text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] text-[#555d6e] mb-1 uppercase">
              Operator Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a92a3]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@celestiarover.io"
                required
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-[#f7f2ea] border border-[#d6c7b3] text-[#181a24] placeholder-[#8a92a3] focus:outline-none focus:border-[#3b59f8] focus:ring-2 focus:ring-[#3b59f8]/20 transition-all text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] text-[#555d6e] mb-1 uppercase">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a92a3]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  minLength={6}
                  required
                  className="w-full pl-10 pr-3 py-3 rounded-2xl bg-[#f7f2ea] border border-[#d6c7b3] text-[#181a24] placeholder-[#8a92a3] focus:outline-none focus:border-[#3b59f8] transition-all text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-[#555d6e] mb-1 uppercase">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a92a3]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  minLength={6}
                  required
                  className="w-full pl-10 pr-3 py-3 rounded-2xl bg-[#f7f2ea] border border-[#d6c7b3] text-[#181a24] placeholder-[#8a92a3] focus:outline-none focus:border-[#3b59f8] transition-all text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] text-[#555d6e] mb-1 uppercase">
              Role &amp; Responsibility
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-3 rounded-2xl bg-[#f7f2ea] border border-[#d6c7b3] text-[#181a24] focus:outline-none focus:border-[#3b59f8] transition-all text-xs font-mono"
            >
              <option value="Patrol Operations">Patrol Operations (Path Monitoring &amp; Control)</option>
              <option value="Embedded Systems Lead">Embedded Lead (ESP32-S3 Rover Firmware)</option>
              <option value="Security Analyst">Security Analyst (Perimeter &amp; Obstacles)</option>
              <option value="AI Systems Reviewer">AI Systems Reviewer (Human-in-the-Loop)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full pill-button-cobalt text-xs py-3.5 font-bold shadow-cobalt flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span>Registering...</span>
            ) : (
              <>
                <span>Create Operator Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* DIVIDER: OR CONTINUE WITHOUT ACCOUNT */}
      <div className="relative my-7 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#d8ccbc]" />
        </div>
        <span className="relative px-4 bg-[#ede4d8] text-[11px] font-mono tracking-wider text-[#7c8496] uppercase">
          or explore without an account
        </span>
      </div>

      {/* EXPLICIT OPTION: SKIP SIGN IN (GUEST ACCESS) */}
      <div className="relative z-10 text-center">
        <button
          type="button"
          onClick={handleSkip}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#f5eee5] hover:bg-white text-[#181a24] font-bold text-xs font-mono border-2 border-[#d2c5b3] hover:border-[#3b59f8] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 group"
        >
          <Zap className="w-4 h-4 text-[#3b59f8] group-hover:scale-110 transition-transform" />
          <span>Skip Sign In → Continue as Guest Operator</span>
          <ChevronRight className="w-4 h-4 text-[#3b59f8] group-hover:translate-x-0.5 transition-transform" />
        </button>

        <p className="text-[11px] text-[#717888] font-sans mt-2">
          Unlocks instant access to live ESP32-S3 rover status, path patrolling, and AI surveillance guidance.
        </p>
      </div>

      {/* Footer Credentials Info */}
      <div className="mt-8 pt-4 border-t border-[#ded2c1] text-center text-[10px] font-mono text-[#8a92a3]">
        Team Celestia (Akash • Sachin • Obed • Rayyan) • KLE Technological University
      </div>
    </div>
  );
}
