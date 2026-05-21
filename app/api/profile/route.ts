import { NextResponse } from "next/server";
import { isRutgersEmail, rutgersEmailMessage } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/lib/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "RS";
}

export async function POST(request: Request) {
  const profile = (await request.json()) as UserProfile;
  const supabase = await createClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user) {
    return NextResponse.json({ error: "Sign in before saving a profile." }, { status: 401 });
  }

  if (!isRutgersEmail(data.user.email ?? "")) {
    return NextResponse.json({ error: rutgersEmailMessage }, { status: 403 });
  }

  const { error } = await supabase.from("profiles").upsert({
    id: data.user.id,
    name: profile.name,
    age: profile.age,
    university: profile.university,
    pronouns: profile.pronouns,
    country: profile.country,
    major: profile.major,
    bio: profile.bio,
    interests: profile.interests,
    sleep: profile.sleep,
    cleanliness: profile.cleanliness,
    study: profile.study,
    guests: profile.guests,
    noise: profile.noise,
    budget_min: profile.budgetMin,
    budget_max: profile.budgetMax,
    housing: profile.housing,
    campus: profile.campus,
    year: profile.year,
    temperature_preference: profile.temperaturePreference,
    willing_to_share: profile.willingToShare,
    cleanliness_score: profile.cleanlinessScore,
    noise_tolerance_score: profile.noiseToleranceScore,
    guests_frequency_score: profile.guestsFrequencyScore,
    avatar: initials(profile.name),
    looking_for: profile.bio || "A compatible Rutgers roommate for ISO and the school year.",
    is_complete: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
