# Hindu Graveyard Donation Tracking Website

Bilingual (English + Telugu) donation registry for a Hindu graveyard construction project.

## Tech Stack

- Next.js 14 (App Router)
- Neon PostgreSQL + Prisma
- NextAuth.js (admin credentials)
- Tailwind CSS
- TypeScript

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

**Important:** Prisma CLI reads `.env`, not `.env.local`. After setting `DATABASE_URL` in `.env.local`, also create a `.env` file with the same `DATABASE_URL`:

```bash
echo 'DATABASE_URL=your-neon-connection-string-here' > .env
```

Or copy the line from `.env.local` into `.env`.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for session encryption |
| `NEXTAUTH_URL` | `http://localhost:3000` (or your production URL) |
| `ADMIN_USERNAME` | Admin login username (default: `admin`) |
| `ADMIN_PASSWORD` | Admin login password |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `GOOGLE_CLOUD_PROJECT_ID` | Google Cloud project ID for Telugu transliteration |
| `GOOGLE_CLOUD_SERVICE_ACCOUNT_JSON` | Service account JSON (single line) with Cloud Translation access |

### 3. Google Cloud transliteration (Telugu names)

Admin English names are auto-converted to Telugu script via the **Google Cloud Translation API** (`en` → `te`). Free tier covers ~500K characters/month — enough for 1000+ donor names.

1. Create a project at [console.cloud.google.com](https://console.cloud.google.com)
2. Enable **Cloud Translation API**
3. Create a service account with **Cloud Translation API User** role
4. Download the JSON key and minify it to a single line
5. Add to `.env.local` and `.env`:
   - `GOOGLE_CLOUD_PROJECT_ID` — your project ID
   - `GOOGLE_CLOUD_SERVICE_ACCOUNT_JSON` — full JSON key as one line

Local alternative: set `GOOGLE_APPLICATION_CREDENTIALS` to the key file path instead of the JSON env var.

Verify the credentials work:

```bash
npx tsx scripts/test-transliterate.ts
```

After changing the engine, re-run transliteration for existing rows:

```bash
npx tsx scripts/backfill-telugu-names.ts
```

### 4. Create Neon database

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project and database
3. Copy the connection string into `DATABASE_URL` in `.env.local`

### 5. Cloudinary (progress photo gallery)

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Copy Cloud Name, API Key, and API Secret from the dashboard
3. Add them to `.env.local` and `.env` (for local uploads)

### 6. Run database migration

```bash
npx prisma migrate dev --name init
npx prisma migrate dev --name add_progress_images
```

### 7. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public donation page.

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

Default credentials (change in production):

- Username: `admin`
- Password: `changeme123`

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Set `NEXTAUTH_URL` to your production domain (e.g. `https://your-app.vercel.app`)
5. Deploy — `prisma generate` runs automatically via the `postinstall` script
6. Run migrations against production:

```bash
npx prisma migrate deploy
```

## Project Structure

```
app/
  page.tsx                 Public donation registry
  admin/page.tsx           Admin login
  admin/dashboard/page.tsx Protected admin dashboard
  api/donations/route.ts   GET all donations
  api/admin/add/route.ts   POST add donation (auth required)
  api/admin/delete/route.ts DELETE donation (auth required)
components/                UI components
lib/                       Prisma, auth, translations
prisma/schema.prisma       Database schema
```

## Features

- Bilingual UI (English / Telugu) with language toggle
- Total amount raised display
- Latest 5 and top 5 donations
- Searchable, paginated full donation list
- Admin dashboard to add and delete donations
