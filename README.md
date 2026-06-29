# Manohar Naidu Bugatha — Personal Portfolio

An elegant, Apple-inspired personal portfolio website built with React, Vite, Framer Motion, and TypeScript, structured as a clean **pnpm monorepo workspace**.

🔗 **Live Deployment:** [manohars-portfolio-5fgwndkuc-manoha-rs-projects.vercel.app](https://manohars-portfolio-5fgwndkuc-manoha-rs-projects.vercel.app/)

---

## ✨ Features

- **Apple-Inspired Design:** Clean typography, minimalist sleek layouts, elegant light/dark tones, and a signature electric blue (`#0071E3`) accent.
- **Interactive 3D Background:** Immersive background canvas experience via `Background3D` for a modern, fluid visual feel.
- **Smooth Typography & Page Transitions:** Scroll-triggered text revealing via `TextReveal` and page section animations using Framer Motion.
- **Single Page Architecture:** Responsive single-page layout featuring:
  - **Hero:** Eye-catching greeting and interactive elements.
  - **About:** Introduction and professional philosophy.
  - **Skills:** Categorized skills grid showing technologies and tools.
  - **Projects:** Showcase of detailed projects (like *NextStep* & *Airbnb Clone*).
  - **Experience & Education:** Chronological timelines highlighting career growth and academic credentials.
  - **Contact:** Secure contact form connecting to the backend.
- **Monorepo Monolith:** Fully integrated codebase combining backend services, shared libraries, and the frontend web app.

---

## 🛠️ Technology Stack

- **Monorepo Orchestration:** `pnpm workspaces`
- **Frontend Framework:** React 19 (using Vite & TypeScript)
- **Styling:** CSS & TailwindCSS (Apple aesthetics, fluid hover effects, premium transitions)
- **Animations:** Framer Motion (Scroll animations, micro-interactions)
- **Smooth Scroll:** Lenis smooth scrolling
- **Backend API Server:** Express 5 & Node.js
- **Database Layer:** PostgreSQL + Drizzle ORM (configured in workspace, scalable schema)
- **Validation:** Zod
- **API Spec & Codegen:** OpenAPI Spec compiled via Orval directly into React Query hooks

---

## 📁 Repository Structure (Workspace)

The codebase is organized as a workspace:

```text
├── artifacts/
│   ├── portfolio/       # React SPA frontend (Vite, Tailwind, Framer Motion)
│   ├── api-server/      # Express API server (Contact form mailer, health checks)
│   └── mockup-sandbox/  # Layout sandbox and styling previews
├── lib/
│   ├── api-client-react/# Auto-generated React Query API client hooks
│   ├── api-spec/        # OpenAPI documentation specs
│   ├── api-zod/         # Auto-generated Zod schemas for request validation
│   └── db/              # Drizzle ORM schemas and database client config
├── scripts/             # Utility and helper scripts
├── package.json         # Workspace root definitions and dev/build scripts
└── pnpm-workspace.yaml  # Workspace pnpm configurations
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** v22 or higher
- **Package Manager:** `pnpm` (if you don't have pnpm installed globally, you can use `npx pnpm`)

### 2. Installation
Install workspace-wide dependencies:
```bash
npx pnpm install
# or
pnpm install
```

### 3. Run Locally (Development)
Start the frontend portfolio server and the backend API server concurrently:
```bash
npx pnpm run dev
# or
pnpm run dev
```

The frontend will be served at `http://localhost:5173` and the backend api-server at `http://localhost:5000`.

### 4. Build for Production
To bundle and verify types across the entire monorepo:
```bash
npx pnpm run build
# or
pnpm run build
```
