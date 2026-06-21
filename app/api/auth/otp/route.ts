import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getSupabaseEnv, isRutgersEmail, rutgersEmailMessage } from "@/lib/supabase/config";

export async function POST(request: Request) {
  let email: string | undefined;
  try {
    const body = (await request.json()) as { email?: string };
    email = body.email;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const normalizedEmail = email?.trim().toLowerCase() ?? "";

  if (!isRutgersEmail(normalizedEmail)) {
    return NextResponse.json({ error: rutgersEmailMessage }, { status: 400 });
  }

  const { url, publishableKey } = getSupabaseEnv();
  const supabase = createSupabaseClient(url, publishableKey);
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;

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
