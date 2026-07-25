import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();

    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Successful auth - redirect to intended destination
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Auth failed - redirect to signin with error
  return NextResponse.redirect(`${origin}/auth/signin?error=auth_failed`);
}
