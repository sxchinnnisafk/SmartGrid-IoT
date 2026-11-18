"use client";

import React, { useState, useRef, useEffect } from "react";
import { useGrid } from "../context/GridContext";
import {
  Sparkles,
  Paperclip,
  Mic,
  Send,
  Volume2,
  VolumeX,
  Square,
  Loader2,
} from "lucide-react";

const QUICK_PROMPTS = [
  "Summarize Node C fault risk",
  "Check ESP32-S3 rover patrol status",
  "Suggest next steps for Node C",
];

export default function AIAssistantChat() {
  const {
    chatMessages,
    sendChatMessage,
    isChatLoading,
    aiStatus,
    isPlayingVoice,
    speakingMessageId,
    speakText,
    stopSpeaking,
    autoReadVoice,
    setAutoReadVoice,
  } = useGrid();
  const [inputText, setInputText] = useState("");
  const streamEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatMessages.length, isChatLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isChatLoading) return;
    sendChatMessage(inputText);
    setInputText("");
  };

  return (
    <div className="flex-1 min-w-0 rounded-3xl bg-parchment border border-parchment-border text-parchment-text shadow-parchment p-5 xl:p-6 flex flex-col justify-between overflow-hidden">
      <div className="min-w-0">
        {/* Header with Live Gemini & ElevenLabs Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3.5 mb-3.5 border-b border-parchment-border">
          <div className="min-w-0">
            <h1 className="font-serif text-2xl xl:text-3xl font-normal text-parchment-text tracking-tight">
              SmartGrid AI Assistant
            </h1>
            <p className="text-xs sm:text-sm text-parchment-muted font-sans mt-0.5">
              Your AI partner for a more resilient grid.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold border ${
                aiStatus.gemini
                  ? "bg-signal-normalBg text-signal-normalText border-signal-normalBorder"
                  : "bg-parchment-light text-parchment-secondary border-parchment-borderStrong"
              }`}
              title={
                aiStatus.gemini
                  ? `Connected to ${aiStatus.model}`
                  : "Add GEMINI_API_KEY in .env for live Gemini responses"
              }
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  aiStatus.gemini ? "bg-signal-normalBright" : "bg-parchment-subtle"
                }`}
              />
              <span>{aiStatus.gemini ? "Gemini Live" : "Gemini Standby"}</span>
            </span>

            <button
              type="button"
              onClick={() => setAutoReadVoice((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold border transition-colors ${
                autoReadVoice
                  ? "bg-cobalt text-ink-onAccent border-cobalt"
                  : "bg-parchment-light text-parchment-secondary border-parchment-borderStrong hover:border-cobalt"
              }`}
              title={
                aiStatus.elevenLabs
                  ? "Toggle automatic ElevenLabs voice playback for AI replies"
                  : "Toggle automatic voice playback (add ELEVENLABS_API_KEY in .env for ElevenLabs neural voice)"
              }
            >
              {autoReadVoice ? (
                <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{aiStatus.elevenLabs ? "ElevenLabs Auto" : "Auto Voice"}</span>
            </button>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="space-y-4 max-h-[400px] min-h-[260px] overflow-y-auto pr-1.5">
          {chatMessages.length === 0 && !isChatLoading && (
            <div className="h-[240px] flex flex-col items-center justify-center text-center px-6">
              <div className="w-11 h-11 rounded-2xl bg-control-bg border border-cobalt-border flex items-center justify-center text-control mb-3">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="font-serif text-lg text-parchment-text">
                Hey! What&apos;s on your mind?
              </p>
              <p className="text-xs text-parchment-muted font-sans mt-1 max-w-sm">
                Ask anything about the grid, the ESP32-S3 rover, hardware architecture, or just say hi.
              </p>
            </div>
          )}

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

            const isThisMessageSpeaking = isPlayingVoice && speakingMessageId === msg.id;
            const spokenContent = msg.voicePreview || msg.content;

            return (
              <div key={msg.id} className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-control-bg border border-cobalt-border flex items-center justify-center text-control shrink-0">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                </div>

                <div className="max-w-xl bg-parchment-bright border border-parchment-borderStrong rounded-2xl rounded-tl-sm p-4 text-xs sm:text-sm text-parchment-text shadow-sm space-y-3 min-w-0">
                  <div className="leading-relaxed whitespace-pre-line">
                    {msg.isCriticalAlert && (
                      <span className="inline-flex items-center px-2 py-0.5 mr-2 mb-1 rounded-full bg-signal-criticalBg text-signal-criticalText border border-signal-criticalBorder text-[10px] font-mono font-bold uppercase align-middle">
                        Critical Alert
                      </span>
                    )}
                    <span className="text-parchment-secondary">{msg.content}</span>
                  </div>

                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="pt-1">
                      <div className="font-semibold text-xs text-parchment-text mb-2 font-sans">
                        Recommended operator steps:
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

                  {msg.voicePreview && (
                    <div className="px-3 py-2 rounded-xl bg-parchment-light border border-parchment-border text-xs text-parchment-secondary italic font-serif">
                      <span className="not-italic font-sans font-semibold text-[11px] text-cobalt mr-1.5">
                        Voice alert:
                      </span>
                      &ldquo;{msg.voicePreview}&rdquo;
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[10px] font-mono text-parchment-subtle">
                      {msg.timestamp}
                      {msg.model ? ` · ${msg.model}` : ""}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        isThisMessageSpeaking
                          ? stopSpeaking()
                          : void speakText(spokenContent, msg.id)
                      }
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-sans font-medium border transition-colors ${
                        isThisMessageSpeaking
                          ? "bg-cobalt text-ink-onAccent border-cobalt"
                          : "bg-parchment-light text-parchment-secondary border-parchment-border hover:border-cobalt hover:text-parchment-text"
                      }`}
                      title={
                        isThisMessageSpeaking
                          ? "Stop audio playback"
                          : aiStatus.elevenLabs
                          ? "Listen via ElevenLabs voice"
                          : "Listen via voice synthesis"
                      }
                    >
                      {isThisMessageSpeaking ? (
                        <>
                          <Square className="w-3 h-3 fill-current" aria-hidden="true" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {isChatLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-control-bg border border-cobalt-border flex items-center justify-center text-control shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              </div>
              <div className="bg-parchment-bright border border-parchment-borderStrong rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-parchment-muted font-sans">
                Analyzing live corridor telemetry with {aiStatus.gemini ? aiStatus.model : "SmartGrid AI"}...
              </div>
            </div>
          )}

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
              disabled={isChatLoading}
              onClick={() => sendChatMessage(prompt)}
              className="px-3 py-1 rounded-full bg-parchment-light hover:bg-parchment-bright disabled:opacity-50 border border-parchment-borderStrong text-[11px] font-sans text-parchment-secondary hover:text-parchment-text transition-colors"
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
            disabled={isChatLoading}
            onClick={() => sendChatMessage("Attach current three-node telemetry snapshot and diagnose anomalies.")}
            className="p-1.5 text-parchment-subtle hover:text-parchment-text transition-colors disabled:opacity-50"
            title="Attach telemetry snapshot"
            aria-label="Attach telemetry snapshot"
          >
            <Paperclip className="w-4 h-4" aria-hidden="true" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Gemini about the grid..."
            className="flex-1 bg-transparent text-xs sm:text-sm font-sans text-parchment-text placeholder-parchment-subtle focus:outline-none min-w-0"
          />

          <button
            type="button"
            disabled={isChatLoading}
            onClick={() => {
              setAutoReadVoice(true);
              sendChatMessage("Summarize Node C status and recommended actions aloud.");
            }}
            className="p-1.5 text-parchment-subtle hover:text-parchment-text transition-colors disabled:opacity-50"
            title="Request spoken AI summary"
            aria-label="Request spoken AI summary"
          >
            <Mic className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="submit"
            disabled={isChatLoading}
            className="pill-button-cobalt text-xs py-1.5 px-4 disabled:opacity-60"
          >
            {isChatLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>{isChatLoading ? "Sending" : "Send"}</span>
          </button>
        </form>

        <div className="text-center text-[11px] font-sans text-parchment-muted">
          SmartGrid AI monitors telemetry and suggests actions only — no automated dispatch.
        </div>
      </div>
    </div>
  );
}
