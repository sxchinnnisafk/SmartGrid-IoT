# SmartGrid AIoT — Intelligent Power Monitoring & Management System

> **Team Celestia** • POWER HACK 2026  
> **Theme 5**: AIoT for Intelligent Energy Systems  
> **Institution**: KLE Technological University | BCA, 2nd Year, Section D  
> **Team Members**: Akash • Sachin • Obed • Rayyan  
> **Event Date & Venue**: 18 November 2026 • Presidency University + BESCOM, Bengaluru  

---

## 1. Project Overview & Core Philosophy

**SmartGrid AIoT** is a connected physical-to-digital demonstration prototype bridging mobile robotic edge sensing, a live three-node digital twin, and explainable AI-assisted operator mitigation.

```
[ ESP32-S3 Mobile Rover ] ──(Wi-Fi Telemetry)──> [ Three-Node Digital Twin ] ──> [ AI Diagnostics & Voice ]
           ▲                                                                                    │
           └────────────────── (Supabase Realtime Return Path) ─────────────────────────────────┘
                                Operator-Approved Breaker & Threshold Commands
```

### Physical-to-Digital Loop
1. **Physical Edge**: A 4-wheel mobile rover powered by an **ESP32-S3** microcontroller and equipped with an SPI TFT animated-eye HUD patrols a miniature energy corridor.
2. **Digital Twin**: A web-based control room models three illustrative nodes:
   - **Node A — Residential Feeder** (Baseline normal operation • 98 MW • Homes & Smart Meters)
   - **Node B — EV Charging Hub** (Peak-load warning condition • 76 MW • Fast Chargers & Energy Storage)
   - **Node C — Industrial Transformer** (Critical thermal fault scenario • 102°C on winding coil T-3 • Substation Bay)
3. **AI Assistance**: Gemini via OpenRouter analyzes multi-sensor telemetry vectors against IEEE standards, and ElevenLabs delivers spoken voice alerts to field crews.
4. **Human-in-the-Loop Operator Workflow**: The human operator remains the sole authority for reviewing, testing, and publishing isolation commands and load-shedding configurations back to the edge.

---

## 2. Design System & UI/UX Extraction

Extracted directly from the brand styleboards (`landing_page_design_concept.png`, `control_room_design_concept.png`, `ai_assistant_chat_design_concept.png`, `ai_workflow_design_concept.png`):

### Color Palette ("Warm Paper. Deep Ink. Live Signal.")
| Token | Hex Value | Application |
|---|---|---|
| **Deep Ink Backdrop** | `#11141b` / `#171b24` | Chassis frames, outer headers, chalkboard landscape horizon |
| **Warm Parchment Surface** | `#ede4d8` / `#f5eee5` | Main workspace cards, interactive terrain canvas, node badges |
| **Parchment Border** | `#d8cdbd` / `#ded4c5` | Soft structural borders with subtle inner shadows |
| **Royal Cobalt (Action)** | `#3b59f8` / `#2f4bd8` | Primary CTA pill buttons, active mode toggles, energy lines |
| **Sage Green (Normal)** | `#22c55e` / `#dcfce7` | Healthy node indicators, normal baseline telemetry badges |
| **Warm Amber (Warning)** | `#f59e0b` / `#fef3c7` | Peak load alerts, elevated thermal gradient indicators |
| **Coral Red (Critical)** | `#ef4444` / `#fee2e2` | Over-temperature alerts (`102°C`), blinking fault beacons |
| **Control Lavender** | `#6366f1` / `#e0e7ff` | AI sparkle badges, action node cards, artifact highlights |

### Typography Stack
- **Headlines & Editorial Statements**: `Newsreader` / `Playfair Display` serif, tracking-tight, high-contrast, editorial elegance.
- **Interface Labels & Body**: `Plus Jakarta Sans` / `Inter`, clean geometric neo-grotesque sans-serif.
- **Telemetry & Technical Codes**: `JetBrains Mono` / monospace for temperatures, voltages, currents, timestamps, and JSON payloads.

---

## 3. Project Structure Tree

