"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createCustomerPortal } from "@/actions/billing-actions";
import { useState } from "react";
import { Loader2, CreditCard, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface SubscriptionCardProps {
  orgId: string;
  planId: string;
  status: string;
  currentPeriodEnd?: Date;
}

export function SubscriptionCard({ orgId, planId, status, currentPeriodEnd }: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);

  const handleManage = async () => {
    setLoading(true);
    const result = await createCustomerPortal(orgId);
    if (result.url) {
      window.location.href = result.url;
    } else {
      toast.error(result.error || "Failed to open billing portal");
      setLoading(null);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Manage your subscription and billing preferences.</CardDescription>
        </div>
        <Badge variant={status === "active" ? "default" : "secondary"} className="uppercase">
          {planId}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Subscription Status</p>
            <p className="text-xs text-muted-foreground">
              Your plan is currently <span className="text-emerald-500 font-semibold">{status}</span>
            </p>
          </div>
        </div>
        
        {currentPeriodEnd && (
          <p className="text-xs text-muted-foreground px-1">
            Next billing date: <span className="text-foreground">{format(currentPeriodEnd, "MMM dd, yyyy")}</span>
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleManage} disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ExternalLink className="mr-2 h-4 w-4" />
          )}
          Manage Billing & Invoices
        </Button>
      </CardFooter>
    </Card>
  );
}
