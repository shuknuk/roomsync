"use client";

import { useEffect, useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  ArrowRight,
  Check,
  Home,
  Lock,
  MessageCircle,
  RotateCcw,
  Search,
  Send,
  Settings,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import {
  campusLabels,
  cleanlinessLabels,
  createInitialState,
  defaultUser,
  demoProfiles,
  guestLabels,
  housingLabels,
  noiseLabels,
  sleepLabels,
  studyLabels,
  swipeLimit,
  swipeWindowMs,
} from "@/lib/data";
import { getCompatibility } from "@/lib/matching";
import { loadState, resetState, saveState } from "@/lib/storage";
import type { AppState, Campus, Cleanliness, GuestFrequency, HousingType, Message, NoiseTolerance, RoommateProfile, SleepSchedule, StudyHabit, UserProfile } from "@/lib/types";

type View = "home" | "onboarding" | "discover" | "matches" | "messages" | "profile";

const navItems: { view: View; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { view: "home", label: "Home", icon: Home },
  { view: "discover", label: "Discover", icon: Search },
  { view: "matches", label: "Matches", icon: Users },
  { view: "messages", label: "Messages", icon: MessageCircle },
  { view: "profile", label: "Profile", icon: User },
];

const textInput =
  "w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-teal-300";

const selectInput =
  "w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-teal-300";

function minutesUntilReset(state: AppState) {
  const windowStart = new Date(state.swipeWindowStartedAt).getTime();
  const remaining = Math.max(0, swipeWindowMs - (Date.now() - windowStart));
  return Math.ceil(remaining / 60000);
}

function getRemainingSwipes(state: AppState) {
  return Math.max(0, swipeLimit - state.swipes.length);
}

function getNextProfile(state: AppState) {
  const seen = new Set(state.swipes.map((swipe) => swipe.profileId));
  return demoProfiles.find((profile) => !seen.has(profile.id)) ?? null;
}

function createSeedMessages(profile: RoommateProfile): Message[] {
  return [
    {
      id: `${profile.id}-seed-1`,
      profileId: profile.id,
      sender: "them",
      text: `Hi, I am ${profile.name.split(" ")[0]}. Glad we matched before ISO.`,
      sentAt: new Date().toISOString(),
    },
    {
      id: `${profile.id}-seed-2`,
      profileId: profile.id,
      sender: "me",
      text: "Same here. Your profile looked like a strong lifestyle fit.",
      sentAt: new Date().toISOString(),
    },
  ];
}

export function RoomSyncApp() {
  const [state, setState] = useState<AppState>(() => createInitialState());
  const [view, setView] = useState<View>("home");
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const nextState = loadState();
    // LocalStorage is only available after hydration, so the MVP bootstraps browser state here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(nextState);
    setView(nextState.onboarded ? "discover" : "home");
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveState(state);
    }
  }, [loaded, state]);

  function updateState(updater: (current: AppState) => AppState) {
    setState((current) => updater(current));
  }

  function restartPrototype() {
    resetState();
    const nextState = createInitialState();
    setState(nextState);
    setActiveThread(null);
    setView("home");
  }

  if (!loaded) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-sm text-slate-300">
          Loading RoomSync...
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen pb-24 text-slate-100 md:pb-0">
      <TopNav activeView={view} onNavigate={setView} onboarded={state.onboarded} onReset={restartPrototype} />
      <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        {view === "home" && <HomeScreen onStart={() => setView(state.onboarded ? "discover" : "onboarding")} />}
        {view === "onboarding" && (
          <OnboardingScreen
            initialProfile={state.user}
            onComplete={(profile) => {
              updateState((current) => ({ ...current, onboarded: true, user: profile }));
              setView("discover");
            }}
          />
        )}
        {view === "discover" && (
          <DiscoverScreen
            state={state}
            onSwipe={(profile, decision) => {
              updateState((current) => {
                if (getRemainingSwipes(current) <= 0) {
                  return current;
                }

                const alreadySwiped = current.swipes.some((swipe) => swipe.profileId === profile.id);
                if (alreadySwiped) {
                  return current;
                }

                const matched = decision === "like" && profile.likedYou;
                const messages = matched && !current.messages.some((message) => message.profileId === profile.id)
                  ? [...current.messages, ...createSeedMessages(profile)]
                  : current.messages;

                return {
                  ...current,
                  swipes: [
                    ...current.swipes,
                    {
                      profileId: profile.id,
                      decision,
                      swipedAt: new Date().toISOString(),
                    },
                  ],
                  matches: matched && !current.matches.includes(profile.id) ? [...current.matches, profile.id] : current.matches,
                  messages,
                };
              });
            }}
            onCompleteProfile={() => setView("onboarding")}
            onViewMatches={() => setView("matches")}
          />
        )}
        {view === "matches" && (
          <MatchesScreen
            state={state}
            onOpenThread={(profileId) => {
              setActiveThread(profileId);
              setView("messages");
            }}
            onDiscover={() => setView("discover")}
          />
        )}
        {view === "messages" && (
          <MessagesScreen
            state={state}
            activeThread={activeThread}
            onSelectThread={setActiveThread}
            onSend={(profileId, text) => {
              updateState((current) => ({
                ...current,
                messages: [
                  ...current.messages,
                  {
                    id: `${profileId}-${Date.now()}`,
                    profileId,
                    sender: "me",
                    text,
                    sentAt: new Date().toISOString(),
                  },
                ],
              }));
            }}
            onFindMatches={() => setView("discover")}
          />
        )}
        {view === "profile" && (
          <ProfileScreen
            profile={state.user}
            onEdit={() => setView("onboarding")}
            swipesUsed={state.swipes.length}
            matches={state.matches.length}
          />
        )}
      </main>
      <BottomNav activeView={view} onNavigate={setView} onboarded={state.onboarded} />
    </div>
  );
}

