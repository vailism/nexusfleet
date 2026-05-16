import { AssistantChat } from "@/components/ai/AssistantChat";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, BarChart3, ShieldAlert, Cpu } from "lucide-react";

export default function AIAssistantPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Fleet Assistant</h2>
        <p className="text-muted-foreground">Conversational intelligence for your business operations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AssistantChat />
        </div>
        
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Cpu className="h-4 w-4 text-primary" />
                System Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <BarChart3 className="h-4 w-4 mt-0.5 text-emerald-500" />
                <div>
                  <p className="text-xs font-bold">Trend Analysis</p>
                  <p className="text-[10px] text-muted-foreground">Identify revenue and expense patterns over time.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-4 w-4 mt-0.5 text-red-500" />
                <div>
                  <p className="text-xs font-bold">Anomaly Detection</p>
                  <p className="text-[10px] text-muted-foreground">Flag unusual fuel costs or maintenance spikes.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="h-4 w-4 mt-0.5 text-blue-500" />
                <div>
                  <p className="text-xs font-bold">Predictive Modeling</p>
                  <p className="text-[10px] text-muted-foreground">Forecast upcoming service dates and cashflow.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm">Try asking...</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs space-y-3 text-muted-foreground">
                <li className="cursor-pointer hover:text-primary transition-colors italic">"What is our projected revenue for next month?"</li>
                <li className="cursor-pointer hover:text-primary transition-colors italic">"Which vehicle has the highest maintenance cost?"</li>
                <li className="cursor-pointer hover:text-primary transition-colors italic">"Are there any unusual fuel expenses?"</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
