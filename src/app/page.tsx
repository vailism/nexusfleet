import { getDashboardKPIs, getRevenueExpenseTrends, getExpenseBreakdown } from "@/lib/analytics-service";
import { KPICards } from "@/components/analytics/KPICards";
import { RevenueExpenseChart } from "@/components/analytics/RevenueExpenseChart";
import { ExpenseBreakdownChart } from "@/components/analytics/ExpenseBreakdownChart";
import { MaintenanceReminderCard } from "@/components/analytics/MaintenanceReminderCard";
import { ActivityFeed } from "@/components/analytics/ActivityFeed";
import prisma from "@/lib/prisma";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function DashboardPage() {
  const [kpis, revExpData, expBreakdown, maintenanceRecords] = await Promise.all([
    getDashboardKPIs(),
    getRevenueExpenseTrends(),
    getExpenseBreakdown(),
    prisma.maintenanceRecord.findMany({
      include: { vehicle: true },
      orderBy: { nextDueDate: 'asc' },
    }),
  ]);

  // Format maintenance records for the card
  const formattedMaintenance = maintenanceRecords.map((r) => ({
    ...r,
    vehicleName: r.vehicle.licensePlate,
  }));

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Executive Dashboard</h2>
        <div className="flex items-center space-x-2">
          {/* We could add Date Range Pickers or Export buttons here */}
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-32 w-full rounded-xl" />}>
        <KPICards data={kpis} />
      </Suspense>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-1 lg:col-span-4 space-y-6">
          <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
            <RevenueExpenseChart data={revExpData} />
          </Suspense>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Suspense fallback={<Skeleton className="h-[350px] w-full rounded-xl" />}>
              <ExpenseBreakdownChart data={expBreakdown} />
            </Suspense>
            
            <Suspense fallback={<Skeleton className="h-[350px] w-full rounded-xl" />}>
              <MaintenanceReminderCard records={formattedMaintenance} />
            </Suspense>
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-3">
          <Suspense fallback={<Skeleton className="h-full w-full min-h-[600px] rounded-xl" />}>
            <ActivityFeed />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
