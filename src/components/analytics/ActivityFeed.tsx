import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileText, Wrench, Fuel } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

export async function ActivityFeed() {
  // Fetch latest 3 of each, then sort them together
  const [invoices, expenses, maintenance, fuel] = await Promise.all([
    prisma.invoice.findMany({ orderBy: { createdAt: 'desc' }, take: 4, include: { customer: true } }),
    prisma.expense.findMany({ orderBy: { createdAt: 'desc' }, take: 4 }),
    prisma.maintenanceRecord.findMany({ orderBy: { createdAt: 'desc' }, take: 4, include: { vehicle: true } }),
    prisma.fuelLog.findMany({ orderBy: { createdAt: 'desc' }, take: 4, include: { vehicle: true } })
  ]);

  const activities = [
    ...invoices.map(i => ({ 
      id: `inv-${i.id}`, 
      type: 'INVOICE', 
      title: `Invoice ${i.number} created`, 
      desc: `For ${i.customer.name} - $${i.total.toFixed(2)}`, 
      date: i.createdAt,
      icon: <FileText className="w-4 h-4 text-blue-500" />
    })),
    ...expenses.map(e => ({ 
      id: `exp-${e.id}`, 
      type: 'EXPENSE', 
      title: `Expense Logged`, 
      desc: `${e.category}: $${e.amount.toFixed(2)}`, 
      date: e.createdAt,
      icon: <Clock className="w-4 h-4 text-red-500" />
    })),
    ...maintenance.map(m => ({ 
      id: `maint-${m.id}`, 
      type: 'MAINTENANCE', 
      title: `Service Logged`, 
      desc: `${m.vehicle.licensePlate} - ${m.serviceType}`, 
      date: m.createdAt,
      icon: <Wrench className="w-4 h-4 text-yellow-500" />
    })),
    ...fuel.map(f => ({ 
      id: `fuel-${f.id}`, 
      type: 'FUEL', 
      title: `Fuel Fill-Up`, 
      desc: `${f.vehicle.licensePlate} - ${f.liters}L`, 
      date: f.createdAt,
      icon: <Fuel className="w-4 h-4 text-emerald-500" />
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 8); // top 8 most recent

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="mt-0.5 p-2 rounded-full bg-background border border-border">
                  {activity.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.desc}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(activity.date, { addSuffix: true })}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
