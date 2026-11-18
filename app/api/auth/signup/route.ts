import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase";
import { hashPassword } from "../../../lib/password";

interface SignUpBody {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SignUpBody;
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";
    const role = (body.role || "Patrol Operations").trim();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(password);
    const supabase = getSupabaseServerClient();

    if (supabase) {
      // Check if an account with this email already exists in Supabase
      const { data: existing, error: lookupError } = await supabase
        .from("operator_accounts")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      // Only fail on duplicate if the table actually exists and returned a row
      if (!lookupError && existing) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please sign in." },
          { status: 409 }
        );
      }

      if (!lookupError) {
        const { error: insertError } = await supabase
          .from("operator_accounts")
          .insert({
            email,
            name,
            role,
            password_hash: passwordHash,
          });

        if (!insertError) {
          return NextResponse.json(
            {
              ok: true,
              storage: "supabase",
              user: { name, email, role },
            },
            { status: 201 }
          );
        }

        // Duplicate race condition (unique violation 23505)
        if (insertError.code === "23505") {
          return NextResponse.json(
            { error: "An account with this email already exists. Please sign in." },
            { status: 409 }
          );
        }

        console.error("Supabase operator_accounts insert error:", insertError.code, insertError.message);
      } else {
        console.warn("Supabase operator_accounts unavailable; falling back to local browser store:", lookupError.code, lookupError.message);
      }
    }

    // Graceful fallback when Supabase isn't configured or schema.sql hasn't been run yet:
    // Return the salted scrypt hash so the browser stores it locally and /api/auth/signin still verifies it strictly.
    return NextResponse.json(
      {
        ok: true,
        storage: "local",
        user: { name, email, role },
        localRecord: { email, name, role, passwordHash },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Sign up API failure:", err);
    return NextResponse.json(
      { error: "Failed to register account. Please try again." },
      { status: 500 }
    );
  }
}
