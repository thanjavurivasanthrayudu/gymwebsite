# 💪 GYM PRO — Full-Stack Gym Management Application

A modern, production-ready gym management web application built with **React**, **Supabase**, **Three.js**, and **GSAP** animations. Features role-based dashboards for Admin, Trainer, and Member with a sleek dark neon-green theme.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS |
| **Backend** | Supabase (Auth + PostgreSQL) |
| **3D Graphics** | Three.js, React Three Fiber |
| **Animations** | GSAP |
| **Charts** | Chart.js + react-chartjs-2 |
| **PDF Export** | jsPDF + html2canvas |
| **Icons** | React Icons (Feather + Game Icons) |

---

## ✨ Features

### 🔐 Authentication
- Supabase Auth with email/password
- Role-based access control (Admin, Trainer, Member)
- Protected routes with role gating
- Password reset via email

### 👑 Admin Dashboard
- **Analytics** — Total members, trainers, revenue, workouts with Chart.js graphs
- **Manage Trainers** — Full CRUD with specialization tracking
- **Manage Members** — CRUD, assign trainers, set membership plans
- **Manage Payments** — Record payments, generate PDF receipts
- **Manage Workouts** — CRUD with muscle group filters, GIF previews

### 🏋️ Trainer Dashboard
- View assigned members
- **Assign Workout Plans** — Day-based scheduling with exercise selection
- **Assign Diet Plans** — Meal-wise planning with calorie/protein tracking
- **Track Progress** — Add notes and feedback per member

### 🧑 Member Dashboard
- Welcome banner with membership countdown timer
- **BMI Calculator** — Real-time BMI calculation with category display
- **Workout Plan** — View assigned exercises organized by day
- **Diet Plan** — View meals with nutritional info
- **Workout Library** — Browse all exercises with filters and modal details
- **Payment History** — View past payments, download PDF receipts
- **Profile** — Edit personal info and change password

### 🎨 UI/UX
- Dark gym theme with neon green (`#39FF14`) accents
- Three.js animated 3D dumbbell on login page
- Particle background effects
- GSAP entrance animations throughout
- Fully responsive (mobile + desktop)
- Glassmorphism card design

---

## 📁 Project Structure

```
gymwebsite/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Shared UI components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── WorkoutModal.jsx
│   │   │   ├── BMICalculator.jsx
│   │   │   └── CountdownTimer.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Supabase Auth provider
│   │   ├── lib/
│   │   │   └── supabase.js    # Supabase client init
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   ├── trainer/       # Trainer dashboard pages
│   │   │   └── member/        # Member dashboard pages
│   │   ├── services/
│   │   │   └── api.js         # All Supabase API calls
│   │   ├── threejs/           # Three.js 3D components
│   │   ├── App.jsx            # Main routing
│   │   └── index.css          # Tailwind + custom styles
│   ├── .env                   # Supabase credentials (not in git)
│   └── vite.config.js
├── server/                    # Express backend (optional/legacy)
├── supabase_schema.sql        # Database schema for Supabase
└── README.md
```

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/thanjavurivasanthrayudu/gymwebsite.git
cd gymwebsite
```

### 2. Install dependencies

```bash
cd client
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase_schema.sql`
3. Go to **Auth → Providers → Email** and disable "Confirm email" (for development)

### 4. Configure environment

Create `client/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these values in **Supabase Dashboard → Settings → API**.

### 5. Run the app

```bash
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🗄️ Database Schema

| Table | Description |
|---|---|
| `profiles` | User profiles (extends Supabase auth.users) |
| `workouts` | Exercise library with muscle groups, sets, reps |
| `workout_plans` | Trainer-assigned workout plans (JSONB) |
| `diet_plans` | Trainer-assigned diet plans with meals (JSONB) |
| `payments` | Payment records with receipt IDs |

All tables have **Row Level Security (RLS)** enabled. A trigger auto-creates a profile row on user signup.

---

## 🔑 Default Test Accounts

After registering via the app:

| Role | How to create |
|---|---|
| **Admin** | Register with role "Admin" |
| **Trainer** | Register with role "Trainer" or Admin creates via dashboard |
| **Member** | Register with role "Member" (default) |

---

## 📸 Screenshots

> Login page with Three.js 3D dumbbell and particle background

> Admin dashboard with real-time analytics and Chart.js graphs

> Member dashboard with BMI calculator and workout plans

---

## 🧰 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

---

## 📄 License

MIT License — feel free to use this project for learning or commercial purposes.

---

**Built with ❤️ by Vasanth**
