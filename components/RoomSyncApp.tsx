"use client";

import { useEffect, useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { Header as LandingHeader } from "./landing/Header";
import { MorphingHero } from "./landing/MorphingHero";
import { Features as LandingFeatures } from "./landing/Features";
import { HowItWorks as LandingHowItWorks } from "./landing/HowItWorks";
import { FinalCTA as LandingFinalCTA } from "./landing/FinalCTA";
import { AboutPage } from "./landing/AboutPage";
import { HowItWorksPage } from "./landing/HowItWorksPage";
import { FAQsPage } from "./landing/FAQsPage";
import {
  ArrowRight,
  Check,
  HelpCircle,
  Home,
  Lock,
  Menu,
  MessageCircle,
  Moon,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Sun,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  campusLabels,
  cleanlinessLabels,
  createInitialState,
  guestLabels,
  housingLabels,
  noiseLabels,
  sleepLabels,
  studyLabels,
  swipeLimit,
  swipeWindowMs,
} from "@/lib/data";
import { getCompatibility } from "@/lib/matching";
import { loadBackendState, signOut } from "@/lib/roomsync-backend";
import { rutgersEmailMessage } from "@/lib/supabase/config";
import type { AppState, Campus, Cleanliness, GuestFrequency, HousingType, NoiseTolerance, RoommateProfile, SleepSchedule, StudyHabit, SwipeDecision, UserProfile } from "@/lib/types";

type View = "home" | "onboarding" | "discover" | "matches" | "messages" | "profile" | "about" | "how-it-works" | "faqs";

const navItems: { view: View; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { view: "home", label: "Home", icon: Home },
  { view: "discover", label: "Discover", icon: Search },
  { view: "matches", label: "Matches", icon: Users },
  { view: "messages", label: "Messages", icon: MessageCircle },
  { view: "profile", label: "Profile", icon: User },
];

const textInput =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-purple-400";

const profileInput =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/30 outline-none transition focus:border-purple-400";

function minutesUntilReset(state: AppState) {
  const windowStart = new Date(state.swipeWindowStartedAt).getTime();
  const remaining = Math.max(0, swipeWindowMs - (Date.now() - windowStart));
  return Math.ceil(remaining / 60000);
}

function getRemainingSwipes(state: AppState) {
  const cutoff = Date.now() - swipeWindowMs;
  const recentSwipes = state.swipes.filter((swipe) => new Date(swipe.swipedAt).getTime() >= cutoff);
  return Math.max(0, swipeLimit - recentSwipes.length);
}

function getNextProfile(state: AppState) {
  const seen = new Set(state.swipes.map((swipe) => swipe.profileId));
  return state.profiles.find((profile) => !seen.has(profile.id)) ?? null;
}

export function RoomSyncApp() {
  const [state, setState] = useState<AppState>(() => createInitialState());
  const [view, setView] = useState<View>("home");
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    void refreshState();
  }, []);

  async function refreshState(nextView?: View) {
    const nextState = await loadBackendState();
    setState(nextState);
    setView(nextView ?? (nextState.authenticated ? (nextState.onboarded ? "discover" : "onboarding") : "home"));
    setLoaded(true);
  }

  async function saveProfile(profile: UserProfile) {
    setStatus(null);
    const response = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus(result.error ?? "Could not save profile.");
      return;
    }

    await refreshState("discover");
  }

  async function handleSwipe(profile: RoommateProfile, decision: SwipeDecision) {
    if (getRemainingSwipes(state) <= 0 || state.swipes.some((swipe) => swipe.profileId === profile.id)) {
      return;
    }

    setStatus(null);

    if (profile.source === "demo") {
      setState((current) => ({
        ...current,
        swipes: [
          ...current.swipes,
          {
            profileId: profile.id,
            decision,
            swipedAt: new Date().toISOString(),
          },
        ],
      }));
      return;
    }

    const response = await fetch("/api/swipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId: profile.id, decision }),
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus(result.error ?? "Could not save swipe.");
      return;
    }

    await refreshState("discover");
  }

  async function sendMessage(profileId: string, text: string) {
    const matchId = state.matchIdsByProfileId[profileId];
    if (!matchId) {
      setStatus("Messaging unlocks only after a mutual match.");
      return;
    }

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, body: text }),
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus(result.error ?? "Could not send message.");
      return;
    }

    await refreshState("messages");
  }

  async function handleSignOut() {
    await signOut();
    setActiveThread(null);
    await refreshState("home");
  }

  if (!loaded) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-sm text-slate-300">
          Loading Roomora...
        </div>
      </main>
    );
  }

  if (view === "home") {
    return (
      <HomeScreen
        authenticated={state.authenticated}
        onboarded={state.onboarded}
        onStart={() => setView(state.authenticated ? (state.onboarded ? "discover" : "onboarding") : "profile")}
        onNavigate={setView}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    );
  }

  if (view === "about" || view === "how-it-works" || view === "faqs") {
    const ctaLabel = state.authenticated ? (state.onboarded ? "Browse Matches" : "Create My Profile") : "Join the Waitlist";
    const onStart = () => setView(state.authenticated ? (state.onboarded ? "discover" : "onboarding") : "profile");
    return (
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark bg-neutral-900 text-white" : "bg-white text-neutral-900"}`}>
        <LandingHeader 
          activeView={view}
          onNavigate={setView}
          onStart={onStart}
          authenticated={state.authenticated}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
        <main>
          {view === "about" && <AboutPage onNavigate={setView} />}
          {view === "how-it-works" && <HowItWorksPage onNavigate={setView} />}
          {view === "faqs" && <FAQsPage onNavigate={setView} />}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 text-slate-100 md:pb-0">
      <TopNav activeView={view} onNavigate={setView} authenticated={state.authenticated} onboarded={state.onboarded} authEmail={state.authEmail} onSignOut={handleSignOut} />
      <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        {status && (
          <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {status}
          </div>
        )}
        {view === "onboarding" && (
          state.authenticated ? (
            <OnboardingScreen initialProfile={state.user} authEmail={state.authEmail} onComplete={saveProfile} />
          ) : (
            <AuthScreen onAuthenticated={() => refreshState("onboarding")} />
          )
        )}
        {view === "discover" && (
          <DiscoverScreen
            state={state}
            onSwipe={handleSwipe}
            onCompleteProfile={() => setView("onboarding")}
            onViewMatches={() => setView("matches")}
            onAuthenticate={() => setView("profile")}
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
            onSend={sendMessage}
            onFindMatches={() => setView("discover")}
          />
        )}
        {view === "profile" && (
          state.authenticated ? (
            <ProfileScreen
              profile={state.user}
              authEmail={state.authEmail}
              onEdit={() => setView("onboarding")}
              onSignOut={handleSignOut}
              swipesUsed={state.swipes.length}
              matches={state.matches.length}
            />
          ) : (
            <AuthScreen onAuthenticated={() => refreshState("onboarding")} />
          )
        )}
      </main>
      <BottomNav activeView={view} onNavigate={setView} authenticated={state.authenticated} onboarded={state.onboarded} />
    </div>
  );
}

