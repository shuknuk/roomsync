import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getSupabaseEnv, isRutgersEmail, rutgersEmailMessage } from "@/lib/supabase/config";

export async function POST(request: Request) {
  const { email } = (await request.json()) as { email?: string };
  const normalizedEmail = email?.trim().toLowerCase() ?? "";

  if (!isRutgersEmail(normalizedEmail)) {
    return NextResponse.json({ error: rutgersEmailMessage }, { status: 400 });
  }

  const { url, publishableKey } = getSupabaseEnv();
  const supabase = createSupabaseClient(url, publishableKey);
  const requestUrl = new URL(request.url);
  const isLocal = requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";
  const origin = isLocal ? requestUrl.origin : "https://roomsync-sigma.vercel.app";

  const { error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
