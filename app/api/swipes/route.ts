import { NextResponse } from "next/server";
import { isRutgersEmail, rutgersEmailMessage } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { SwipeDecision } from "@/lib/types";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  let targetId: string | undefined;
  let decision: SwipeDecision | undefined;

  try {
    const body = (await request.json()) as { targetId?: string; decision?: SwipeDecision };
    targetId = body.targetId;
    decision = body.decision;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user) {
    return NextResponse.json({ error: "Sign in before swiping." }, { status: 401 });
  }

  if (!isRutgersEmail(data.user.email ?? "")) {
    return NextResponse.json({ error: rutgersEmailMessage }, { status: 403 });
  }

  if (!targetId || (decision !== "like" && decision !== "pass")) {
    return NextResponse.json({ error: "Invalid swipe decision." }, { status: 400 });
  }

  if (!uuidRegex.test(targetId)) {
    return NextResponse.json({ error: "Invalid target ID format." }, { status: 400 });
  }

  if (targetId === data.user.id) {
    return NextResponse.json({ error: "You cannot swipe on yourself." }, { status: 400 });
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
