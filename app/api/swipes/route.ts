import { NextResponse } from "next/server";
import { isRutgersEmail, rutgersEmailMessage } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { SwipeDecision } from "@/lib/types";

export async function POST(request: Request) {
  const { targetId, decision } = (await request.json()) as { targetId?: string; decision?: SwipeDecision };
  const supabase = await createClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user) {
    return NextResponse.json({ error: "Sign in before swiping." }, { status: 401 });
  }

  if (!isRutgersEmail(data.user.email ?? "")) {
    return NextResponse.json({ error: rutgersEmailMessage }, { status: 403 });
  }

  if (!targetId || (decision !== "like" && decision !== "pass")) {
    return NextResponse.json({ error: "Invalid swipe." }, { status: 400 });
  }

  const { error } = await supabase.from("swipes").insert({
    swiper_id: data.user.id,
    target_id: targetId,
    decision,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
