import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10" as any, // Using type 'any' to bypass strict version checks if mismatch
  appInfo: {
    name: "NexusFleet ERP",
    version: "1.0.0",
  },
});
