# NexusFleet ERP SaaS v1.0.0

![NexusFleet Banner](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000)

**NexusFleet** is an enterprise-grade Fleet Management & ERP platform designed for modern logistics businesses. Built with a focus on premium aesthetics, multi-tenant security, and intelligent automation.

## 🚀 Key Features

- **Multi-Tenant Architecture**: Robust organization-level data isolation with role-based access control (RBAC).
- **Fleet Management**: Track vehicles, fuel efficiency, and predictive maintenance schedules.
- **Financial Engine**: Advanced invoicing with GST support, recurring expense tracking, and profit/loss analytics.
- **AI Insights**: Intelligent trend detection, revenue forecasting, and anomaly alerts.
- **SaaS Commercialization**: Integrated Stripe billing with tiered subscription plans (Starter, Business, Enterprise).
- **Document Management**: Secure file uploads via UploadThing for receipts, insurance, and regulatory documents.
- **Enterprise Security**: Audit logging, session tracking, and production-hardened middleware.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **UI/UX**: Tailwind CSS, Shadcn UI, Framer Motion, Recharts
- **Auth**: NextAuth.js
- **Billing**: Stripe Checkout & Customer Portal
- **Storage**: UploadThing
- **Monitoring**: Sentry & Winston Logging
- **DevOps**: Docker, GitHub Actions

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/vailism/nexusfleet.git

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Initialize database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

## ⚙️ Environment Variables

Required variables for full functionality:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

NEXT_PUBLIC_SENTRY_DSN=
```

## 🐳 Docker Deployment

NexusFleet is optimized for containerized environments:

```bash
docker-compose up --build
```

## 🛣 Roadmap

- [ ] Mobile App (React Native)
- [ ] AI Route Optimization
- [ ] Multi-currency support
- [ ] WhatsApp/SMS notification integration

## 📄 License

MIT License - Copyright (c) 2026 NexusFleet.
