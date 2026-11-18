import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase";

type RoverCommandType = "START_PATROL" | "PAUSE_PATROL" | "ROUTE_TO" | "CLEAR_OBSTACLE";

interface RoverCommandRecord {
  id?: number;
  roverId: string;
  command: RoverCommandType;
  targetCheckpointId?: string | null;
  createdAt: string;
}

const VALID_COMMANDS = new Set<RoverCommandType>([
  "START_PATROL",
  "PAUSE_PATROL",
  "ROUTE_TO",
  "CLEAR_OBSTACLE",
]);

let latestMemoryCommand: RoverCommandRecord | null = null;

// GET: Polled by the ESP32-S3 rover to fetch the latest unacknowledged operator command
export async function GET(request: NextRequest) {
  const roverId = request.nextUrl.searchParams.get("roverId") || "ESP32-S3 Rover R-1";
  const ack = request.nextUrl.searchParams.get("ack") !== "false";
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("rover_commands")
        .select("*")
        .eq("rover_id", roverId)
        .eq("acknowledged", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle<{
          id: number;
          rover_id: string;
          command: RoverCommandType;
          target_checkpoint_id: string | null;
          created_at: string;
        }>();

      if (!error && data) {
        if (ack) {
          await supabase
            .from("rover_commands")
            .update({ acknowledged: true })
            .eq("id", data.id);
        }

        return NextResponse.json({
          source: "supabase",
          command: {
            id: data.id,
            roverId: data.rover_id,
            command: data.command,
            targetCheckpointId: data.target_checkpoint_id,
            createdAt: data.created_at,
          },
        });
      }

      return NextResponse.json({ source: "supabase", command: null });
    } catch (err) {
      console.error("Supabase rover_commands GET error:", err);
    }
  }

  const cmd = latestMemoryCommand;
  if (ack) {
    latestMemoryCommand = null;
  }
  return NextResponse.json({ source: "memory", command: cmd });
}

// POST: Called by the web dashboard when the operator starts/pauses/routes the rover
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      roverId?: string;
      command?: string;
      targetCheckpointId?: string;
    };

    const command = body.command as RoverCommandType;
    if (!VALID_COMMANDS.has(command)) {
      return NextResponse.json({ error: "Unsupported rover command." }, { status: 400 });
    }

    const roverId = (body.roverId || "ESP32-S3 Rover R-1").trim();
    const targetCheckpointId = body.targetCheckpointId || null;
    const record: RoverCommandRecord = {
      roverId,
      command,
      targetCheckpointId,
      createdAt: new Date().toISOString(),
    };

    latestMemoryCommand = record;

    let persistedTo: "supabase" | "memory" = "memory";
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.from("rover_commands").insert({
        rover_id: roverId,
        command,
        target_checkpoint_id: targetCheckpointId,
        acknowledged: false,
      });
      if (error) {
        console.error("Supabase rover_commands insert error:", error.message);
      } else {
        persistedTo = "supabase";
      }
    }

    return NextResponse.json({
      ok: true,
      persistedTo,
      command: record,
    });
  } catch (err) {
    console.error("Rover command POST error:", err);
    return NextResponse.json({ error: "Invalid rover command payload." }, { status: 400 });
  }
}
