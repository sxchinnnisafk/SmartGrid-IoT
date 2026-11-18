import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase";

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

interface SupabaseTelemetryRow {
  rover_id: string;
  current_checkpoint_id: string;
  target_checkpoint_id: string;
  progress: number;
  x_percent: number | null;
  y_percent: number | null;
  is_patrolling: boolean;
  speed_mps: number;
  battery_level: number;
  wifi_rssi: number;
  ir_obstacle_detected: boolean;
  tft_eye_state: string;
  updated_at: string;
}

let latestMemoryTelemetry: HardwareRoverTelemetry | null = null;

const LIVE_TIMEOUT_MS = 10_000;

function isValidCheckpoint(id: unknown): id is "cp-a" | "cp-b" | "cp-c" {
  return id === "cp-a" || id === "cp-b" || id === "cp-c";
}

function rowToTelemetry(row: SupabaseTelemetryRow): HardwareRoverTelemetry {
  const updatedMs = Date.parse(row.updated_at);
  return {
    roverId: row.rover_id,
    currentCheckpointId: isValidCheckpoint(row.current_checkpoint_id)
      ? row.current_checkpoint_id
      : "cp-a",
    targetCheckpointId: isValidCheckpoint(row.target_checkpoint_id)
      ? row.target_checkpoint_id
      : "cp-b",
    progress: Math.max(0, Math.min(100, Math.round(row.progress ?? 0))),
    xPercent: typeof row.x_percent === "number" ? row.x_percent : undefined,
    yPercent: typeof row.y_percent === "number" ? row.y_percent : undefined,
    isPatrolling: Boolean(row.is_patrolling),
    speedMps: typeof row.speed_mps === "number" ? row.speed_mps : 0,
    batteryLevel: typeof row.battery_level === "number" ? row.battery_level : 89,
    wifiRssi: typeof row.wifi_rssi === "number" ? row.wifi_rssi : -58,
    irObstacleDetected: Boolean(row.ir_obstacle_detected),
    tftEyeState:
      row.tft_eye_state === "OBSTACLE_HALT" || row.tft_eye_state === "STANDBY"
        ? row.tft_eye_state
        : "PATROL_SCAN",
    updatedAt: Number.isFinite(updatedMs) ? updatedMs : Date.now(),
  };
}

export async function GET() {
  const now = Date.now();
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("rover_telemetry")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle<SupabaseTelemetryRow>();

      if (!error && data) {
        const telemetry = rowToTelemetry(data);
        const isLive = now - telemetry.updatedAt <= LIVE_TIMEOUT_MS;
        return NextResponse.json({
          live: isLive,
          source: "supabase",
          telemetry: isLive ? telemetry : null,
          serverTime: now,
        });
      }
    } catch (err) {
      console.error("Supabase rover_telemetry GET error:", err);
    }
  }

  const isLive = Boolean(
    latestMemoryTelemetry && now - latestMemoryTelemetry.updatedAt <= LIVE_TIMEOUT_MS
  );

  return NextResponse.json({
    live: isLive,
    source: "memory",
    telemetry: isLive ? latestMemoryTelemetry : null,
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

    const telemetry: HardwareRoverTelemetry = {
      roverId:
        typeof body.roverId === "string" && body.roverId.trim()
          ? body.roverId.trim()
          : "ESP32-S3 Rover R-1",
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

    latestMemoryTelemetry = telemetry;

    let persistedTo: "supabase" | "memory" = "memory";
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.from("rover_telemetry").upsert(
        {
          rover_id: telemetry.roverId,
          current_checkpoint_id: telemetry.currentCheckpointId,
          target_checkpoint_id: telemetry.targetCheckpointId,
          progress: telemetry.progress,
          x_percent: telemetry.xPercent ?? null,
          y_percent: telemetry.yPercent ?? null,
          is_patrolling: telemetry.isPatrolling,
          speed_mps: telemetry.speedMps,
          battery_level: telemetry.batteryLevel,
          wifi_rssi: telemetry.wifiRssi,
          ir_obstacle_detected: telemetry.irObstacleDetected,
          tft_eye_state: telemetry.tftEyeState ?? "PATROL_SCAN",
          updated_at: new Date(telemetry.updatedAt).toISOString(),
        },
        { onConflict: "rover_id" }
      );
      if (error) {
        console.error("Supabase rover_telemetry upsert error:", error.message);
      } else {
        persistedTo = "supabase";
      }
    }

    return NextResponse.json({
      ok: true,
      persistedTo,
      telemetry,
    });
  } catch (err) {
    console.error("Rover telemetry POST error:", err);
    return NextResponse.json({ error: "Invalid rover telemetry payload." }, { status: 400 });
  }
}
