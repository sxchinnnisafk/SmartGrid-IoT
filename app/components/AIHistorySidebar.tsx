"use client";

import React, { useState } from "react";
import { useGrid } from "../context/GridContext";
import {
  Clock,
  Search,
  Plus,
  MessageSquare,
  TowerControl as TransmissionTower,
} from "lucide-react";

export default function AIHistorySidebar() {
  const { activeChatId, setActiveChatId, sendChatMessage } = useGrid();
  const [searchQuery, setSearchQuery] = useState("");

  const todayChats = [
    { id: "chat-today-node-c", title: "Node C thermal fault", time: "10:24 AM" },
    { id: "chat-today-ev-hub", title: "EV hub load review", time: "9:11 AM" },
    { id: "chat-today-rover", title: "Rover patrol setup", time: "8:03 AM" },
  ];

  const yesterdayChats = [
    { id: "chat-yest-maintenance", title: "Maintenance report", time: "Apr 24" },
    { id: "chat-yest-storm", title: "Storm readiness plan", time: "Apr 24" },
    { id: "chat-yest-grid", title: "Grid optimization", time: "Apr 23" },
  ];

  const handleNewChat = () => {
    setActiveChatId("chat-today-new");
    sendChatMessage("Initialize fresh grid telemetry review for active corridor.");
  };

  return (
    <aside className="w-full lg:w-72 xl:w-80 rounded-3xl bg-[#141822] border border-[#242c3e] text-[#f4f5f8] p-5 flex flex-col justify-between select-none">
      <div>
        {/* Header: History */}
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-[#818cf8]" />
          <h2 className="font-serif text-2xl font-normal text-white">
            History
          </h2>
        </div>

        {/* Search input */}
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#7b8395]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-[#1b212f] border border-[#2b354a] rounded-xl pl-9 pr-3 py-2 text-xs font-sans text-white placeholder-[#687082] focus:outline-none focus:border-[#3b59f8] transition-colors"
          />
        </div>

        {/* + New conversation button */}
        <button
          onClick={handleNewChat}
          className="w-full pill-button-cobalt text-xs py-2.5 mb-6 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New conversation</span>
        </button>

        {/* Chat List: Today */}
        <div className="mb-5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#737c8e] mb-2 px-2">
            Today
          </div>
          <div className="space-y-1">
            {todayChats.map((c) => {
              const isActive = activeChatId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveChatId(c.id)}
                  className={`px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2 text-xs ${
                    isActive
                      ? "bg-[#252f46] text-white font-medium border border-[#3b59f8]/40 shadow-sm"
                      : "text-[#949eb2] hover:bg-[#1a2130] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MessageSquare className="w-3.5 h-3.5 text-[#818cf8] shrink-0" />
                    <span className="truncate">{c.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6c7587] shrink-0">
                    {c.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat List: Yesterday */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#737c8e] mb-2 px-2">
            Yesterday
          </div>
          <div className="space-y-1">
            {yesterdayChats.map((c) => {
              const isActive = activeChatId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveChatId(c.id)}
                  className={`px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2 text-xs ${
                    isActive
                      ? "bg-[#252f46] text-white font-medium border border-[#3b59f8]/40 shadow-sm"
                      : "text-[#949eb2] hover:bg-[#1a2130] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MessageSquare className="w-3.5 h-3.5 text-[#6c7587] shrink-0" />
                    <span className="truncate">{c.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6c7587] shrink-0">
                    {c.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Transmission Tower Graphic */}
      <div className="pt-6 border-t border-[#222a3d] mt-6 flex flex-col items-center text-center">
        <svg
          className="w-20 h-16 opacity-30 mb-2"
          viewBox="0 0 100 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Transmission Tower line art */}
          <path d="M 50,5 L 20,75 L 80,75 Z" stroke="#818cf8" strokeWidth="2" />
          <line x1="30" y1="50" x2="70" y2="50" stroke="#818cf8" strokeWidth="2" />
          <line x1="38" y1="30" x2="62" y2="30" stroke="#818cf8" strokeWidth="2" />
          <line x1="10" y1="35" x2="90" y2="35" stroke="#818cf8" strokeWidth="1.5" />
          <line x1="15" y1="55" x2="85" y2="55" stroke="#818cf8" strokeWidth="1.5" />
        </svg>
        <div className="text-[10px] font-mono tracking-widest text-[#717a8c] uppercase">
          SMARTER GRIDS. <br />
          SAFER COMMUNITIES.
        </div>
      </div>
    </aside>
  );
}