```
c:\COLLEGE\Hackathon 1\
├── app/
│   ├── layout.tsx                   # Root HTML, Google Fonts (Newsreader, Plus Jakarta Sans, JetBrains Mono)
│   ├── globals.css                  # Design system tokens, parchment canvas, topographic textures
│   ├── page.tsx                     # Editorial Landing Page & 6-Chapter Story
│   ├── control-room/
│   │   └── page.tsx                 # 3-Node Interactive Control Room
│   ├── dashboard/
│   │   └── page.tsx                 # Dashboard entry point (links to Control Room)
│   ├── ai-assistant/
│   │   └── page.tsx                 # AI Assistant Chat & Artifacts Workspace
│   ├── workflow/
│   │   └── page.tsx                 # Free-form Visual Workflow Canvas
│   ├── signin/
│   │   └── page.tsx                 # Operator Authentication
│   ├── signup/
│   │   └── page.tsx                 # Team Registration
│   ├── context/
│   │   ├── GridContext.tsx          # Real-time state, rover telemetry, 5-stage demo runner
│   │   └── ThemeContext.tsx         # Theme provider
│   ├── components/
│   │   ├── BrandHeader.tsx          # 6-dot matrix logo, breadcrumb, status, JD profile
│   │   ├── LandingHero.tsx          # Isometric scene matching landing_page_design_concept.png
│   │   ├── LandingStoryChapters.tsx # 6-chapter editorial narrative from PDF Page 7
│   │   ├── ControlRoomCanvas.tsx    # Isometric terrain canvas matching control_room_design_concept.png
│   │   ├── ControlRoomSidebar.tsx   # Live 3-asset status list matching control_room_design_concept.png
│   │   ├── ControlRoomActionDock.tsx# Bottom 3 actions (Start Patrol, Test Scenario, Publish Changes)
│   │   ├── AIAssistantChat.tsx      # Chat interface matching ai_assistant_chat_design_concept.png
│   │   ├── AIHistorySidebar.tsx     # Conversation history sidebar matching concept photo
│   │   ├── AIArtifactsPanel.tsx     # Current artifacts (snapshot, report, workflow, audio player)
│   │   ├── WorkflowCanvas.tsx       # Visual node canvas matching ai_workflow_design_concept.png
│   │   ├── HardwareEvidenceModal.tsx# Actual rover photos with verified truth labels
│   │   └── EndToEndDemoModal.tsx    # 5-step synchronized tabletop demonstration sequence
│   └── types/
│       └── grid.ts                  # TypeScript models (nodes, rover, telemetry, workflow, chat)
├── public/
│   └── assets/
│       ├── landing_page_design_concept.png
│       ├── control_room_design_concept.png
│       ├── ai_assistant_chat_design_concept.png
│       ├── ai_workflow_design_concept.png
│       ├── team_celestia_logo.png
│       ├── rover_front_prototype.jpg
│       └── rover_wiring_top_view.jpg
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 4. Key Functional Features

### 1. Editorial Landing Page (`/`)
- Recreates `landing_page_design_concept.png` pixel-perfectly.
- Interactive isometric network diagram featuring Node A, Node B, Node C, and the patrolling ESP32-S3 Rover.
- Six-chapter interactive editorial story explaining the invisible failure risk, physical edge rover, digital twin, AI diagnostics, human approval, and UN SDG alignment (Goals 7, 9, 11).

### 2. Three-Node Control Room (`/control-room`)
- Recreates `control_room_design_concept.png`.
- Warm parchment terrain with illustrated roads, lake, North compass indicator, and `[-] 100% [+]` zoom controls.
- Interactive nodes with live parameter inspect drawers.
- Bottom action dock:
  - **Start patrol** (dispatches ESP32-S3 rover along route).
  - **Test scenario** (triggers 5-step tabletop demonstration).
  - **Publish changes** (operator confirmation dialog applying parameters to edge return path).

### 3. SmartGrid AI Assistant (`/ai-assistant`)
- Recreates `ai_assistant_chat_design_concept.png`.
- Left conversation history with Today and Yesterday sessions.
- Center chat stream with exact diagnostic explanation (`102°C > 85°C`), 4-step recommended mitigation, and embedded "Fault response workflow" card.
- Right artifacts sidebar:
  - **Grid snapshot** (live mini topology chart).
  - **AI maintenance report** (IEEE 1547 & BESCOM repair context).
  - **Fault response workflow** (direct link).
  - **Voice dispatch preview** (interactive audio player with animated waveform and 18-second simulated voice alert: *"Dispatching field crew to Node C. Thermal fault detected. Bring standard repair kit."*).

### 4. Free-Form Workflow Canvas (`/workflow`)
- Recreates `ai_workflow_design_concept.png`.
- Seamless toggle between Chat and Workflow modes.
- Visual steps:
  - `Detect thermal fault` (Node C • Threshold exceeded).
  - `Isolate breaker` (Node C • Open breaker to prevent damage • Interactive toggle switch).
  - `Dispatch field crew` (Node C • Ready status).
- Interactive "Test workflow" simulation and "Publish workflow" command pipeline.

### 5. Tabletop Demonstration Flow (PDF Page 6)
Accessible via the **"Demo Flow"** button in the header:
1. **Start Patrol**: Operator starts rover from control room.
2. **Patrol + Sense**: Rover navigates from Node A through Node B toward Node C, streaming telemetry.
3. **Trigger Event**: Controlled thermal anomaly (`102°C`) introduced at Node C.
4. **Edge Response**: Rover halts, TFT switches to critical alert, simulated relay isolates breaker.
5. **Twin + AI Response**: Digital twin highlights critical fault, animates load rerouting, and AI prepares dispatch brief with voice alert.

### 6. Hardware Evidence & Truth Guardrails
Accessible via the **"Hardware Evidence"** button in the header:
- Real photographs (`rover_front_prototype.jpg` and `rover_wiring_top_view.jpg`).
- Clear delineation between evidenced hardware and proposed sensors.
- Strict simulation boundary notice: low-voltage tabletop prototype only; no connection to live mains or utility assets.

---

## 5. Verified External Data Citations

1. **BESCOM Repair Expenditure**:
   - *Karnataka Electricity Regulatory Commission (KERC)*, Combined Tariff Order 2025, BESCOM, Appendix 1A, p. 314.
   - Verified fact: BESCOM reported repair expenditure of **₹134.44 crore for 36,035 faulty distribution transformers in FY 2023–24**. (Framed as historical utility repair cost context, not project savings).
2. **Central Electricity Authority (CEA) Prior Art**:
   - *CEA Guidelines and Best Practices for O&M of Distribution Transformers* (2023), DTMU technical specifications, p. 73.
   - *CEA Revised Distribution Planning Criteria* (2024), Section 9.15, p. 133.

---

## 6. Setup, Build & Deployment Instructions

### Prerequisites
- Node.js 18.18+ or 20+
- npm or pnpm

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

### Production Build
```bash
# Compile and optimize for production
npm run build

# Start production server
npm run start
```

### Vercel / Cloud Deployment
The repository is fully configured for zero-configuration deployment to Vercel, Netlify, or any Node.js container:
1. Push this repository to GitHub/GitLab.
2. Import project into Vercel.
3. Build Command: `npm run build`
4. Output Directory: `.next`
5. Deploy!
