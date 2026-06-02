# Noryx Studio — Premium Barbershop Website

Full-stack barbershop website with public booking flow and private admin dashboard.

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS 3** with custom design system
- **Supabase** (PostgreSQL + Auth + Row Level Security)
- **Resend** (email notifications)
- **Twilio** (SMS notifications)
- **React Hook Form** + **Zod** (forms + validation)
- **react-day-picker v8** (booking calendar)

---

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url> noryx-studio
cd noryx-studio
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Required — from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# For email notifications (https://resend.com)
RESEND_API_KEY=re_xxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# For SMS notifications (https://twilio.com)
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=xxxx
TWILIO_FROM_NUMBER=+1234567890
```

### 3. Set up the database

1. Go to your [Supabase project](https://supabase.com) → SQL Editor
2. Paste and run the contents of `supabase/migrations/001_initial_schema.sql`

This creates all tables, indexes, RLS policies, and seeds default services + settings.

### 4. Create an admin user

In Supabase → Authentication → Users → Add user:
- Email: your admin email
- Password: your admin password

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
noryx-studio/
├── app/
│   ├── page.tsx                        # Public homepage
│   ├── book/
│   │   ├── page.tsx                    # 4-step booking flow
│   │   └── actions.ts                  # createAppointment server action
│   └── admin/
│       ├── login/page.tsx              # Admin login
│       └── (protected)/
│           ├── layout.tsx              # Sidebar layout (auth-gated)
│           ├── page.tsx                # Dashboard overview
│           ├── appointments/           # Appointments management
│           ├── services/               # Services CRUD
│           ├── reviews/                # Reviews moderation
│           └── settings/               # Site settings
├── components/
│   ├── public/                         # Homepage sections
│   ├── booking/                        # Booking flow components
│   ├── dashboard/                      # Admin components
│   └── ui/                             # Reusable primitives
├── lib/
│   ├── supabase.ts                     # Browser + server Supabase clients
│   ├── notifications.ts                # Email (Resend) + SMS (Twilio)
│   ├── validations.ts                  # Zod schemas
│   └── utils.ts                        # cn(), formatCurrency(), etc.
├── types/index.ts                      # All TypeScript types
├── middleware.ts                       # Auth protection for /admin/*
└── supabase/migrations/
    └── 001_initial_schema.sql          # Full schema + seed data
```

---

## Notification System

When a client books an appointment, the **barber** receives a notification.
When the barber **confirms** an appointment, the **client** receives a notification.

**Notification channels:**
- Email via **Resend** — if `RESEND_API_KEY` is set
- SMS via **Twilio** — if `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM_NUMBER` are set

**Configure barber contact** in the Admin Dashboard → Settings → Notifications:
- Barber notification email (receives new booking emails)
- Barber notification phone (receives new booking SMS)

Clients are notified via:
- Email — if they provided one during booking
- SMS — always (phone number is required)

---

## Admin Dashboard

Visit `/admin/login` → sign in with your Supabase auth user.

| Page | Path |
|------|------|
| Overview | `/admin` |
| Appointments | `/admin/appointments` |
| Services | `/admin/services` |
| Reviews | `/admin/reviews` |
| Settings | `/admin/settings` |

---

## Database Tables

| Table | Description |
|-------|-------------|
| `services` | Barbershop services with price, duration, visibility |
| `appointments` | Booked appointments with status tracking |
| `reviews` | Client reviews with approval workflow |
| `settings` | Key-value site configuration (JSON) |

---

## Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Production build
npm run start       # Run production build
npm run type-check  # TypeScript type checking
npm run lint        # ESLint
```

---

## Contact

- WhatsApp: [09162035059](https://wa.me/2349162035059)
- Email: sain.tcuts3@gmail.com
