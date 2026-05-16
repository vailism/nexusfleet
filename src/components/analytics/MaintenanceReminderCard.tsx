"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Wrench, CheckCircle } from "lucide-react";
import { MaintenanceRecordData, calculateMaintenanceStatus } from "@/lib/maintenance-utils";

interface MaintenanceReminderCardProps {
  records: (MaintenanceRecordData & { vehicleName: string; serviceType: string })[];
}

export function MaintenanceReminderCard({ records }: MaintenanceReminderCardProps) {
  // Filter for upcoming or overdue records
  const alerts = records
    .map(r => ({ ...r, ...calculateMaintenanceStatus(r) }))
    .filter(r => r.status === 'OVERDUE' || r.status === 'UPCOMING')
    .sort((a, b) => {
      // sort by days until due (overdue first)
      return (a.daysUntilDue || Infinity) - (b.daysUntilDue || Infinity);
    })
    .slice(0, 5); // top 5

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Service Reminders</CardTitle>
        <Wrench className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mb-2 text-green-500/50" />
            <p className="text-sm">All vehicles up to date!</p>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            {alerts.map((alert, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-full ${alert.status === 'OVERDUE' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{alert.vehicleName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.serviceType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold ${alert.status === 'OVERDUE' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {alert.status === 'OVERDUE' ? `Overdue by ${Math.abs(alert.daysUntilDue!)} days` : `Due in ${alert.daysUntilDue} days`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
