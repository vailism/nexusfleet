"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Insight {
  type: 'WARNING' | 'ANOMALY' | 'POSITIVE';
  title: string;
  description: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

export function SmartInsightsPanel({ insights }: { insights: Insight[] }) {
  return (
    <Card className="bg-gradient-to-br from-card/80 to-primary/5 backdrop-blur-xl border-primary/20 shadow-lg shadow-primary/5">
      <CardHeader className="flex flex-row items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        <CardTitle className="text-lg">AI Business Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Analyzing your business data... Check back soon for intelligent optimizations.
          </p>
        ) : (
          insights.map((insight, i) => (
            <div key={i} className="group relative flex items-start gap-4 p-4 rounded-xl bg-background/40 border border-border/50 hover:border-primary/30 transition-all">
              <div className={`mt-1 p-2 rounded-lg ${
                insight.type === 'POSITIVE' ? 'bg-emerald-500/10 text-emerald-500' :
                insight.type === 'WARNING' ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-red-500/10 text-red-500'
              }`}>
                {insight.type === 'POSITIVE' ? <TrendingUp className="h-4 w-4" /> :
                 insight.type === 'WARNING' ? <Lightbulb className="h-4 w-4" /> :
                 <AlertTriangle className="h-4 w-4" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold">{insight.title}</h4>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-tighter opacity-70">
                    {insight.impact} IMPACT
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
