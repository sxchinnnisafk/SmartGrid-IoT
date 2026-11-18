import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase";
import { verifyPassword } from "../../../lib/password";

interface LocalAccountRecord {
  email: string;
  name: string;
  role: string;
  passwordHash: string;
}

interface SignInBody {
  email?: string;
  password?: string;
  localAccount?: LocalAccountRecord | null;
}

interface OperatorAccountRow {
  id: string;
  email: string;
  name: string;
  role: string;
  password_hash: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SignInBody;
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter both your email and password." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    let supabaseTableReady = false;

    if (supabase) {
      const { data, error } = await supabase
        .from("operator_accounts")
        .select("id, email, name, role, password_hash")
        .eq("email", email)
        .maybeSingle<OperatorAccountRow>();

      if (!error) {
        supabaseTableReady = true;

        if (data) {
          const valid = verifyPassword(password, data.password_hash);
          if (!valid) {
            return NextResponse.json(
              { error: "Incorrect password. Please try again." },
              { status: 401 }
            );
          }

          return NextResponse.json({
            ok: true,
            storage: "supabase",
            user: {
              name: data.name,
              email: data.email,
              role: data.role,
            },
          });
        }
      } else {
        console.warn("Supabase operator_accounts query error:", error.code, error.message);
      }
    }

    // Check browser-stored fallback account (used when schema.sql hasn't been run on Supabase yet)
    const local = body.localAccount;
    if (
      local &&
      typeof local.email === "string" &&
      local.email.toLowerCase() === email &&
      typeof local.passwordHash === "string"
    ) {
      const valid = verifyPassword(password, local.passwordHash);
      if (!valid) {
        return NextResponse.json(
          { error: "Incorrect password. Please try again." },
          { status: 401 }
        );
      }

      return NextResponse.json({
        ok: true,
        storage: "local",
        user: {
          name: local.name,
          email: local.email,
          role: local.role,
        },
      });
    }

    return NextResponse.json(
      {
        error: supabaseTableReady
          ? "No account found for this email. Please sign up first."
          : "Invalid credentials or account not registered. Please sign up first.",
      },
      { status: 401 }
    );
  } catch (err) {
    console.error("Sign in API failure:", err);
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
