"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGrid } from "../context/GridContext";
import {
  MessageSquare,
  GitBranch,
  Sparkles,
  Paperclip,
  Mic,
  Send,
} from "lucide-react";

interface AIAssistantChatProps {
  onSwitchToWorkflow?: () => void;
}

const QUICK_PROMPTS = [
  "Summarize Node C thermal risk",
  "Check ESP32-S3 rover patrol status",
  "Draft field crew dispatch brief",
];

export default function AIAssistantChat({ onSwitchToWorkflow }: AIAssistantChatProps) {
  const router = useRouter();
  const { chatMessages, sendChatMessage, setActiveTab } = useGrid();
  const [inputText, setInputText] = useState("");
  const streamEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText("");
  };

  const handleOpenWorkflow = () => {
    if (onSwitchToWorkflow) {
      onSwitchToWorkflow();
    } else {
      router.push("/workflow");
    }
  };

  return (
    <div className="flex-1 min-w-0 rounded-3xl bg-parchment border border-parchment-border text-parchment-text shadow-parchment p-5 xl:p-6 flex flex-col justify-between overflow-hidden">
      <div className="min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3.5 mb-3.5 border-b border-parchment-border">
          <div className="min-w-0">
            <h1 className="font-serif text-2xl xl:text-3xl font-normal text-parchment-text tracking-tight">
              SmartGrid AI Assistant
            </h1>
            <p className="text-xs sm:text-sm text-parchment-muted font-sans mt-0.5">
              Your AI partner for a more resilient grid.
            </p>
          </div>

          <div className="text-xs font-sans text-parchment-muted shrink-0">
            Real-time diagnostic advisor
          </div>
        </div>

        {/* Mode Switcher Pills: Chat vs Workflow */}
        <div className="flex items-center justify-center mb-4">
          <div className="inline-flex p-1 rounded-full bg-parchment-dark border border-parchment-borderStrong">
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-cobalt text-ink-onAccent text-xs font-semibold shadow-sm transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Chat</span>
            </button>
            <button
              type="button"
              onClick={handleOpenWorkflow}
              className="flex items-center gap-2 px-5 py-1.5 rounded-full text-parchment-secondary hover:text-parchment-text text-xs font-semibold transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Workflow</span>
            </button>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1.5">
          {chatMessages.map((msg) => {
            if (msg.sender === "user") {
              return (
                <div key={msg.id} className="flex items-start justify-end gap-2.5">
                  <div className="max-w-lg bg-parchment-light border border-parchment-borderStrong rounded-2xl rounded-tr-sm p-3.5 text-xs sm:text-sm text-parchment-text shadow-sm">
                    <p>{msg.content}</p>
                    <div className="text-[10px] font-mono text-parchment-subtle text-right mt-1">
                      {msg.timestamp}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-ink-hover border border-ink-borderStrong flex items-center justify-center text-xs font-bold text-ink-text shrink-0">
                    {msg.avatarText || "JD"}
                  </div>
                </div>
              );
            }

            // Strip duplicated prefix when critical alert header is shown
            const cleanBody = msg.isCriticalAlert
              ? msg.content.replace(/^Node C is in a critical state\.\s*/i, "")
              : msg.content;

            return (
              <div key={msg.id} className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-control-bg border border-cobalt-border flex items-center justify-center text-control shrink-0">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                </div>

                <div className="max-w-xl bg-parchment-bright border border-parchment-borderStrong rounded-2xl rounded-tl-sm p-4 text-xs sm:text-sm text-parchment-text shadow-sm space-y-3 min-w-0">
                  <div className="leading-relaxed">
                    {msg.isCriticalAlert && (
                      <span className="font-semibold text-parchment-text">
                        Node C is in a <span className="text-signal-critical font-bold">critical</span> state.{" "}
                      </span>
                    )}
                    <span className="text-parchment-secondary">{cleanBody}</span>
                  </div>

                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="pt-1">
                      <div className="font-semibold text-xs text-parchment-text mb-2 font-sans">
                        Safest response (recommended):
                      </div>
                      <div className="space-y-1.5 pl-0.5">
                        {msg.recommendations.map((rec, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-2 text-xs text-parchment-secondary">
                            <span className="w-4 h-4 rounded-full bg-control text-ink-onAccent flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {rIdx + 1}
                            </span>
                            <span className="leading-snug">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.workflowCard && (
                    <div className="mt-2 p-3 rounded-xl bg-parchment-card border border-parchment-borderStrong flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-cobalt-tint border border-cobalt-border flex items-center justify-center text-cobalt shrink-0">
                          <GitBranch className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-parchment-text truncate">
                            {msg.workflowCard.title}
                          </div>
                          <div className="text-[11px] text-parchment-muted truncate">
                            {msg.workflowCard.description}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleOpenWorkflow}
                        className="pill-button-cobalt text-xs py-1.5 px-3.5 shrink-0"
                      >
                        <span>Open in Workflow</span>
                      </button>
                    </div>
                  )}

                  <div className="text-[10px] font-mono text-parchment-subtle">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={streamEndRef} />
        </div>
      </div>

      {/* Quick Prompts & Input Bar */}
      <div className="pt-3.5 border-t border-parchment-border mt-3.5 space-y-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendChatMessage(prompt)}
              className="px-3 py-1 rounded-full bg-parchment-light hover:bg-parchment-bright border border-parchment-borderStrong text-[11px] font-sans text-parchment-secondary hover:text-parchment-text transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSend}
          className="bg-parchment-bright border border-parchment-borderStrong rounded-2xl p-1.5 px-3 flex items-center gap-2 shadow-sm focus-within:border-cobalt transition-colors"
        >
          <button
            type="button"
            onClick={() => sendChatMessage("Attach current three-node telemetry snapshot.")}
            className="p-1.5 text-parchment-subtle hover:text-parchment-text transition-colors"
            title="Attach telemetry snapshot"
            aria-label="Attach telemetry snapshot"
          >
            <Paperclip className="w-4 h-4" aria-hidden="true" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about the grid..."
            className="flex-1 bg-transparent text-xs sm:text-sm font-sans text-parchment-text placeholder-parchment-subtle focus:outline-none min-w-0"
          />

          <button
            type="button"
            onClick={() => sendChatMessage("Generate spoken voice dispatch for Node C.")}
            className="p-1.5 text-parchment-subtle hover:text-parchment-text transition-colors"
            title="Voice dispatch prompt"
            aria-label="Voice dispatch prompt"
          >
            <Mic className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="submit"
            className="pill-button-cobalt text-xs py-1.5 px-4"
          >
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Send</span>
          </button>
        </form>

        <div className="text-center text-[11px] font-sans text-parchment-muted">
          SmartGrid AI advises only. Operators approve all switching actions.
        </div>
      </div>
    </div>
  );
}