function TopNav({
  activeView,
  onNavigate,
  authenticated,
  onboarded,
  authEmail,
  onSignOut,
}: {
  activeView: View;
  onNavigate: (view: View) => void;
  authenticated: boolean;
  onboarded: boolean;
  authEmail: string | null;
  onSignOut: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300" style={{ backgroundColor: "rgba(68, 49, 67, 0.75)", borderColor: "rgba(255, 255, 255, 0.1)" }}>
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button className="flex items-center gap-3 group relative text-left" onClick={() => onNavigate("home")} aria-label="Go to home">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, rgb(179, 136, 255), rgb(216, 180, 254))" }}>
            <Home className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl tracking-tight font-semibold">
            <span style={{ color: "rgb(216, 180, 254)" }}>Room</span>
            <span className="text-white">ora</span>
          </span>
        </button>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const disabled = item.view !== "home" && item.view !== "profile" && (!authenticated || !onboarded);
            return (
              <button
                key={item.view}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition font-medium ${
                  activeView === item.view ? "bg-white text-slate-950 shadow-md font-bold" : "text-white/80 hover:bg-white/10 hover:text-white"
                } ${disabled ? "opacity-30" : ""}`}
                disabled={disabled}
                onClick={() => onNavigate(item.view)}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {authenticated ? (
          <button
            className="hidden items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors backdrop-blur-sm md:flex"
            onClick={onSignOut}
            title={authEmail ?? "Signed in"}
          >
            <RotateCcw className="size-4" />
            Sign out
          </button>
        ) : (
          <button
            className="hidden items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors backdrop-blur-sm md:flex"
            onClick={() => onNavigate("profile")}
          >
            <User className="size-4" />
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}

function BottomNav({
  activeView,
  onNavigate,
  authenticated,
  onboarded,
}: {
  activeView: View;
  onNavigate: (view: View) => void;
  authenticated: boolean;
  onboarded: boolean;
}) {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#443143]/95 px-2 pt-2 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const disabled = item.view !== "home" && item.view !== "profile" && (!authenticated || !onboarded);
          return (
            <button
              key={item.view}
              disabled={disabled}
              onClick={() => onNavigate(item.view)}
              className={`grid min-h-14 place-items-center rounded-2xl px-1 text-[0.68rem] transition ${
                activeView === item.view ? "bg-white text-[#443143] font-bold" : "text-white/60"
              } ${disabled ? "opacity-35" : "hover:bg-white/5"}`}
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

function HomeScreen({
  authenticated,
  onboarded,
  onStart,
  onNavigate,
  isDarkMode,
  setIsDarkMode,
}: {
  authenticated: boolean;
  onboarded: boolean;
  onStart: () => void;
  onNavigate: (view: View) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}) {
  const ctaLabel = authenticated ? (onboarded ? "Browse Matches" : "Create My Profile") : "Join the Waitlist";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark bg-neutral-900 text-white" : "bg-white text-neutral-900"}`}>
      <LandingHeader 
        activeView="home"
        onNavigate={onNavigate}
        onStart={onStart}
        authenticated={authenticated}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <main>
        <MorphingHero onStart={onStart} ctaLabel={ctaLabel} />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingFinalCTA onStart={onStart} ctaLabel={ctaLabel} />
      </main>
    </div>
  );
}

function AuthScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function requestOtp() {
    const normalizedEmail = email.trim().toLowerCase();
    setError(null);

    if (!normalizedEmail.endsWith("@scarletmail.rutgers.edu")) {
      setError(rutgersEmailMessage);
      return;
    }

    setSubmitting(true);
    const response = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail }),
    });
    const result = (await response.json()) as { error?: string };
    setSubmitting(false);

    if (!response.ok) {
      setError(result.error ?? rutgersEmailMessage);
      return;
    }

    setSent(true);
  }

  return (
    <section className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center py-8">
      <div className="w-full rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 sm:p-7">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-200">Rutgers sign in</p>
        <h2 className="font-display mt-2 text-3xl font-black text-white">Use your ScarletMail account.</h2>
        <p className="mt-3 text-slate-300">
          Roomora sends a one-time email link and only accepts Rutgers ScarletMail addresses for this MVP.
        </p>

        {sent ? (
          <div className="mt-6 rounded-3xl border border-teal-300/30 bg-teal-300/10 p-5">
            <div className="font-black text-teal-100">Check your email</div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              We sent a sign-in link to {email.trim().toLowerCase()}. Open it in this browser, then Roomora will bring you back to profile setup.
            </p>
            <button className="mt-4 rounded-2xl border border-slate-700 px-4 py-3 text-sm font-black text-white" onClick={onAuthenticated}>
              I opened the link
            </button>
          </div>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void requestOtp();
            }}
          >
            <Field label="Rutgers email">
              <input
                className={textInput}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="netid@scarletmail.rutgers.edu"
              />
            </Field>
            {error && <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-slate-950 transition hover:-translate-y-0.5 disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? "Sending link..." : "Send one-time link"}
              <ArrowRight className="size-5" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function scoreToCleanliness(score: number): Cleanliness {
  if (score < 34) return "relaxed";
  if (score < 67) return "moderate";
  return "very-clean";
}

function scoreToNoise(score: number): NoiseTolerance {
  if (score < 34) return "low";
  if (score < 67) return "medium";
  return "high";
}

function scoreToGuests(score: number): GuestFrequency {
  if (score < 34) return "rarely";
  if (score < 67) return "sometimes";
  return "often";
}

function scoreLabel(score: number, labels: [string, string, string]) {
  if (score < 34) return labels[0];
  if (score < 67) return labels[1];
  return labels[2];
}

function ProfileFormSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm sm:p-8">
      <div>
        <h2 className="font-display text-3xl font-semibold tracking-normal text-white">{title}</h2>
        <p className="mt-3 text-lg text-white/50">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function ProfileField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-white/85">{label}</span>
      {children}
    </label>
  );
}

