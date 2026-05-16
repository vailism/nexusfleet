"use client";

import { PLANS } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Lock, Zap } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface SubscriptionGuardProps {
  children: ReactNode;
  planId: string;
  requiredPlan: "STARTER" | "BUSINESS" | "ENTERPRISE";
  fallback?: ReactNode;
}

export function SubscriptionGuard({ children, planId, requiredPlan, fallback }: SubscriptionGuardProps) {
  const planWeights = {
    STARTER: 1,
    BUSINESS: 2,
    ENTERPRISE: 3,
  };

  const hasAccess = planWeights[planId as keyof typeof planWeights] >= planWeights[requiredPlan];

  if (hasAccess) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  return (
    <div className="relative rounded-xl border border-dashed border-primary/20 bg-primary/5 p-8 text-center overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4 p-3 rounded-full bg-primary/10 text-primary">
          <Lock className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold mb-2">Premium Feature</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
          The feature you are trying to access requires a <strong>{requiredPlan}</strong> plan or higher.
        </p>
        <Link href="/pricing">
          <Button size="sm" className="shadow-lg shadow-primary/20">
            <Zap className="mr-2 h-4 w-4 fill-current" />
            Upgrade Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
