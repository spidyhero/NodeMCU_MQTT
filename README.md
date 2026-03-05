# THAREEA AI MVP

Artist-owned AI image model platform (Thailand-first ethical AI) built with:

- Next.js App Router + TypeScript
- TailwindCSS + shadcn-style UI components
- Prisma + SQLite
- Zod + React Hook Form
- Server Actions for all mutations

## Features delivered

- Public landing page, marketplace, artist storefront, artwork details
- Credentials auth (session-cookie based, role-aware)
- Artist dashboard:
  - artwork upload/management
  - model status placeholder controls
  - dataset ownership proof placeholder (hash + watermark/fingerprint keys)
  - earnings/revenue split ledger
- Buyer dashboard:
  - credit wallet + top-up simulation
  - generation flow (`/generate/[artistSlug]`) with mock result image
  - automatic transaction + revenue split + license receipt records
- Revenue split logic: 1 credit cost (100 int units), 70% artist / 30% platform

## Quick start

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

App starts at: `http://localhost:3000`

## Prisma & DB scripts

```bash
npm run db:generate
npm run db:push
npm run db:migrate
npm run db:seed
```

## Test accounts (seeded)

Password for all accounts: `password123`

- Artist 1: `nicha@thareea.ai`
- Artist 2: `arun@thareea.ai`
- Buyer: `buyer@thareea.ai`

## Main routes

- `/` Landing
- `/marketplace`
- `/artist/[slug]`
- `/artwork/[id]`
- `/login`, `/register`
- `/dashboard/artist`
- `/dashboard/artist/artworks`
- `/dashboard/artist/model`
- `/dashboard/artist/earnings`
- `/dashboard/buyer`
- `/dashboard/buyer/credits`
- `/generate/[artistSlug]`

## Notes

- Generation is mocked by selecting a random image from `/public/mock-results`.
- Ownership/watermark/fingerprinting are implemented as metadata placeholders for MVP architecture.
