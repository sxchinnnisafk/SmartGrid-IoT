"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    if (email && password) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/control-room");
      }, 500);
    } else {
      setError("Please enter both email and password");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-[#ede4d8] border border-[#d8cdbd] text-[#1c1f28] p-8 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-serif text-3xl font-normal text-[#181a24] mb-1">
          Operator Sign In
        </h1>
        <p className="text-xs text-[#636a7b] font-sans">
          Access the SmartGrid AIoT Control Room
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-[#fee2e2] border border-[#fecaca] rounded-xl text-[#991b1b] text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#ef4444]" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-[#dcfce7] border border-[#bbf7d0] rounded-xl text-[#166534] text-xs flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#22c55e]" />
          <span>Operator authenticated. Directing to Control Room...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-mono text-[11px] text-[#555d6e] mb-1 uppercase">
            Operator Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a92a3]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@smartgrid.io"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f7f2ea] border border-[#d6c7b3] text-[#181a24] placeholder-[#8a92a3] focus:outline-none focus:border-[#3b59f8] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] text-[#555d6e] mb-1 uppercase">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a92a3]" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#f7f2ea] border border-[#d6c7b3] text-[#181a24] placeholder-[#8a92a3] focus:outline-none focus:border-[#3b59f8] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a92a3] hover:text-[#181a24]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || success}
          className="w-full pill-button-cobalt text-xs py-3 mt-2 shadow-cobalt"
        >
          {isLoading ? "Authenticating..." : "Sign In to Control Room"}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-[#636a7b]">
        <span>Demo Credentials: Any email &amp; password will authenticate.</span>
      </div>
    </div>
  );
}
