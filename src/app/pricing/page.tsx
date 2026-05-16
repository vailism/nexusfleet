"use client";

import { PLANS } from "@/lib/pricing";
import { createCheckoutSession } from "@/actions/billing-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    // In a real app, you'd get the orgId from the session/context
    const orgId = "dummy-org-id"; 
    
    const result = await createCheckoutSession(planId, orgId);
    
    if (result.url) {
      window.location.href = result.url;
    } else {
      toast.error(result.error || "Something went wrong");
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Scale your fleet operations with precision. Choose the plan that fits your business needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            className={`flex flex-col border-border bg-card/50 backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 ${
              plan.id === "BUSINESS" ? "border-primary shadow-lg scale-105 z-10" : ""
            }`}
          >
            {plan.id === "BUSINESS" && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.priceMonthly}</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-300">
                    <Check className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full h-12 text-md font-semibold" 
                variant={plan.id === "BUSINESS" ? "default" : "outline"}
                onClick={() => handleSubscribe(plan.id)}
                disabled={!!loading}
              >
                {loading === plan.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  `Get Started with ${plan.name}`
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-20 text-center">
        <p className="text-muted-foreground mb-4 text-sm">Need something more custom?</p>
        <Button variant="link" className="text-primary hover:text-primary/80">
          Contact our Enterprise Team
        </Button>
      </div>
    </div>
  );
}
