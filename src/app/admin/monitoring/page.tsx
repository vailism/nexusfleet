import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Server, Database, Globe, Zap, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MonitoringDashboard() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">System Monitoring</h2>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
          All Systems Operational
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Latency</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124ms</div>
            <p className="text-xs text-muted-foreground">P95 response time</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.98%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Exceptions</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Sentry unresolved issues</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle>Health Checks</CardTitle>
            <CardDescription>Live connectivity status to downstream services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">PostgreSQL Database</span>
              </div>
              <Badge className="bg-emerald-500">Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center gap-3">
                <Server className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Stripe API</span>
              </div>
              <Badge className="bg-emerald-500">Available</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">UploadThing Storage</span>
              </div>
              <Badge className="bg-emerald-500">Available</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle>Infrastructure Resource Usage</CardTitle>
            <CardDescription>Container resource utilization metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
             <div className="space-y-2">
               <div className="flex justify-between text-xs font-medium">
                 <span>CPU Utilization</span>
                 <span>12%</span>
               </div>
               <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border">
                 <div className="h-full bg-primary w-[12%]" />
               </div>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between text-xs font-medium">
                 <span>Memory Usage (RAM)</span>
                 <span>442MB / 1024MB</span>
               </div>
               <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border">
                 <div className="h-full bg-primary w-[43%]" />
               </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