function PreferenceSlider({
  label,
  value,
  valueLabel,
  onChange,
}: {
  label: string;
  value: number;
  valueLabel: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <label className="text-sm font-semibold text-white/85">{label}</label>
        <span className="text-sm text-purple-300">{valueLabel}</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-purple-400 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(255,255,255,0.65)]"
      />
    </div>
  );
}

function OnboardingScreen({
  initialProfile,
  authEmail,
  onComplete,
}: {
  initialProfile: UserProfile;
  authEmail: string | null;
  onComplete: (profile: UserProfile) => void;
}) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [customInterest, setCustomInterest] = useState("");
  const quickAddInterests = ["Gaming", "Cooking", "Fitness", "Reading", "Music", "Art", "Hiking", "Travel", "Photography", "Sports", "Coding", "Yoga"];

  function update<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function updateCleanliness(score: number) {
    setProfile((current) => ({ ...current, cleanlinessScore: score, cleanliness: scoreToCleanliness(score) }));
  }

  function updateNoise(score: number) {
    setProfile((current) => ({ ...current, noiseToleranceScore: score, noise: scoreToNoise(score) }));
  }

  function updateGuests(score: number) {
    setProfile((current) => ({ ...current, guestsFrequencyScore: score, guests: scoreToGuests(score) }));
  }

  function toggleInterest(interest: string) {
    setProfile((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));
  }

  function addCustomInterest() {
    const nextInterest = customInterest.trim();
    if (!nextInterest || profile.interests.includes(nextInterest)) {
      return;
    }
    setProfile((current) => ({ ...current, interests: [...current.interests, nextInterest] }));
    setCustomInterest("");
  }

  return (
    <section className="mx-auto max-w-5xl py-8">
      <div className="mb-10 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/15 px-5 py-3 text-sm font-semibold text-purple-200">
          <ShieldCheck className="size-5" />
          Verified with university email
        </div>
        <h1 className="font-display text-5xl font-semibold tracking-normal text-white">My Profile</h1>
        <p className="mt-5 text-xl text-slate-400">Tell us about yourself so we can find your perfect roommate match.</p>
      </div>

      <form
        className="space-y-8"
        onSubmit={(event) => {
          event.preventDefault();
          onComplete(profile);
        }}
      >
        <ProfileFormSection title="Basic Information" description="Your public profile info shown to other students">
          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileField label="Full Name *">
              <input className={profileInput} required value={profile.name} onChange={(event) => update("name", event.target.value)} placeholder="Your name" />
            </ProfileField>
            <ProfileField label="Age *">
              <input className={profileInput} required type="number" min={16} max={100} value={profile.age ?? ""} onChange={(event) => update("age", event.target.value ? Number(event.target.value) : null)} placeholder="18" />
            </ProfileField>
          </div>

          <ProfileField label="University *">
            <input className={profileInput} required value={profile.university} onChange={(event) => update("university", event.target.value)} />
          </ProfileField>

          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileField label="Major *">
              <input className={profileInput} required value={profile.major} onChange={(event) => update("major", event.target.value)} placeholder="e.g. Computer Science" />
            </ProfileField>
            <ProfileField label="Year *">
              <select className={profileInput} value={profile.year} onChange={(event) => update("year", event.target.value)}>
                {["Freshman", "Sophomore", "Junior", "Senior", "Graduate", "Transfer"].map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </select>
            </ProfileField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileField label="Pronouns">
              <input className={profileInput} value={profile.pronouns} onChange={(event) => update("pronouns", event.target.value)} placeholder="they/them" />
            </ProfileField>
            <ProfileField label="Country or background">
              <input className={profileInput} value={profile.country} onChange={(event) => update("country", event.target.value)} placeholder="International student" />
            </ProfileField>
          </div>

          <ProfileField label="University Email *">
            <input className={`${profileInput} text-white/70`} type="email" value={authEmail ?? ""} readOnly placeholder="your.name@university.edu" />
            <p className="mt-2 flex items-center gap-2 text-xs text-white/45"><ShieldCheck className="size-4" /> Used for verification only, not shown publicly</p>
          </ProfileField>

          <ProfileField label="Bio *">
            <textarea
              className={`${profileInput} min-h-36 resize-none`}
              required
              maxLength={500}
              value={profile.bio}
              onChange={(event) => update("bio", event.target.value)}
              placeholder="Tell potential roommates about yourself, your habits, what you're looking for..."
            />
            <p className="mt-2 text-right text-xs text-white/45">{profile.bio.length}/500</p>
          </ProfileField>
        </ProfileFormSection>

        <ProfileFormSection title="Budget & Housing" description="What type of housing are you looking for?">
          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileField label="Budget Min ($/mo)">
              <input className={profileInput} type="number" value={profile.budgetMin} onChange={(event) => update("budgetMin", Number(event.target.value))} />
            </ProfileField>
            <ProfileField label="Budget Max ($/mo)">
              <input className={profileInput} type="number" value={profile.budgetMax} onChange={(event) => update("budgetMax", Number(event.target.value))} />
            </ProfileField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileField label="Preferred Housing Type">
              <select className={profileInput} value={profile.housing} onChange={(event) => update("housing", event.target.value as HousingType)}>
                <option value="either">Open to Any</option>
                <option value="apartment">Apartment</option>
                <option value="dorm">Dorm</option>
              </select>
            </ProfileField>
            <ProfileField label="Preferred Campus">
              <select className={profileInput} value={profile.campus} onChange={(event) => update("campus", event.target.value as Campus)}>
                {Object.entries(campusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </ProfileField>
          </div>
        </ProfileFormSection>

        <ProfileFormSection title="Living Preferences" description="These power your compatibility score - be honest!">
          <PreferenceSlider label="Cleanliness" value={profile.cleanlinessScore} valueLabel={scoreLabel(profile.cleanlinessScore, ["Relaxed", "Moderately tidy", "Very tidy"])} onChange={updateCleanliness} />

          <ProfileField label="Sleep Schedule">
            <select className={profileInput} value={profile.sleep} onChange={(event) => update("sleep", event.target.value as SleepSchedule)}>
              <option value="balanced">Flexible</option>
              <option value="early">Early Bird (before 10pm)</option>
              <option value="late">Night Owl (after midnight)</option>
            </select>
          </ProfileField>

          <ProfileField label="Study Habits">
            <select className={profileInput} value={profile.study} onChange={(event) => update("study", event.target.value as StudyHabit)}>
              <option value="library">Moderate (some background noise okay)</option>
              <option value="quiet-room">Quiet (need silence to focus)</option>
              <option value="social-study">Flexible (can study anywhere)</option>
            </select>
          </ProfileField>

          <PreferenceSlider label="Noise Tolerance" value={profile.noiseToleranceScore} valueLabel={scoreLabel(profile.noiseToleranceScore, ["Low noise", "Some noise okay", "Noise is fine"])} onChange={updateNoise} />
          <PreferenceSlider label="Guests Frequency" value={profile.guestsFrequencyScore} valueLabel={scoreLabel(profile.guestsFrequencyScore, ["Rarely", "Sometimes", "Very often"])} onChange={updateGuests} />

          <ProfileField label="Temperature Preference">
            <select className={profileInput} value={profile.temperaturePreference} onChange={(event) => update("temperaturePreference", event.target.value)}>
              {["Flexible", "Warm", "Cool", "Very Warm", "Very Cool"].map((temperature) => (
                <option key={temperature}>{temperature}</option>
              ))}
            </select>
          </ProfileField>

          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-left"
            onClick={() => update("willingToShare", !profile.willingToShare)}
          >
            <span>
              <span className="block text-sm font-semibold text-white">Willing to Share Items</span>
              <span className="mt-1 block text-xs text-white/50">Food, essentials, household supplies</span>
            </span>
            <span className={`relative h-7 w-14 rounded-full transition ${profile.willingToShare ? "bg-purple-400" : "bg-white/20"}`}>
              <span className={`absolute left-1 top-1 size-5 rounded-full bg-white transition ${profile.willingToShare ? "translate-x-7" : "translate-x-0"}`} />
            </span>
          </button>
        </ProfileFormSection>

        <ProfileFormSection title="Interests & Hobbies" description="Shared interests increase your compatibility score">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className={`${profileInput} flex-1`}
              value={customInterest}
              onChange={(event) => setCustomInterest(event.target.value)}
              placeholder="Add a custom interest..."
            />
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-white transition hover:bg-white/20" onClick={addCustomInterest}>
              <Plus className="size-4" />
              Add
            </button>
          </div>

          <div>
            <p className="mb-3 text-xs text-white/50">Quick add</p>
            <div className="flex flex-wrap gap-2">
              {quickAddInterests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    profile.interests.includes(interest) ? "bg-purple-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  + {interest}
                </button>
              ))}
            </div>
          </div>

          {profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <button key={interest} type="button" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80" onClick={() => toggleInterest(interest)}>
                  {interest} x
                </button>
              ))}
            </div>
          )}
        </ProfileFormSection>

        <button className="w-full rounded-full bg-white py-5 text-lg font-semibold text-black transition hover:-translate-y-0.5 hover:bg-gray-100">
          Save Profile & Find My Roommate <ArrowRight className="ml-2 inline size-5" />
        </button>
        <p className="text-center text-xs text-white/40">All info protected by our privacy policy</p>
      </form>
    </section>
  );
}

