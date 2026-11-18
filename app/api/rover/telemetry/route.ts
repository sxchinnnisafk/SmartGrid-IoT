import { NextRequest, NextResponse } from "next/server";

export interface HardwareRoverTelemetry {
  roverId: string;
  currentCheckpointId: "cp-a" | "cp-b" | "cp-c";
  targetCheckpointId: "cp-a" | "cp-b" | "cp-c";
  progress: number; // 0 to 100 along segment
  xPercent?: number; // optional direct map X (0-100)
  yPercent?: number; // optional direct map Y (0-100)
  isPatrolling: boolean;
  speedMps: number;
  batteryLevel: number;
  wifiRssi: number;
  irObstacleDetected: boolean;
  tftEyeState?: "PATROL_SCAN" | "OBSTACLE_HALT" | "STANDBY";
  updatedAt: number;
}

// Note: In-memory store works immediately on localhost / single Node servers.
// For multi-instance cloud hosting (like Vercel serverless), pair with Supabase Realtime or MQTT/WebSockets.
let latestTelemetry: HardwareRoverTelemetry | null = null;

const LIVE_TIMEOUT_MS = 10_000;

function isValidCheckpoint(id: unknown): id is "cp-a" | "cp-b" | "cp-c" {
  return id === "cp-a" || id === "cp-b" || id === "cp-c";
}

export async function GET() {
  const now = Date.now();
  const isLive = Boolean(latestTelemetry && now - latestTelemetry.updatedAt <= LIVE_TIMEOUT_MS);

  return NextResponse.json({
    live: isLive,
    telemetry: isLive ? latestTelemetry : null,
    serverTime: now,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<HardwareRoverTelemetry>;

    const currentCheckpointId = isValidCheckpoint(body.currentCheckpointId)
      ? body.currentCheckpointId
      : "cp-a";
    const targetCheckpointId = isValidCheckpoint(body.targetCheckpointId)
      ? body.targetCheckpointId
      : "cp-b";

    const progress =
      typeof body.progress === "number" && Number.isFinite(body.progress)
        ? Math.max(0, Math.min(100, Math.round(body.progress)))
        : 0;

    const irObstacleDetected = Boolean(body.irObstacleDetected);
    const isPatrolling = irObstacleDetected ? false : Boolean(body.isPatrolling ?? true);

    latestTelemetry = {
      roverId: typeof body.roverId === "string" && body.roverId.trim() ? body.roverId.trim() : "ESP32-S3 Rover R-1",
      currentCheckpointId,
      targetCheckpointId,
      progress,
      xPercent:
        typeof body.xPercent === "number" && Number.isFinite(body.xPercent)
          ? Math.max(0, Math.min(100, body.xPercent))
          : undefined,
      yPercent:
        typeof body.yPercent === "number" && Number.isFinite(body.yPercent)
          ? Math.max(0, Math.min(100, body.yPercent))
          : undefined,
      isPatrolling,
      speedMps:
        typeof body.speedMps === "number" && Number.isFinite(body.speedMps)
          ? Math.max(0, Number(body.speedMps.toFixed(2)))
          : isPatrolling
          ? 1.4
          : 0,
      batteryLevel:
        typeof body.batteryLevel === "number" && Number.isFinite(body.batteryLevel)
          ? Math.max(0, Math.min(100, Math.round(body.batteryLevel)))
          : 89,
      wifiRssi:
        typeof body.wifiRssi === "number" && Number.isFinite(body.wifiRssi)
          ? Math.round(body.wifiRssi)
          : -58,
      irObstacleDetected,
      tftEyeState:
        body.tftEyeState ||
        (irObstacleDetected ? "OBSTACLE_HALT" : isPatrolling ? "PATROL_SCAN" : "STANDBY"),
      updatedAt: Date.now(),
    };

    return NextResponse.json({
      ok: true,
      telemetry: latestTelemetry,
    });
  } catch (err) {
    console.error("Rover telemetry POST error:", err);
    return NextResponse.json({ error: "Invalid rover telemetry payload." }, { status: 400 });
  }
}
