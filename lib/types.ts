export type SleepSchedule = "early" | "balanced" | "late";
export type Cleanliness = "relaxed" | "moderate" | "very-clean";
export type StudyHabit = "quiet-room" | "library" | "social-study";
export type GuestFrequency = "rarely" | "sometimes" | "often";
export type NoiseTolerance = "low" | "medium" | "high";
export type HousingType = "dorm" | "apartment" | "either";
export type Campus = "college-ave" | "busch" | "livingston" | "cook-douglass" | "any";

export type Lifestyle = {
  sleep: SleepSchedule;
  cleanliness: Cleanliness;
  study: StudyHabit;
  guests: GuestFrequency;
  noise: NoiseTolerance;
  budgetMin: number;
  budgetMax: number;
  housing: HousingType;
  campus: Campus;
};

export type UserProfile = Lifestyle & {
  name: string;
  pronouns: string;
  country: string;
  major: string;
  bio: string;
  interests: string[];
};

export type RoommateProfile = UserProfile & {
  id: string;
  year: string;
  avatar: string;
  likedYou: boolean;
  lookingFor: string;
};

export type SwipeDecision = "like" | "pass";

export type SwipeRecord = {
  profileId: string;
  decision: SwipeDecision;
  swipedAt: string;
};

export type Message = {
  id: string;
  profileId: string;
  sender: "me" | "them";
  text: string;
  sentAt: string;
};

export type AppState = {
  onboarded: boolean;
  user: UserProfile;
  swipes: SwipeRecord[];
  matches: string[];
  messages: Message[];
  swipeWindowStartedAt: string;
};

export type CompatibilityResult = {
  score: number;
  reasons: string[];
};
