# VungTauTravel

Production-grade travel website for Vũng Tàu. Next.js 15 (App Router), TypeScript, Tailwind, Base UI, Framer Motion, Lenis. Ready for Vercel and Amazon ALB.

## Tech stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS + Base UI
- **Animation:** Framer Motion
- **Smooth scroll:** Lenis
- **Build:** Turbopack (dev)
- **Deployment:** Vercel

## Installation

```bash
git clone git@github.com:Luanhai3/VungTauTravel.git
cd VungTauTravel
npm install
```

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_APP_URL` — Full app URL (no hardcoded domain; set per environment for ALB/CloudFront/Vercel).
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (Dashboard → Settings → API).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key.

When Supabase env vars are set, places are read/written from the `places` table. Otherwise the app uses built-in fallback data.

## Run locally

```bash
npm run dev
```

App: [http://localhost:3000](http://localhost:3000). Uses Turbopack.

## Build & start (production)

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push to GitHub: `git@github.com:Luanhai3/VungTauTravel.git`
2. In Vercel: **New Project** → Import repo **VungTauTravel**
3. Framework: **Next.js** (auto-detected). Root: `./`
4. Add Environment Variables:
   - `NEXT_PUBLIC_APP_URL`: Your Vercel domain (e.g., `https://vungtautravel.vercel.app`)
   - `NEXT_PUBLIC_SUPABASE_URL`: From your Supabase project settings.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: From your Supabase project settings.
5. Deploy.

CLI:

```bash
npm i -g vercel
vercel
```

Set `NEXT_PUBLIC_APP_URL` in Vercel project env to your production URL.

## Project structure

```
/app
  layout.tsx       # Root layout, metadata, fonts
  page.tsx         # Landing
  places/page.tsx
  food/page.tsx
  checkin/page.tsx
  admin/page.tsx   # CRUD places (local state; ready for API)
  not-found.tsx
/components
  Navbar.tsx
  Footer.tsx
  Hero.tsx
  Section.tsx
  PlaceCard.tsx
  LenisProvider.tsx
/lib
  data.ts          # Places JSON (ready for CMS/Supabase)
/hooks
  useLenis.ts
/styles
  globals.css
```

## Database (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Run the migration: Supabase Dashboard → SQL Editor → paste and run `supabase/migrations/20250201000000_create_places.sql`.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.

Public read/write on `places` is enabled by RLS policies in the migration. For production, restrict insert/update/delete with auth.

## Performance & SEO

- Next.js Metadata API + Open Graph on all pages. Add `/public/og-default.png` (1200×630) for default OG image.
- `next/image` with `sizes`; hero images use `fetchpriority="high"`
- `next/font` (Geist) for fonts
- Suspense where needed
- Semantic HTML; Lighthouse target 95+

## Infra

- No hardcoded domain; use `NEXT_PUBLIC_APP_URL` so the app works behind Amazon ALB, CloudFront, or Vercel.
