import { SubscriptionCard } from "@/components/billing/SubscriptionCard";
import { UsageProgress } from "@/components/billing/UsageProgress";
import { PLANS } from "@/lib/pricing";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  // In a real app, get this from session
  const orgId = "dummy-org-id";
  
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  if (!org) {
    return <div>Organization not found. Please log in.</div>;
  }

  const currentPlan = PLANS.find(p => p.id === org.planId) || PLANS[0];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Billing & Subscription</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <SubscriptionCard 
            orgId={org.id}
            planId={org.planId}
            status={org.stripeSubscriptionId ? "active" : "free"}
            currentPeriodEnd={org.stripeCurrentPeriodEnd || undefined}
          />
        </div>
        
        <div className="space-y-6">
          <UsageProgress 
            label="Fleet Vehicles"
            current={org.vehicleCount}
            limit={currentPlan.limits.vehicles}
            unit="vehicles"
          />
          <UsageProgress 
            label="Monthly Invoices"
            current={org.invoiceCount}
            limit={currentPlan.limits.invoices}
            unit="invoices"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/30 p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">Need Help with Billing?</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
          If you have questions about your invoices, plan limits, or need a custom quote for a larger fleet, 
          our support team is ready to assist you.
        </p>
        <div className="flex justify-center gap-4">
          <button className="text-sm font-medium hover:underline">Contact Support</button>
          <span className="text-border">|</span>
          <button className="text-sm font-medium hover:underline">View FAQ</button>
        </div>
      </div>
    </div>
  );
}
