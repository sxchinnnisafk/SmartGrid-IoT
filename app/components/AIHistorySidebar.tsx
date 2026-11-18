"use client";

import React, { useState, useMemo } from "react";
import { useGrid } from "../context/GridContext";
import { ChatSession } from "../types/grid";
import { Clock, Search, Plus, MessageSquare, Trash2 } from "lucide-react";

function getDateBucket(timestamp: number): "today" | "yesterday" | "earlier" {
  const d = new Date(timestamp);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

  if (d.getTime() >= startOfToday) return "today";
  if (d.getTime() >= startOfYesterday) return "yesterday";
  return "earlier";
}

function formatSessionTime(timestamp: number, bucket: "today" | "yesterday" | "earlier"): string {
  const d = new Date(timestamp);
  if (bucket === "today") {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function AIHistorySidebar() {
  const {
    chatSessions,
    activeChatId,
    setActiveChatId,
    createNewChat,
    deleteChatSession,
  } = useGrid();
  const [searchQuery, setSearchQuery] = useState("");

  const query = searchQuery.trim().toLowerCase();

  const grouped = useMemo(() => {
    const filtered = chatSessions
      .filter((session) => {
        if (!query) return true;
        if (session.title.toLowerCase().includes(query)) return true;
        return session.messages.some((m) => m.content.toLowerCase().includes(query));
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);

    const today: ChatSession[] = [];
    const yesterday: ChatSession[] = [];
    const earlier: ChatSession[] = [];

    for (const s of filtered) {
      const bucket = getDateBucket(s.updatedAt);
      if (bucket === "today") today.push(s);
      else if (bucket === "yesterday") yesterday.push(s);
      else earlier.push(s);
    }

    return { today, yesterday, earlier, total: filtered.length };
  }, [chatSessions, query]);

  const renderGroup = (
    label: string,
    sessions: ChatSession[],
    bucket: "today" | "yesterday" | "earlier"
  ) => {
    if (sessions.length === 0) return null;

    return (
      <div className="mb-4 last:mb-0">
        <div className="text-xs font-sans font-medium text-ink-muted mb-2 px-2">
          {label}
        </div>
        <div className="space-y-1">
          {sessions.map((session) => {
            const isActive = activeChatId === session.id;
            return (
              <div
                key={session.id}
                className={`group flex items-center gap-1 rounded-xl transition-colors ${
                  isActive
                    ? "bg-ink-hover text-ink-text font-medium border border-cobalt-border shadow-sm"
                    : "text-ink-muted hover:bg-ink-card hover:text-ink-text border border-transparent"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveChatId(session.id)}
                  className="flex-1 min-w-0 px-3 py-2 flex items-center justify-between gap-2 text-xs text-left"
                >
                  <span className="flex items-center gap-2 truncate min-w-0">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? "text-cobalt-soft" : "text-ink-muted"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{session.title}</span>
                  </span>
                  <span className="text-[10px] font-mono text-ink-muted shrink-0">
                    {formatSessionTime(session.updatedAt, bucket)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChatSession(session.id);
                  }}
                  aria-label={`Delete conversation ${session.title}`}
                  title="Delete conversation"
                  className="p-1.5 mr-1 rounded-lg text-ink-muted opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-signal-criticalBright hover:bg-signal-critical/15 transition-all shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside className="w-full lg:w-64 xl:w-72 shrink-0 rounded-3xl bg-ink-surface border border-ink-border text-ink-text p-5 flex flex-col justify-between select-none">
      <div className="min-h-0 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cobalt-soft" aria-hidden="true" />
            <h2 className="font-serif text-2xl font-normal text-ink-text">
              History
            </h2>
          </div>
          {chatSessions.length > 0 && (
            <span className="text-[11px] font-mono text-ink-muted">
              {chatSessions.length}
            </span>
          )}
        </div>

        {/* Live Search Filter */}
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-ink-muted" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter conversations..."
            aria-label="Filter conversations"
            className="w-full bg-ink-card border border-ink-border rounded-xl pl-9 pr-3 py-2 text-xs font-sans text-ink-text placeholder-ink-muted focus:outline-none focus:border-cobalt transition-colors"
          />
        </div>

        <button
          type="button"
          onClick={createNewChat}
          className="w-full pill-button-cobalt text-xs py-2.5 mb-5 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>New conversation</span>
        </button>

        {/* Persisted Conversation List */}
        <div className="max-h-[380px] overflow-y-auto pr-0.5">
          {renderGroup("Today", grouped.today, "today")}
          {renderGroup("Yesterday", grouped.yesterday, "yesterday")}
          {renderGroup("Earlier", grouped.earlier, "earlier")}

          {chatSessions.length === 0 && (
            <div className="py-6 px-2 text-center text-xs text-ink-muted leading-relaxed">
              No saved conversations yet. Send a message to start your first chat.
            </div>
          )}

          {chatSessions.length > 0 && grouped.total === 0 && (
            <div className="py-6 text-center text-xs text-ink-muted">
              No conversations match &ldquo;{searchQuery}&rdquo;.
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-ink-border mt-4 text-[11px] font-sans text-ink-muted">
        Saved locally in your browser
      </div>
    </aside>
  );
}
