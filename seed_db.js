// Database seeding script for Roomora
// Usage: node seed_db.js

import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envPath = ".env.local";
if (!fs.existsSync(envPath)) {
  console.error("❌ .env.local file not found. Create it with your Supabase credentials first.");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join("=").trim();
    env[key] = val;
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("❌ Missing Supabase URL or Publishable Key in .env.local.");
  process.exit(1);
}

console.log("Connecting to Supabase at:", url);
const supabase = createClient(url, key);

// Seed profile records with placeholder UUIDs
const seedProfiles = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Aisha Khan",
    age: 18,
    university: "Rutgers University",
    pronouns: "she/her",
    country: "Pakistan",
    major: "Computer Science",
    year: "Freshman",
    avatar: "AK",
    bio: "I am arriving for ISO and hoping to find a roommate who wants a balanced social and study routine.",
    interests: ["tea", "coding", "Bollywood", "late-night walks"],
    sleep: "balanced",
    cleanliness: "very-clean",
    study: "library",
    guests: "sometimes",
    noise: "medium",
    budget_min: 850,
    budget_max: 1250,
    housing: "either",
    campus: "college-ave",
    temperature_preference: "Flexible",
    willing_to_share: true,
    cleanliness_score: 65,
    noise_tolerance_score: 55,
    guests_frequency_score: 45,
    looking_for: "A calm room, shared grocery runs, and someone who respects study hours.",
    is_complete: true
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Mateo Rivera",
    age: 18,
    university: "Rutgers University",
    pronouns: "he/him",
    country: "Colombia",
    major: "Business Analytics",
    year: "Transfer",
    avatar: "MR",
    bio: "Transfer student trying to settle in before classes start. I like clean shared spaces and weekend soccer.",
    interests: ["soccer", "finance", "salsa", "meal prep"],
    sleep: "early",
    cleanliness: "very-clean",
    study: "quiet-room",
    guests: "rarely",
    noise: "low",
    budget_min: 900,
    budget_max: 1300,
    housing: "apartment",
    campus: "livingston",
    temperature_preference: "Flexible",
    willing_to_share: true,
    cleanliness_score: 65,
    noise_tolerance_score: 55,
    guests_frequency_score: 45,
    looking_for: "A roommate who is friendly but keeps weekdays focused.",
    is_complete: true
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Mei Chen",
    age: 18,
    university: "Rutgers University",
    pronouns: "she/her",
    country: "China",
    major: "Biomedical Engineering",
    year: "Freshman",
    avatar: "MC",
    bio: "I study a lot, cook often, and want a roommate who communicates directly.",
    interests: ["sketching", "lab research", "ramen", "volleyball"],
    sleep: "early",
    cleanliness: "moderate",
    study: "library",
    guests: "rarely",
    noise: "low",
    budget_min: 750,
    budget_max: 1100,
    housing: "dorm",
    campus: "busch",
    temperature_preference: "Flexible",
    willing_to_share: true,
    cleanliness_score: 65,
    noise_tolerance_score: 55,
    guests_frequency_score: 45,
    looking_for: "A considerate roommate who keeps mornings quiet and plans chores clearly.",
    is_complete: true
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "Nora Hassan",
    age: 18,
    university: "Rutgers University",
    pronouns: "she/her",
    country: "Egypt",
    major: "Public Health",
    year: "Freshman",
    avatar: "NH",
    bio: "I am excited for Rutgers and want a roommate who is open to events, food spots, and honest check-ins.",
    interests: ["public health", "concerts", "photography", "coffee shops"],
    sleep: "late",
    cleanliness: "moderate",
    study: "social-study",
    guests: "often",
    noise: "high",
    budget_min: 700,
    budget_max: 1150,
    housing: "either",
    campus: "college-ave",
    temperature_preference: "Flexible",
    willing_to_share: true,
    cleanliness_score: 65,
    noise_tolerance_score: 55,
    guests_frequency_score: 45,
    looking_for: "A social but respectful roommate who likes exploring campus together.",
    is_complete: true
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    name: "Samir Patel",
    age: 18,
    university: "Rutgers University",
    pronouns: "he/him",
    country: "India",
    major: "Data Science",
    year: "Graduate",
    avatar: "SP",
    bio: "New to New Brunswick, focused on school, and happy to split responsibilities clearly.",
    interests: ["data", "cricket", "vegetarian cooking", "board games"],
    sleep: "balanced",
    cleanliness: "very-clean",
    study: "quiet-room",
    guests: "sometimes",
    noise: "medium",
    budget_min: 950,
    budget_max: 1400,
    housing: "apartment",
    campus: "any",
    temperature_preference: "Flexible",
    willing_to_share: true,
    cleanliness_score: 65,
    noise_tolerance_score: 55,
    guests_frequency_score: 45,
    looking_for: "A dependable roommate who values quiet evenings and shared expectations.",
    is_complete: true
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    name: "Lina Okafor",
    age: 18,
    university: "Rutgers University",
    pronouns: "she/her",
    country: "Nigeria",
    major: "Nursing",
    year: "Freshman",
    avatar: "LO",
    bio: "I am coming for ISO, planning ahead, and hoping for a roommate who is easy to talk to.",
    interests: ["nursing", "gospel choir", "running", "podcasts"],
    sleep: "early",
    cleanliness: "moderate",
    study: "library",
    guests: "sometimes",
    noise: "medium",
    budget_min: 800,
    budget_max: 1200,
    housing: "dorm",
    campus: "cook-douglass",
    temperature_preference: "Flexible",
    willing_to_share: true,
    cleanliness_score: 65,
    noise_tolerance_score: 55,
    guests_frequency_score: 45,
    looking_for: "A roommate with a predictable routine and a friendly shared space.",
    is_complete: true
  }
];

async function seed() {
  console.log("Starting database seeding...");
  
  for (const profile of seedProfiles) {
    const { error } = await supabase.from("profiles").upsert(profile);
    if (error) {
      console.error(`❌ Error seeding ${profile.name}:`, error.message);
    } else {
      console.log(`✅ Upserted profile: ${profile.name}`);
    }
  }
  
  console.log("Database seeding completed.");
}

seed();
