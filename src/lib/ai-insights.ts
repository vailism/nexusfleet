import prisma from "@/lib/prisma";
import { getDashboardKPIs, getRevenueExpenseTrends } from "./analytics-service";

export async function generateBusinessInsights(orgId: string) {
  const kpis = await getDashboardKPIs();
  const trends = await getRevenueExpenseTrends();

  const insights = [];

  // 1. Revenue Concentration
  const topCustomers = await prisma.invoice.groupBy({
    by: ['customerId'],
    where: { organizationId: orgId, status: 'PAID' },
    _sum: { total: true },
    orderBy: { _sum: { total: 'desc' } },
    take: 3
  });

  const totalRevenue = kpis.revenue.value;
  const topThreeRevenue = topCustomers.reduce((acc, curr) => acc + (curr._sum.total || 0), 0);
  const concentration = totalRevenue > 0 ? (topThreeRevenue / totalRevenue) * 100 : 0;

  if (concentration > 50) {
    insights.push({
      type: 'WARNING',
      title: 'High Revenue Concentration',
      description: `Top 3 customers contribute ${concentration.toFixed(1)}% of your total revenue. Consider diversifying your client base.`,
      impact: 'HIGH'
    });
  }

  // 2. Expense Trends
  if (kpis.expenses.trend > 15) {
    insights.push({
      type: 'ANOMALY',
      title: 'Expense Spike Detected',
      description: `Your operating expenses increased by ${kpis.expenses.trend.toFixed(1)}% this month compared to last.`,
      impact: 'MEDIUM'
    });
  }

  // 3. Growth Insights
  if (kpis.netProfit.trend > 5) {
    insights.push({
      type: 'POSITIVE',
      title: 'Healthy Profit Growth',
      description: `Net profit is up ${kpis.netProfit.trend.toFixed(1)}% month-over-month. collection efficiency is improving.`,
      impact: 'MEDIUM'
    });
  }

  return insights;
}
