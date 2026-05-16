"use server";

import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { PLANS } from "@/lib/pricing";
import { headers } from "next/headers";

export async function createCheckoutSession(planId: string, orgId: string) {
  try {
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan || !plan.stripePriceId) throw new Error("Invalid plan");

    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) throw new Error("Organization not found");

    const origin = (await headers()).get("origin") || process.env.NEXTAUTH_URL;

    let customerId = org.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        name: org.name,
        metadata: {
          orgId: org.id,
        },
      });
      customerId = customer.id;
      await prisma.organization.update({
        where: { id: orgId },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        orgId: org.id,
        planId: plan.id,
      },
    });

    return { url: session.url };
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return { error: error.message };
  }
}

export async function createCustomerPortal(orgId: string) {
  try {
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org || !org.stripeCustomerId) throw new Error("No billing account found");

    const origin = (await headers()).get("origin") || process.env.NEXTAUTH_URL;

    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripeCustomerId,
      return_url: `${origin}/dashboard`,
    });

    return { url: session.url };
  } catch (error: any) {
    return { error: error.message };
  }
}
