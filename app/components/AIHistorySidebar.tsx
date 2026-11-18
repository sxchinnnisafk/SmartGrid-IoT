"use client";

import React, { useState } from "react";
import { useGrid } from "../context/GridContext";
import { Clock, Search, Plus, MessageSquare } from "lucide-react";

const TODAY_CHATS = [
  { id: "chat-today-node-c", title: "Node C fault review", time: "10:24 AM" },
  { id: "chat-today-ev-hub", title: "EV hub load review", time: "9:11 AM" },
  { id: "chat-today-rover", title: "Rover patrol setup", time: "8:03 AM" },
];

const YESTERDAY_CHATS = [
  { id: "chat-yest-maintenance", title: "Maintenance report", time: "Apr 24" },
  { id: "chat-yest-storm", title: "Storm readiness plan", time: "Apr 24" },
  { id: "chat-yest-grid", title: "Grid optimization", time: "Apr 23" },
];

export default function AIHistorySidebar() {
  const { activeChatId, setActiveChatId, sendChatMessage } = useGrid();
  const [searchQuery, setSearchQuery] = useState("");

  const query = searchQuery.trim().toLowerCase();
  const filteredToday = TODAY_CHATS.filter((c) => c.title.toLowerCase().includes(query));
  const filteredYesterday = YESTERDAY_CHATS.filter((c) => c.title.toLowerCase().includes(query));

  const handleNewChat = () => {
    setActiveChatId("chat-today-new");
    sendChatMessage("Initialize fresh grid telemetry review for active corridor.");
  };

  return (
    <aside className="w-full lg:w-64 xl:w-72 shrink-0 rounded-3xl bg-ink-surface border border-ink-border text-ink-text p-5 flex flex-col justify-between select-none">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-cobalt-soft" aria-hidden="true" />
          <h2 className="font-serif text-2xl font-normal text-ink-text">
            History
          </h2>
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
          onClick={handleNewChat}
          className="w-full pill-button-cobalt text-xs py-2.5 mb-5 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>New conversation</span>
        </button>

        {/* Chat List: Today */}
        {filteredToday.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-sans font-medium text-ink-muted mb-2 px-2">
              Today
            </div>
            <div className="space-y-1">
              {filteredToday.map((c) => {
                const isActive = activeChatId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveChatId(c.id)}
                    className={`w-full px-3 py-2 rounded-xl transition-colors flex items-center justify-between gap-2 text-xs text-left ${
                      isActive
                        ? "bg-ink-hover text-ink-text font-medium border border-cobalt-border shadow-sm"
                        : "text-ink-muted hover:bg-ink-card hover:text-ink-text"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate min-w-0">
                      <MessageSquare className="w-3.5 h-3.5 text-cobalt-soft shrink-0" aria-hidden="true" />
                      <span className="truncate">{c.title}</span>
                    </span>
                    <span className="text-[10px] font-mono text-ink-muted shrink-0">
                      {c.time}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Chat List: Yesterday */}
        {filteredYesterday.length > 0 && (
          <div>
            <div className="text-xs font-sans font-medium text-ink-muted mb-2 px-2">
              Yesterday
            </div>
            <div className="space-y-1">
              {filteredYesterday.map((c) => {
                const isActive = activeChatId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveChatId(c.id)}
                    className={`w-full px-3 py-2 rounded-xl transition-colors flex items-center justify-between gap-2 text-xs text-left ${
                      isActive
                        ? "bg-ink-hover text-ink-text font-medium border border-cobalt-border shadow-sm"
                        : "text-ink-muted hover:bg-ink-card hover:text-ink-text"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate min-w-0">
                      <MessageSquare className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />
                      <span className="truncate">{c.title}</span>
                    </span>
                    <span className="text-[10px] font-mono text-ink-muted shrink-0">
                      {c.time}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {filteredToday.length === 0 && filteredYesterday.length === 0 && (
          <div className="py-6 text-center text-xs text-ink-muted">
            No conversations match &ldquo;{searchQuery}&rdquo;.
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-ink-border mt-4 text-[11px] font-sans text-ink-muted">
        SmartGrid AIoT session archive
      </div>
    </aside>
  );
}
