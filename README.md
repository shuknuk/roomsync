# Roomora

A roommate-matching app built for Rutgers students. Set your lifestyle preferences, swipe through potential roommates, match, and chat — all gated behind Rutgers email verification.

**Live app:** [roomsync-sigma.vercel.app](https://roomsync-sigma.vercel.app)

## How it works

1. **Sign in** with a `@scarletmail.rutgers.edu` email via a one-time passcode (Supabase Auth OTP).
2. **Build a profile** covering sleep schedule, cleanliness, study habits, guest frequency, noise tolerance, budget range, housing type, and campus (College Ave, Busch, Livingston, Cook/Douglass).
3. **Swipe** through other students' profiles.
4. Each profile is scored against yours with a weighted compatibility algorithm (sleep, cleanliness, study habits, guests, noise, budget overlap, housing, and campus each contribute points toward a 0–100 compatibility score with human-readable reasons).
5. **Match and message** — mutual likes unlock a chat.

## Tech stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router) + React + TypeScript
- **Styling:** Tailwind CSS
- **Backend/Auth/DB:** [Supabase](https://supabase.com/) (Postgres, Auth OTP, Row Level Security)
- **Icons:** lucide-react
- **Deployment:** Vercel

## Project structure

```
app/
  api/
    auth/otp/      # Rutgers-email OTP sign-in endpoint
    messages/      # Chat message API
    profile/       # Profile CRUD
    swipes/        # Swipe/match API
  auth/callback/    # Supabase auth callback handler
  page.tsx          # Entry point
components/
  RoomSyncApp.tsx   # Main application component
  landing/          # Landing page components
lib/
  matching.ts       # Compatibility scoring algorithm
  types.ts          # Shared TypeScript types
  storage.ts         # Local state persistence helpers
  supabase/          # Supabase client config + Rutgers email validation
supabase_schema.sql  # Database schema (profiles, swipes, matches, messages, RLS policies)
seed_db.js           # Script to seed demo data
```

## Getting started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/shuknuk/roomsync.git
   cd roomsync
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment example and fill in your Supabase project credentials:
   ```bash
   cp .env.example .env.local
   ```
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   ```

4. Set up the database by running `supabase_schema.sql` against your Supabase project (via the SQL editor or CLI). This creates the `profiles`, `swipes`, `matches`, and `messages` tables along with RLS policies and a matching trigger.

5. (Optional) Seed demo profiles:
   ```bash
   node seed_db.js
   ```

6. Run the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase |

## Notes

- Sign-in is restricted to `@scarletmail.rutgers.edu` addresses, so this is currently scoped to Rutgers students only.
- The `figma-design/` folder holds the original design files used to build the UI.
