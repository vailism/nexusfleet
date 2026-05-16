export const PLANS = [
  {
    id: "STARTER",
    name: "Starter",
    description: "Perfect for small fleets just getting started.",
    priceMonthly: 49,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
    features: [
      "Up to 5 Vehicles",
      "Up to 100 Invoices/month",
      "Basic Analytics",
      "Standard Support",
    ],
    limits: {
      vehicles: 5,
      invoices: 100,
    },
  },
  {
    id: "BUSINESS",
    name: "Business",
    description: "For growing companies needing advanced tools.",
    priceMonthly: 149,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID,
    features: [
      "Unlimited Vehicles",
      "Unlimited Invoices",
      "Advanced Analytics",
      "Multi-user Teams",
      "File & Receipt Uploads",
    ],
    limits: {
      vehicles: 999999,
      invoices: 999999,
    },
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    description: "Maximum power with AI insights and priority support.",
    priceMonthly: 299,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      "Everything in Business",
      "AI Insights & Forecasting",
      "Audit Logs",
      "Role-Based Access Control",
      "Priority 24/7 Support",
    ],
    limits: {
      vehicles: 999999,
      invoices: 999999,
    },
  },
];
