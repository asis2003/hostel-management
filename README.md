# 🏠 Hostel Management (Neon Postgres + Vercel)

**Vite + React + Redux frontend** · **Express + Prisma backend** · **Neon free Postgres**

Originally MongoDB/Mongoose. Now fully migrated to **Neon (PostgreSQL)** and ready for free deployment on **Vercel**.

---

## Features

- Register / Login (JWT)
- Student CRUD + search + pagination
- Daily attendance by room
- Attendance analysis
- CSV export
- Delete old attendance records
- Admin user management

---

## Local Development

### 1. Prerequisites
- Node.js ≥ 20
- A free Neon account → https://neon.tech

### 2. Create a Neon database
1. Go to [neon.tech](https://neon.tech) → Sign up (GitHub works)
2. Create a project
3. Copy the **connection string** (it looks like `postgresql://...@ep-....neon.tech/neondb?sslmode=require`)

### 3. Setup the project

```bash
# Install root dependencies
npm install

# Install frontend dependencies
npm install --prefix frontend

# Create .env from example
cp .env.example .env
# Edit .env and paste your DATABASE_URL + a strong JWT_SECRET
```

### 4. Push the database schema

```bash
npx prisma db push
# or: npm run db:push
```

### 5. Run

```bash
npm run dev
```

- Frontend: http://localhost:3000  
- API: http://localhost:5000  

First user you register becomes a normal user. To make an admin, either:

- Use Prisma Studio (`npx prisma studio`) and set `isAdmin = true`, or  
- After register, update via the Admin Users screen once you have one admin.

---

## Free Deployment on Vercel + Neon

### Step A – Neon (database)
1. Create project on [neon.tech](https://neon.tech) (free tier is enough).
2. Copy the **pooled** or direct connection string.
3. (Optional but recommended) Enable connection pooling if you see many connections.

### Step B – Push code to GitHub
```bash
git init
git add .
git commit -m "Hostel management - Neon + Vercel ready"
# Create a new empty repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/hostel-management.git
git branch -M main
git push -u origin main
```

### Step C – Deploy on Vercel (free)
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub.
2. **Add New Project** → Import your `hostel-management` repo.
3. Framework Preset: **Other** (or leave auto-detect).
4. **Environment Variables** (very important):

| Name           | Value                                      |
|----------------|--------------------------------------------|
| `DATABASE_URL` | your Neon connection string                |
| `JWT_SECRET`   | a long random string (same as local)       |
| `NODE_ENV`     | `production`                               |

5. Click **Deploy**.

Vercel will:
- Run `prisma generate` (via postinstall / vercel-build)
- Build the Vite frontend
- Route `/users/*`, `/student/*`, `/attendance/*` to the serverless Express API
- Serve the React app for everything else

### Step D – After first deploy
Open the Vercel URL → Register the first account.

To promote yourself to admin:
```bash
# Locally (with DATABASE_URL pointing to the same Neon DB)
npx prisma studio
```
Find your user and set `isAdmin` to `true`.

---

## Project Structure

```
├── api/index.js          # Vercel serverless entry (wraps Express)
├── prisma/schema.prisma  # Neon Postgres models
├── server/
│   ├── controllers/      # Prisma-based controllers
│   ├── lib/prisma.js     # Prisma client singleton
│   ├── middleware/
│   ├── routes/
│   └── index.js          # Express app
├── frontend/             # Vite + React + Redux
├── vercel.json           # Routing + builds
└── .env.example
```

---

## Notes / Gotchas

- **IDs**: Backend still returns `_id` (mapped from Prisma `id`) so the existing frontend keeps working.
- **Attendance** `data` / `details` are stored as JSON.
- Contact numbers are stored as **String** (safer for phone numbers).
- Free Vercel serverless has cold starts and execution time limits. For heavy usage later you can move the API to Railway / Render free tier and keep only the frontend on Vercel.
- Neon free tier has a compute-time limit and hibernates after inactivity (first request after sleep is slower).

---

## Useful commands

```bash
npm run dev              # local full stack
npx prisma db push       # sync schema to Neon
npx prisma studio        # visual DB editor
npx prisma generate      # regenerate client after schema change
npm run build            # build frontend only
```

---

Happy hosting! 🚀
