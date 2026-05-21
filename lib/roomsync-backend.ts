import { createClient } from "@/lib/supabase/client";
import { createInitialState, defaultUser, demoProfiles } from "./data";
import { getCompatibility } from "./matching";
import type { AppState, Message, RoommateProfile, SwipeRecord, UserProfile } from "./types";

type ProfileRow = {
  id: string;
  name: string;
  age: number | null;
  university: string;
  pronouns: string;
  country: string;
  major: string;
  bio: string;
  interests: string[];
  sleep: UserProfile["sleep"];
  cleanliness: UserProfile["cleanliness"];
  study: UserProfile["study"];
  guests: UserProfile["guests"];
  noise: UserProfile["noise"];
  budget_min: number;
  budget_max: number;
  housing: UserProfile["housing"];
  campus: UserProfile["campus"];
  year: string;
  temperature_preference: string;
  willing_to_share: boolean;
  cleanliness_score: number;
  noise_tolerance_score: number;
  guests_frequency_score: number;
  avatar: string;
  looking_for: string;
};

type SwipeRow = {
  target_id: string;
  decision: SwipeRecord["decision"];
  created_at: string;
};

type MatchRow = {
  id: string;
  user_a: string;
  user_b: string;
  created_at: string;
};

type MessageRow = {
  id: string;
  match_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

const minimumQueueSize = 6;
const swipeWindowMs = 12 * 60 * 60 * 1000;

function toUserProfile(row: ProfileRow): UserProfile {
  return {
    name: row.name,
    age: row.age,
    university: row.university,
    pronouns: row.pronouns,
    country: row.country,
    major: row.major,
    year: row.year,
    bio: row.bio,
    interests: row.interests ?? [],
    sleep: row.sleep,
    cleanliness: row.cleanliness,
    study: row.study,
    guests: row.guests,
    noise: row.noise,
    budgetMin: row.budget_min,
    budgetMax: row.budget_max,
    housing: row.housing,
    campus: row.campus,
    temperaturePreference: row.temperature_preference,
    willingToShare: row.willing_to_share,
    cleanlinessScore: row.cleanliness_score,
    noiseToleranceScore: row.noise_tolerance_score,
    guestsFrequencyScore: row.guests_frequency_score,
  };
}

function toRoommateProfile(row: ProfileRow): RoommateProfile {
  return {
    ...toUserProfile(row),
    id: row.id,
    avatar: row.avatar,
    likedYou: false,
    lookingFor: row.looking_for,
    source: "real",
  };
}

function getWindowStart(swipes: SwipeRecord[]) {
  const cutoff = Date.now() - swipeWindowMs;
  const recent = swipes
    .map((swipe) => new Date(swipe.swipedAt).getTime())
    .filter((time) => !Number.isNaN(time) && time >= cutoff)
    .sort((a, b) => a - b);

  return new Date(recent[0] ?? Date.now()).toISOString();
}

function addDemoFallback(profiles: RoommateProfile[], swipes: SwipeRecord[]) {
  if (profiles.length >= minimumQueueSize) {
    return profiles;
  }

  const usedIds = new Set([...profiles.map((profile) => profile.id), ...swipes.map((swipe) => swipe.profileId)]);
  const fallbackProfiles = demoProfiles
    .filter((profile) => !usedIds.has(profile.id))
    .slice(0, minimumQueueSize - profiles.length)
    .map((profile) => ({ ...profile, source: "demo" as const }));

  return [...profiles, ...fallbackProfiles];
}

export async function loadBackendState(): Promise<AppState> {
  const fallback = createInitialState();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return fallback;
  }

  const { data: profileRow } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle<ProfileRow>();
  const userProfile = profileRow ? toUserProfile(profileRow) : defaultUser;

  const [{ data: profileRows }, { data: swipeRows }, { data: matchRows }, { data: messageRows }] = await Promise.all([
    supabase.from("profiles").select("*").neq("id", user.id).eq("is_complete", true).limit(80).returns<ProfileRow[]>(),
    supabase.from("swipes").select("target_id, decision, created_at").order("created_at", { ascending: false }).returns<SwipeRow[]>(),
    supabase.from("matches").select("id, user_a, user_b, created_at").order("created_at", { ascending: false }).returns<MatchRow[]>(),
    supabase.from("messages").select("id, match_id, sender_id, body, created_at").order("created_at", { ascending: true }).returns<MessageRow[]>(),
  ]);

  const swipes = (swipeRows ?? []).map((swipe) => ({
    profileId: swipe.target_id,
    decision: swipe.decision,
    swipedAt: swipe.created_at,
  }));

  const matches = matchRows ?? [];
  const matchedProfileIds = matches.map((match) => (match.user_a === user.id ? match.user_b : match.user_a));
  const profileMap = new Map((profileRows ?? []).map((row) => [row.id, row]));

  const missingMatchedIds = matchedProfileIds.filter((id) => !profileMap.has(id));
  if (missingMatchedIds.length > 0) {
    const { data: matchedRows } = await supabase.from("profiles").select("*").in("id", missingMatchedIds).returns<ProfileRow[]>();
    (matchedRows ?? []).forEach((row) => profileMap.set(row.id, row));
  }

  const realProfiles = Array.from(profileMap.values())
    .map(toRoommateProfile)
    .sort((a, b) => getCompatibility(userProfile, b).score - getCompatibility(userProfile, a).score);

  const matchIdsByProfileId = Object.fromEntries(
    matches.map((match) => [match.user_a === user.id ? match.user_b : match.user_a, match.id]),
  );

  const profileIdByMatchId = Object.fromEntries(Object.entries(matchIdsByProfileId).map(([profileId, matchId]) => [matchId, profileId]));
  const messages: Message[] = (messageRows ?? [])
    .map((message) => {
      const profileId = profileIdByMatchId[message.match_id];
      if (!profileId) {
        return null;
      }

      return {
        id: message.id,
        profileId,
        sender: message.sender_id === user.id ? "me" : "them",
        text: message.body,
        sentAt: message.created_at,
      } satisfies Message;
    })
    .filter((message): message is Message => message !== null);

  return {
    authenticated: true,
    authEmail: user.email ?? null,
    onboarded: Boolean(profileRow),
    user: userProfile,
    profiles: addDemoFallback(realProfiles, swipes),
    swipes,
    matches: matchedProfileIds,
    matchIdsByProfileId,
    messages,
    swipeWindowStartedAt: getWindowStart(swipes),
  };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
