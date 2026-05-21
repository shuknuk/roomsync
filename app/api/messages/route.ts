import { NextResponse } from "next/server";
import { isRutgersEmail, rutgersEmailMessage } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { matchId, body } = (await request.json()) as { matchId?: string; body?: string };
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