function TopNav({
  activeView,
  onNavigate,
  onboarded,
  onReset,
}: {
  activeView: View;
  onNavigate: (view: View) => void;
  onboarded: boolean;
  onReset: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button className="flex items-center gap-3 text-left" onClick={() => onNavigate("home")} aria-label="Go to home">
          <span className="grid size-10 place-items-center rounded-2xl bg-[#cc0033] text-sm font-black text-white shadow-lg shadow-red-950/30">
            RS
          </span>
          <span>
            <span className="font-display block text-base font-extrabold tracking-tight">RoomSync</span>
            <span className="block text-xs text-slate-400">Rutgers ISO MVP</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-800 bg-slate-900/70 p-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const disabled = item.view !== "home" && !onboarded && item.view !== "profile";
            return (
              <button
                key={item.view}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm transition ${
                  activeView === item.view ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-800"
                } ${disabled ? "opacity-40" : ""}`}
                disabled={disabled}
                onClick={() => onNavigate(item.view)}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          className="hidden items-center gap-2 rounded-full border border-slate-800 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white md:flex"
          onClick={onReset}
        >
          <RotateCcw className="size-4" />
          Reset demo
        </button>
      </div>
    </header>
  );
}

function BottomNav({
  activeView,
  onNavigate,
  onboarded,
}: {
  activeView: View;
  onNavigate: (view: View) => void;
  onboarded: boolean;
}) {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950/95 px-2 pt-2 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const disabled = item.view !== "home" && !onboarded && item.view !== "profile";
          return (
            <button
              key={item.view}
              disabled={disabled}
              onClick={() => onNavigate(item.view)}
              className={`grid min-h-14 place-items-center rounded-2xl px-1 text-[0.68rem] transition ${
                activeView === item.view ? "bg-white text-slate-950" : "text-slate-400"
              } ${disabled ? "opacity-35" : "hover:bg-slate-900"}`}
            >
              <Icon className="size-5" />
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function HomeScreen({ onStart }: { onStart: () => void }) {
  const previewScore = getCompatibility(defaultUser, demoProfiles[0]).score;

  return (
    <section className="grid min-h-[calc(100vh-6rem)] items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-100">
          <Sparkles className="size-4 text-red-300" />
          Built for incoming Rutgers international students
        </div>
        <h1 className="font-display max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Find a roommate before ISO gets busy.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          RoomSync is a lifestyle-first roommate matcher for Rutgers ISO. Answer a few practical questions, swipe through compatible students, and message only after a mutual match.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold text-slate-950 transition hover:-translate-y-0.5"
            onClick={onStart}
          >
            Start matching
            <ArrowRight className="size-5" />
          </button>
          <a
            className="inline-flex items-center justify-center rounded-2xl border border-slate-700 px-6 py-4 font-bold text-slate-100 transition hover:border-slate-500"
            href="mailto:mahek@example.com?subject=RoomSync%20feedback"
          >
            Send feedback to Mahek
          </a>
        </div>
        <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
          {[
            ["30", "swipes"],
            ["12 hr", "reset"],
            ["match", "to chat"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="font-display text-2xl font-black text-white">{value}</div>
              <div className="mt-1 text-sm text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/75 p-4 shadow-2xl shadow-black/30">
        <div className="rounded-[1.5rem] bg-slate-900 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Today&apos;s top fit</div>
              <div className="text-xs text-slate-400">Rutgers New Brunswick</div>
            </div>
            <span className="rounded-full bg-teal-300 px-3 py-1 text-sm font-black text-slate-950">{previewScore}%</span>
          </div>
          <ProfileCard profile={demoProfiles[0]} user={defaultUser} compact />
        </div>
      </div>
    </section>
  );
}

function OnboardingScreen({
  initialProfile,
  onComplete,
}: {
  initialProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
}) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  function update<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="mx-auto max-w-4xl py-4">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-200">Profile setup</p>
        <h2 className="font-display mt-2 text-3xl font-black text-white sm:text-5xl">Answer the questions RoomSync matches on.</h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Keep it practical: sleep, guests, studying, budget, and campus fit matter more than a perfect bio.
        </p>
      </div>

      <div className="grid gap-4 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input className={textInput} value={profile.name} onChange={(event) => update("name", event.target.value)} />
          </Field>
          <Field label="Pronouns">
            <input className={textInput} value={profile.pronouns} onChange={(event) => update("pronouns", event.target.value)} />
          </Field>
          <Field label="Country or background">
            <input className={textInput} value={profile.country} onChange={(event) => update("country", event.target.value)} />
          </Field>
          <Field label="Major">
            <input className={textInput} value={profile.major} onChange={(event) => update("major", event.target.value)} />
          </Field>
        </div>

        <Field label="Short bio">
          <textarea className={`${textInput} min-h-24 resize-none`} value={profile.bio} onChange={(event) => update("bio", event.target.value)} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Sleep schedule">
            <Select value={profile.sleep} onChange={(value) => update("sleep", value as SleepSchedule)} options={sleepLabels} />
          </Field>
          <Field label="Cleanliness">
            <Select value={profile.cleanliness} onChange={(value) => update("cleanliness", value as Cleanliness)} options={cleanlinessLabels} />
          </Field>
          <Field label="Study style">
            <Select value={profile.study} onChange={(value) => update("study", value as StudyHabit)} options={studyLabels} />
          </Field>
          <Field label="Guests">
            <Select value={profile.guests} onChange={(value) => update("guests", value as GuestFrequency)} options={guestLabels} />
          </Field>
          <Field label="Noise">
            <Select value={profile.noise} onChange={(value) => update("noise", value as NoiseTolerance)} options={noiseLabels} />
          </Field>
          <Field label="Housing">
            <Select value={profile.housing} onChange={(value) => update("housing", value as HousingType)} options={housingLabels} />
          </Field>
          <Field label="Campus">
            <Select value={profile.campus} onChange={(value) => update("campus", value as Campus)} options={campusLabels} />
          </Field>
          <Field label="Budget min">
            <input className={textInput} type="number" value={profile.budgetMin} onChange={(event) => update("budgetMin", Number(event.target.value))} />
          </Field>
          <Field label="Budget max">
            <input className={textInput} type="number" value={profile.budgetMax} onChange={(event) => update("budgetMax", Number(event.target.value))} />
          </Field>
        </div>

        <Field label="Interests, separated by commas">
          <input
            className={textInput}
            value={profile.interests.join(", ")}
            onChange={(event) =>
              update(
                "interests",
                event.target.value
                  .split(",")
                  .map((interest) => interest.trim())
                  .filter(Boolean),
              )
            }
          />
        </Field>

        <button
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-slate-950 transition hover:-translate-y-0.5"
          onClick={() => onComplete(profile)}
        >
          Save profile and discover roommates
          <ArrowRight className="size-5" />
        </button>
      </div>
    </section>
  );
}

function DiscoverScreen({
  state,
  onSwipe,
  onCompleteProfile,
  onViewMatches,
}: {
  state: AppState;
  onSwipe: (profile: RoommateProfile, decision: "like" | "pass") => void;
  onCompleteProfile: () => void;
  onViewMatches: () => void;
}) {
  const profile = getNextProfile(state);
  const remaining = getRemainingSwipes(state);
  const resetMinutes = minutesUntilReset(state);

  if (!state.onboarded) {
    return (
      <EmptyState
        icon={Settings}
        title="Build your profile first"
        body="RoomSync needs your lifestyle answers before it can score roommate fit."
        actionLabel="Complete onboarding"
        onAction={onCompleteProfile}
      />
    );
  }

  return (
    <section className="grid gap-5 py-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-200">Discover</p>
            <h2 className="font-display mt-2 text-3xl font-black text-white">Lifestyle-ranked roommate cards</h2>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-300">
            <span className="font-black text-white">{remaining}</span> swipes left · resets in {resetMinutes} min
          </div>
        </div>

        {remaining <= 0 ? (
          <EmptyState
            icon={Lock}
            title="Swipe limit reached"
            body="You used 30 swipes in this 12-hour window. Your queue unlocks automatically when the timer resets."
            actionLabel="View matches"
            onAction={onViewMatches}
          />
        ) : profile ? (
          <div className="mx-auto max-w-xl">
            <ProfileCard profile={profile} user={state.user} />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                className="inline-flex min-h-16 items-center justify-center gap-2 rounded-3xl border border-red-400/30 bg-red-500/10 text-lg font-black text-red-100 transition hover:-translate-y-0.5 hover:bg-red-500/20"
                onClick={() => onSwipe(profile, "pass")}
              >
                <X className="size-6" />
                Pass
              </button>
              <button
                className="inline-flex min-h-16 items-center justify-center gap-2 rounded-3xl bg-teal-300 text-lg font-black text-slate-950 transition hover:-translate-y-0.5"
                onClick={() => onSwipe(profile, "like")}
              >
                <Check className="size-6" />
                Like
              </button>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Check}
            title="You reviewed every demo profile"
            body="The prototype queue is complete. Check your matches or reset the demo from the desktop header."
            actionLabel="View matches"
            onAction={onViewMatches}
          />
        )}
      </div>

      <aside className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
        <h3 className="font-display text-xl font-black text-white">MVP rules</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          <li className="flex gap-3"><Check className="mt-0.5 size-4 shrink-0 text-teal-300" />30 swipes reset every 12 hours.</li>
          <li className="flex gap-3"><Check className="mt-0.5 size-4 shrink-0 text-teal-300" />Scores are based on lifestyle fit first.</li>
          <li className="flex gap-3"><Check className="mt-0.5 size-4 shrink-0 text-teal-300" />Messaging unlocks only after a mutual match.</li>
        </ul>
      </aside>
    </section>
  );
}

function ProfileCard({ profile, user, compact = false }: { profile: RoommateProfile; user: UserProfile; compact?: boolean }) {
  const compatibility = useMemo(() => getCompatibility(user, profile), [user, profile]);

  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 shadow-2xl shadow-black/30">
      <div className="relative min-h-64 bg-gradient-to-br from-slate-800 via-slate-900 to-[#3a0b18] p-5">
        <div className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950">
          {compatibility.score}% fit
        </div>
        <div className="flex h-full min-h-52 flex-col justify-end">
          <div className="grid size-20 place-items-center rounded-3xl bg-[#cc0033] text-2xl font-black text-white shadow-xl">
            {profile.avatar}
          </div>
          <h3 className="font-display mt-4 text-3xl font-black text-white">{profile.name}</h3>
          <p className="mt-1 text-sm text-slate-300">
            {profile.year} · {profile.major} · {profile.country}
          </p>
        </div>
      </div>
      <div className="p-5">
        <p className="text-base leading-7 text-slate-200">{profile.lookingFor}</p>
        {!compact && (
          <>
            <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-slate-300 sm:grid-cols-4">
              <Badge>{sleepLabels[profile.sleep]}</Badge>
              <Badge>{cleanlinessLabels[profile.cleanliness]}</Badge>
              <Badge>{housingLabels[profile.housing]}</Badge>
              <Badge>{campusLabels[profile.campus]}</Badge>
            </div>
            <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="mb-2 text-sm font-black text-white">Why this score</div>
              <ul className="space-y-2 text-sm text-slate-300">
                {compatibility.reasons.map((reason) => (
                  <li key={reason} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-teal-300" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span key={interest} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  {interest}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function MatchesScreen({
  state,
  onOpenThread,
  onDiscover,
}: {
  state: AppState;
  onOpenThread: (profileId: string) => void;
  onDiscover: () => void;
}) {
  const matches = demoProfiles.filter((profile) => state.matches.includes(profile.id));

  if (matches.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No mutual matches yet"
        body="Like profiles that already liked you back to create a match and unlock messaging."
        actionLabel="Go to discover"
        onAction={onDiscover}
      />
    );
  }

  return (
    <section className="py-4">
      <div className="mb-5">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-200">Matches</p>
        <h2 className="font-display mt-2 text-3xl font-black text-white">Students who matched with you</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {matches.map((profile) => {
          const compatibility = getCompatibility(state.user, profile);
          return (
            <button
              key={profile.id}
              className="rounded-[2rem] border border-slate-800 bg-slate-950/75 p-5 text-left transition hover:-translate-y-0.5 hover:border-slate-600"
              onClick={() => onOpenThread(profile.id)}
            >
              <div className="flex items-center gap-4">
                <div className="grid size-14 place-items-center rounded-2xl bg-[#cc0033] font-black text-white">{profile.avatar}</div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl font-black text-white">{profile.name}</h3>
                  <p className="truncate text-sm text-slate-400">{profile.major} · {profile.country}</p>
                </div>
                <span className="rounded-full bg-teal-300 px-3 py-1 text-sm font-black text-slate-950">{compatibility.score}%</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{profile.lookingFor}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-200">
                Open messages
                <ArrowRight className="size-4" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MessagesScreen({
  state,
  activeThread,
  onSelectThread,
  onSend,
  onFindMatches,
}: {
  state: AppState;
  activeThread: string | null;
  onSelectThread: (profileId: string) => void;
  onSend: (profileId: string, text: string) => void;
  onFindMatches: () => void;
}) {
  const matches = demoProfiles.filter((profile) => state.matches.includes(profile.id));
  const selected = matches.find((profile) => profile.id === activeThread) ?? matches[0] ?? null;
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!activeThread && selected) {
      onSelectThread(selected.id);
    }
  }, [activeThread, onSelectThread, selected]);

  if (!selected) {
    return (
      <EmptyState
        icon={Lock}
        title="Messages are locked"
        body="RoomSync only opens chat after a mutual match, so students are not DMing strangers."
        actionLabel="Find matches"
        onAction={onFindMatches}
      />
    );
  }

  const threadMessages = state.messages.filter((message) => message.profileId === selected.id);

  return (
    <section className="grid min-h-[calc(100vh-9rem)] gap-4 py-4 lg:grid-cols-[18rem_1fr]">
      <aside className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-3">
        <div className="px-2 py-3 text-sm font-black uppercase tracking-[0.18em] text-teal-200">Threads</div>
        <div className="space-y-2">
          {matches.map((profile) => (
            <button
              key={profile.id}
              className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                selected.id === profile.id ? "bg-white text-slate-950" : "text-slate-200 hover:bg-slate-900"
              }`}
              onClick={() => onSelectThread(profile.id)}
            >
              <span className="grid size-10 place-items-center rounded-xl bg-[#cc0033] text-sm font-black text-white">{profile.avatar}</span>
              <span className="min-w-0">
                <span className="block truncate font-bold">{profile.name}</span>
                <span className={`block truncate text-xs ${selected.id === profile.id ? "text-slate-700" : "text-slate-400"}`}>Matched roommate</span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      <div className="flex min-h-[34rem] flex-col overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/80">
        <div className="border-b border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-[#cc0033] font-black text-white">{selected.avatar}</div>
            <div>
              <h2 className="font-display text-xl font-black text-white">{selected.name}</h2>
              <p className="text-sm text-slate-400">Messaging unlocked by mutual match</p>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-3 overflow-auto p-4">
          {threadMessages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                  message.sender === "me" ? "bg-teal-300 text-slate-950" : "bg-slate-800 text-slate-100"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <form
          className="flex gap-2 border-t border-slate-800 p-3"
          onSubmit={(event) => {
            event.preventDefault();
            const text = draft.trim();
            if (!text) {
              return;
            }
            onSend(selected.id, text);
            setDraft("");
          }}
        >
          <input
            className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-teal-300"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a message..."
          />
          <button className="grid size-12 place-items-center rounded-2xl bg-white text-slate-950" aria-label="Send message">
            <Send className="size-5" />
          </button>
        </form>
      </div>
    </section>
  );
}

function ProfileScreen({
  profile,
  onEdit,
  swipesUsed,
  matches,
}: {
  profile: UserProfile;
  onEdit: () => void;
  swipesUsed: number;
  matches: number;
}) {
  return (
    <section className="mx-auto max-w-4xl py-4">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/75 p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid size-20 place-items-center rounded-3xl bg-[#cc0033] text-2xl font-black text-white">
              {profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "RS"}
            </div>
            <div>
              <h2 className="font-display text-3xl font-black text-white">{profile.name}</h2>
              <p className="mt-1 text-slate-400">{profile.pronouns} · {profile.major} · {profile.country}</p>
            </div>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-black text-slate-950" onClick={onEdit}>
            <Settings className="size-4" />
            Edit answers
          </button>
        </div>
        <p className="mt-6 max-w-2xl text-slate-300">{profile.bio}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat value={String(swipesUsed)} label="swipes used" />
          <Stat value={String(matches)} label="matches" />
          <Stat value={`${profile.budgetMin}-${profile.budgetMax}`} label="budget range" />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Badge>{sleepLabels[profile.sleep]}</Badge>
          <Badge>{cleanlinessLabels[profile.cleanliness]}</Badge>
          <Badge>{studyLabels[profile.study]}</Badge>
          <Badge>{guestLabels[profile.guests]}</Badge>
          <Badge>{noiseLabels[profile.noise]}</Badge>
          <Badge>{housingLabels[profile.housing]}</Badge>
          <Badge>{campusLabels[profile.campus]}</Badge>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: Record<T, string>;
}) {
  return (
    <select className={selectInput} value={value} onChange={(event) => onChange(event.target.value as T)}>
      {Object.entries(options).map(([key, label]) => (
        <option key={key} value={key}>
          {label as string}
        </option>
      ))}
    </select>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-center">{children}</span>;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-4">
      <div className="font-display text-2xl font-black text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
  actionLabel,
  onAction,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <section className="grid min-h-[60vh] place-items-center py-8">
      <div className="max-w-md rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-900 text-teal-200">
          <Icon className="size-7" />
        </div>
        <h2 className="font-display mt-4 text-2xl font-black text-white">{title}</h2>
        <p className="mt-2 text-slate-300">{body}</p>
        <button className="mt-5 rounded-2xl bg-white px-5 py-3 font-black text-slate-950" onClick={onAction}>
          {actionLabel}
        </button>
      </div>
    </section>
  );
}
