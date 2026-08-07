import { NextResponse } from "next/server";
import { isRutgersEmail, rutgersEmailMessage } from "@/lib/supabase/config";

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

  const requestUrl = new URL(request.url);
  const isLocal = requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";
  const origin = isLocal ? requestUrl.origin : "https://roomsync-sigma.vercel.app";

  return NextResponse.json({ ok: true, emailRedirectTo: `${origin}/auth/callback` });
}
