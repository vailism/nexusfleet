# NexusFleet ERP 🚙📈

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**NexusFleet ERP** is a modern, production-grade SaaS application designed to seamlessly unify accounting, invoicing, and fleet management. Built with an "Apple-level" premium aesthetic, it provides businesses with robust operational tools, dynamic real-time analytics, and secure role-based access.

---

## 🌟 Features

### 🏢 Core Accounting & Invoicing
- **Dynamic Invoice Engine**: Split-screen builder with real-time math, dynamic line items, auto-calculating GST, and instant PDF generation.
- **Customer Directory**: Manage clients with full CRM capabilities, billing details, and outstanding balances.
- **Expense Tracking**: Categorize operational and fleet expenses with responsive datatables and strict validation.

### 🚛 Fleet & Maintenance Management
- **Vehicle Directory**: Centralized management of active, inactive, and maintenance-bound vehicles.
- **Fuel Logs**: Track mileage, fuel efficiency (KMPL/MPG), and automate cost calculations.
- **Service Reminders**: Preventative maintenance tracking with color-coded alerts and upcoming service schedules.

### 📊 Dashboard & Analytics
- **KPI Metrics**: Real-time aggregation of Revenue, Fleet Size, and Active alerts.
- **Recharts Integration**: Beautiful interactive graphs mapping monthly profit/loss and fuel cost efficiency.

### 🔒 Enterprise Security
- **Role-Based Access Control**: Strict Admin/Staff tiers enforced by NextAuth.js.
- **Middleware Protection**: Edge-layer route guarding.
- **Zod Validation**: End-to-end type safety and strictly sanitized payload mutations.

---

## 📸 Screenshots
*(Coming Soon)*
- `Dashboard Overview`
- `Invoice Builder UI`
- `Fleet Analytics`

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Frontend**: React 19, Tailwind CSS, ShadCN UI, Recharts, Lucide Icons
- **Forms & State**: React Hook Form, Zod
- **Backend**: Node.js, Next.js Server Actions
- **Database**: PostgreSQL, Prisma ORM
- **Auth**: NextAuth.js (Credentials Provider + bcrypt)
- **Deployment**: Docker, Docker Compose

---

## 🚀 Installation & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/nexusfleet.git
cd nexusfleet
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nexusfleet"

# Authentication
NEXTAUTH_SECRET="your-super-secret-32-character-string"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🐳 Docker Deployment

NexusFleet is fully containerized for production environments.

```bash
# Build and start the PostgreSQL database and Next.js app in detached mode
docker-compose up -d --build
```
The application will be available at `http://localhost:3000`.

---

## 📂 Architecture Overview

```text
src/
├── actions/       # Type-safe Server Actions (Prisma mutations)
├── app/           # Next.js App Router (Pages, Layouts, API routes)
├── components/    # Reusable UI (Forms, Charts, DataTables, ShadCN)
├── lib/           # Utilities (Calculations, Zod Schemas, Prisma Client)
├── middleware.ts  # Edge authentication routing
prisma/
├── schema.prisma  # Database models and relations
├── seed.ts        # Dummy data generator
```

---

## 🗺️ Roadmap
- [ ] Stripe Payment Gateway Integration
- [ ] UploadThing Receipt/Document attachments
- [ ] Multi-tenant Architecture (Organizations)
- [ ] Driver Assignment & Scheduling Modules
- [ ] Automated Email Invoice Delivery

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
