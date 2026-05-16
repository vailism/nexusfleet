"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UsageProgressProps {
  label: string;
  current: number;
  limit: number;
  unit?: string;
}

export function UsageProgress({ label, current, limit, unit = "" }: UsageProgressProps) {
  const percentage = Math.min(Math.round((current / limit) * 100), 100);
  const isNearLimit = percentage > 80;
  const isAtLimit = percentage >= 100;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-end">
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
          <span className="text-xs text-muted-foreground font-mono">
            {current.toLocaleString()} / {limit === 999999 ? "∞" : limit.toLocaleString()} {unit}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Progress 
          value={limit === 999999 ? 0 : percentage} 
          className="h-2" 
          indicatorClassName={isAtLimit ? "bg-red-500" : isNearLimit ? "bg-yellow-500" : "bg-primary"}
        />
        <p className="mt-2 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
          {limit === 999999 ? "Unlimited Access" : `${percentage}% of limit used`}
        </p>
      </CardContent>
    </Card>
  );
}
