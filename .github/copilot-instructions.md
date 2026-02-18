# GYM PRO — Copilot Instructions

## Project Overview

**GYM PRO** is a full-stack gym management web application with role-based dashboards for Admin, Trainer, and Member. It uses a **monorepo structure**: React frontend (`/client`) with Supabase backend and a legacy Express server (`/server`).

- **Tech Stack**: React 19, Vite, Tailwind CSS v4, Three.js, GSAP, Supabase Auth + PostgreSQL
- **Design**: Dark theme (`#0b0b0f`) with neon green accents (`#39FF14`), glassmorphic cards, fluid animations
- **Architecture**: Context-based auth, role-gated routes, Supabase-first API layer

---

## Critical Architecture Decisions

### Authentication & Authorization
- **Supabase Auth** (not Express—legacy): Email/password signup + JWT sessions
- **AuthContext** (`src/context/AuthContext.jsx`): Manages auth state globally via React Context
- **Role-based access**: User roles (`admin`, `trainer`, `member`) stored in `user_metadata` and `profiles` table
- **ProtectedRoute wrapper** enforces role gating—pass `roles` prop to restrict dashboard access

### Frontend Structure
- **Routing**: React Router v7 with nested routes under role-specific layouts
- **API calls**: ALL Supabase queries centralized in `src/services/api.js`—never call Supabase directly in components
- **Styling**: Tailwind CSS v4 with theme variables in `src/index.css` (@theme block)
- **3D & Animations**: Three.js particles on login, GSAP for component entrance animations

### Data Flow
1. Components call API functions from `src/services/api.js`
2. API functions hit Supabase directly (`from()`, `auth`, etc.)
3. Results flow back to component state—prefer `useState` + effects over Redux
4. Auth context provides user object + `login()`, `logout()` functions

---

## Key Patterns & Conventions

### Styling
- **Glass effect**: Use `.glass` class (blur, frosted border) for modal/card backgrounds
- **Colors**: Reference theme vars from `@theme` block (e.g., `--color-neon`, `--color-dark-card`)
- **Font families**: `Outfit` (headings), `Inter` (body text)—imported in `index.html`
- **Padding/spacing**: Use Tailwind scale (e.g., `p-7 gap-6`) not pixel values

### Components
- **Stateless when possible**: Components with `useAuth()` fetch user, but props should control rendering
- **GSAP animations**: Wrap in `useEffect` with motion reduction check: `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- **Modal patterns**: `WorkoutModal.jsx` is the shared exercise detail modal—reuse, don't duplicate

### API Calls
- **Error handling**: Throw errors from API functions; let components catch and show user-friendly messages
- **Async patterns**: Use `Promise.all()` for parallel queries (see `getAnalyticsAPI`)
- **Fallback handling**: Some tables may not exist; wrap Supabase queries in try/catch with graceful `return { data: [] }`

### Three.js Integration
- **ParticleBackground.jsx**: Decorative particles (green neon animated mesh) on login/auth pages
- **DumbbellModel.jsx**: 3D dumbbell model with GSAP animations on load
- **Canvas placement**: Wrap `<Canvas>` components in fixed position containers; set `gl.orthographic` for UI overlays

---

## File Guide by Use Case

| Need | File(s) |
|------|---------|
| **Add auth endpoint** | `src/services/api.js` (add function) + `src/context/AuthContext.jsx` (integrate) |
| **New dashboard page** | Create in `src/pages/{role}/NewPage.jsx`, add route in `App.jsx` |
| **Shared component** | Place in `src/components/`, use across all dashboards |
| **Role-specific modal** | Check if `WorkoutModal.jsx` suffices; else extend it or create sibling |
| **Animations** | Import `gsap` in component, use in `useEffect` with motion-reduction check |
| **Exercise/data constants** | `src/data/exerciseData.js` and `src/data/fitnessData.js` |
| **Admin analytics** | `src/pages/admin/AdminDashboard.jsx` calls `getAnalyticsAPI()` |

---

## Development Workflow

### Running the App
```bash
cd client && npm run dev         # Vite dev server on port 5173
cd server && npm start           # Express (optional, for legacy features)
```

### Building
```bash
cd client && npm run build       # Output: dist/
```

### Environment Setup
- **`.env` in `/client`** (not in git):
  ```
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```
- Supabase client initialized in `src/lib/supabase.js`

---

## Common Tasks

### Add a New User Role
1. Create page in `src/pages/{role}/`
2. Add route in `App.jsx` with `<ProtectedRoute roles={['newrole']}>`
3. Add navigation link in `src/components/Sidebar.jsx`
4. Update `AuthContext` to handle new role in profile fetch

### Create a New Table Query
1. Write function in `src/services/api.js` following the `getXyzAPI()` pattern
2. Call in component with `useEffect(() => { getXyzAPI().then(setData) }, [])`
3. Handle errors with `setError()` and display user feedback

### Add GSAP Animation
```jsx
useEffect(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.fromTo(ref.current.children,
    { y: 24, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.07, ease: 'power3.out' }
  );
}, []);
```

---

## Important Gotchas

- **Supabase queries are live**: Use `.on('*', callback)` for real-time updates (not implemented everywhere—add as needed)
- **user_metadata fallback**: Profile data lives in both `user_metadata` AND `profiles` table; `AuthContext` checks both
- **CSS classes**: Some inline styles preferred over Tailwind for dynamic values (e.g., `style={{ color: user.favoriteColor }}`)
- **Mobile-first**: Sidebar collapses on mobile; use responsive Tailwind utilities
- **No testing framework**: Manual QA only (consider adding Jest + Vitest if tests become critical)

---

## Questions for Clarification?

- **Analytics performance**: Should we add indexes on `profiles.role`, `payments.created_at`?
- **Real-time sync**: Want live member/trainer updates in admin dashboard?
- **Offline support**: Service workers or just assume online?
- **Error boundaries**: Should we add React error boundary wrappers around dashboard sections?
