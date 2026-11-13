"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGrid } from "../context/GridContext";
import {
  MessageSquare,
  GitBranch,
  Sparkles,
  Paperclip,
  Mic,
  Send,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Cpu,
} from "lucide-react";

interface AIAssistantChatProps {
  onSwitchToWorkflow?: () => void;
}

export default function AIAssistantChat({ onSwitchToWorkflow }: AIAssistantChatProps) {
  const router = useRouter();
  const { chatMessages, sendChatMessage, activeTab, setActiveTab } = useGrid();
  const [inputText, setInputText] = useState("");

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
    <div className="flex-1 rounded-3xl bg-[#ede4d8] border border-[#d8cdbd] text-[#1c1f28] shadow-parchment p-6 xl:p-8 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Header matching concept screenshot */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#ded2c1]">
          <div>
            <h1 className="font-serif text-3xl xl:text-4xl font-normal text-[#181a24] tracking-tight">
              SmartGrid AI Assistant
            </h1>
            <p className="text-xs sm:text-sm text-[#5d6475] font-sans mt-0.5">
              Your AI partner for a more resilient grid.
            </p>
          </div>

          <div className="text-[10px] font-mono tracking-widest text-[#717888] uppercase text-right">
            REAL-TIME DATA • SECURE • BUILT FOR A CLEANER TOMORROW
          </div>
        </div>

        {/* Mode Switcher Pills: Chat vs Workflow */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex p-1 rounded-full bg-[#dfd4c3] border border-[#cfc3b0]">
            <button
              onClick={() => setActiveTab("chat")}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#3b59f8] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
            <button
              onClick={handleOpenWorkflow}
              className="flex items-center gap-2 px-6 py-2 rounded-full text-[#525968] hover:text-[#181a24] text-xs font-semibold transition-all"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Workflow</span>
            </button>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="space-y-6 max-h-[460px] overflow-y-auto pr-2">
          {chatMessages.map((msg) => {
            if (msg.sender === "user") {
              return (
                <div key={msg.id} className="flex items-start justify-end gap-3">
                  <div className="max-w-xl bg-[#f5eee5] border border-[#d8ccbb] rounded-2xl rounded-tr-sm p-4 text-xs sm:text-sm text-[#181a24] shadow-sm">
                    <p>{msg.content}</p>
                    <div className="text-[10px] font-mono text-[#788092] text-right mt-1.5">
                      {msg.timestamp}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#262f44] border border-[#3d4b6b] flex items-center justify-center text-xs font-bold text-white shrink-0 shadow">
                    {msg.avatarText || "JD"}
                  </div>
                </div>
              );
            }

            // Assistant Response
            return (
              <div key={msg.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#e0e7ff] border border-[#818cf8]/40 flex items-center justify-center text-[#4f46e5] shrink-0 shadow">
                  <Sparkles className="w-4 h-4" />
                </div>

                <div className="max-w-2xl bg-[#faf6f0] border border-[#d8ccbb] rounded-2xl rounded-tl-sm p-5 text-xs sm:text-sm text-[#181a24] shadow-sm space-y-3">
                  <div>
                    {msg.isCriticalAlert && (
                      <span className="font-semibold text-xs text-[#181a24]">
                        Node C is in a <span className="text-[#dc2626] font-bold">critical</span> state.{" "}
                      </span>
                    )}
                    <span className="text-[#3b4152] leading-relaxed">
                      {msg.content}
                    </span>
                  </div>

                  {/* Safest response recommendations list */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="pt-2">
                      <div className="font-bold text-xs text-[#181a24] mb-2 font-sans">
                        Safest response (recommended):
                      </div>
                      <div className="space-y-1.5 pl-1">
                        {msg.recommendations.map((rec, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-2.5 text-xs text-[#3b4152]">
                            <span className="w-4 h-4 rounded-full bg-[#4f46e5] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {rIdx + 1}
                            </span>
                            <span className="leading-snug">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pre-fill workflow helper text */}
                  {msg.workflowCard && (
                    <p className="text-xs text-[#525968] leading-relaxed pt-1">
                      I can open the recommended workflow with these steps pre-filled so your team can execute quickly.
                    </p>
                  )}

                  {/* Embedded Workflow Action Card matching mockup */}
                  {msg.workflowCard && (
                    <div className="mt-3 p-3.5 rounded-xl bg-[#f0e7db] border border-[#d5c7b3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#3b59f8]/15 border border-[#3b59f8]/30 flex items-center justify-center text-[#3b59f8] shrink-0">
                          <GitBranch className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-[#181a24]">
                            {msg.workflowCard.title}
                          </div>
                          <div className="text-[11px] text-[#636a7b]">
                            {msg.workflowCard.description}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleOpenWorkflow}
                        className="pill-button-cobalt text-xs py-2 px-4 shrink-0 shadow-sm"
                      >
                        <span>{msg.workflowCard.buttonText}</span>
                      </button>
                    </div>
                  )}

                  <div className="text-[10px] font-mono text-[#788092] mt-2">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input Bar at bottom */}
      <div className="pt-4 border-t border-[#ded2c1] mt-4">
        <form
          onSubmit={handleSend}
          className="bg-[#f7f2ea] border border-[#d6c7b3] rounded-2xl p-2 px-3 flex items-center gap-2 shadow-sm focus-within:border-[#3b59f8] transition-colors"
        >
          {/* Attachment Paperclip */}
          <button
            type="button"
            className="p-2 text-[#788092] hover:text-[#181a24] transition-colors"
            title="Attach telemetry snapshot or sensor log"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about the grid..."
            className="flex-1 bg-transparent text-xs sm:text-sm font-sans text-[#181a24] placeholder-[#788092] focus:outline-none"
          />

          {/* Microphone Voice Input */}
          <button
            type="button"
            className="p-2 text-[#788092] hover:text-[#181a24] transition-colors"
            title="Voice prompt"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            className="pill-button-cobalt text-xs py-2 px-4 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>

        <div className="text-center text-[10px] font-mono text-[#788092] mt-2">
          SmartGrid AI can make mistakes. Check critical information.
        </div>
      </div>
    </div>
  );
}
