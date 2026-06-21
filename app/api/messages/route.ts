import { NextResponse } from "next/server";
import { isRutgersEmail, rutgersEmailMessage } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  let matchId: string | undefined;
  let body: string | undefined;

  try {
    const payload = (await request.json()) as { matchId?: string; body?: string };
    matchId = payload.matchId;
    body = payload.body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = body?.trim() ?? "";
  const supabase = await createClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user) {
    return NextResponse.json({ error: "Sign in before sending messages." }, { status: 401 });
  }

  if (!isRutgersEmail(data.user.email ?? "")) {
    return NextResponse.json({ error: rutgersEmailMessage }, { status: 403 });
  }

  if (!matchId || !message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  if (!uuidRegex.test(matchId)) {
    return NextResponse.json({ error: "Invalid match ID format." }, { status: 400 });
  }

  // Verify match exists and user is participant
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("user_a, user_b")
    .eq("id", matchId)
    .maybeSingle();

  if (matchError || !match || (match.user_a !== data.user.id && match.user_b !== data.user.id)) {
    return NextResponse.json({ error: "Match not found or access denied." }, { status: 403 });
  }

  const { error } = await supabase.from("messages").insert({
    match_id: matchId,
    sender_id: data.user.id,
    body: message,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