function DiscoverScreen({
  state,
  onSwipe,
  onCompleteProfile,
  onViewMatches,
  onAuthenticate,
}: {
  state: AppState;
  onSwipe: (profile: RoommateProfile, decision: "like" | "pass") => void;
  onCompleteProfile: () => void;
  onViewMatches: () => void;
  onAuthenticate: () => void;
}) {
  const profile = getNextProfile(state);
  const remaining = getRemainingSwipes(state);
  const resetMinutes = minutesUntilReset(state);

  if (!state.authenticated) {
    return (
      <EmptyState
        icon={Lock}
        title="Sign in to discover"
        body="Roomora needs a Rutgers ScarletMail session before showing real roommate data."
        actionLabel="Sign in"
        onAction={onAuthenticate}
      />
    );
  }

  if (!state.onboarded) {
    return (
      <EmptyState
        icon={Settings}
        title="Build your profile first"
        body="Roomora needs your lifestyle answers before it can score roommate fit."
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
            title="You reviewed every available profile"
            body="Check your matches now. New real profiles will appear here as more Rutgers students join."
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
    <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl shadow-black/30">
      <div className="relative min-h-64 bg-gradient-to-br from-[#443143] via-[#5c3e5a] to-[#251524] p-5">
        <div className="absolute right-5 top-5 rounded-full bg-[#f4ccf5] px-4 py-2 text-sm font-bold text-black">
          {compatibility.score}% fit
        </div>
        <div className="flex h-full min-h-52 flex-col justify-end">
          <div className="grid size-20 place-items-center rounded-3xl bg-gradient-to-br from-[#cc0033] to-[#990026] text-2xl font-black text-white shadow-xl border border-white/20">
            {profile.avatar}
          </div>
          <h3 className="font-display mt-4 text-3xl font-black text-white">{profile.name}</h3>
          <p className="mt-1 text-sm text-slate-350">
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
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 text-sm font-black text-white">Why this score</div>
              <ul className="space-y-2 text-sm text-slate-300">
                {compatibility.reasons.map((reason) => (
                  <li key={reason} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#f4ccf5]" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span key={interest} className="rounded-full bg-white/10 border border-white/5 px-3 py-1 text-xs text-slate-300">
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
  const matches = state.profiles.filter((profile) => state.matches.includes(profile.id));

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
  const matches = state.profiles.filter((profile) => state.matches.includes(profile.id));
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
        body="Roomora only opens chat after a mutual match, so students are not DMing strangers."
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
  authEmail,
  onEdit,
  onSignOut,
  swipesUsed,
  matches,
}: {
  profile: UserProfile;
  authEmail: string | null;
  onEdit: () => void;
  onSignOut: () => void;
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
              {authEmail && <p className="mt-1 text-sm text-teal-200">{authEmail}</p>}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-black text-slate-950" onClick={onEdit}>
              <Settings className="size-4" />
              Edit answers
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 font-black text-slate-100" onClick={onSignOut}>
              <RotateCcw className="size-4" />
              Sign out
            </button>
          </div>
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

function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center text-slate-250">{children}</span>;
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
