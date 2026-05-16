import prisma from "@/lib/prisma";
import { InvoiceStatus } from "@prisma/client";

export async function getDashboardKPIs() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
  
  // Aggregate revenue (Total from Paid Invoices)
  const currentMonthRevenue = await prisma.invoice.aggregate({
    where: { 
      status: InvoiceStatus.PAID,
      createdAt: { gte: startOfMonth }
    },
    _sum: { total: true }
  });

  const lastMonthRevenue = await prisma.invoice.aggregate({
    where: { 
      status: InvoiceStatus.PAID,
      createdAt: { gte: startOfLastMonth, lt: startOfMonth }
    },
    _sum: { total: true }
  });

  // Aggregate expenses
  const currentMonthExpenses = await prisma.expense.aggregate({
    where: { date: { gte: startOfMonth } },
    _sum: { amount: true }
  });

  const lastMonthExpenses = await prisma.expense.aggregate({
    where: { date: { gte: startOfLastMonth, lt: startOfMonth } },
    _sum: { amount: true }
  });

  const revenue = currentMonthRevenue._sum.total || 0;
  const lastRevenue = lastMonthRevenue._sum.total || 0;
  const expenses = currentMonthExpenses._sum.amount || 0;
  const lastExpenses = lastMonthExpenses._sum.amount || 0;
  const netProfit = revenue - expenses;
  const lastNetProfit = lastRevenue - lastExpenses;

  // Invoice stats
  const pendingInvoices = await prisma.invoice.count({
    where: { status: InvoiceStatus.PENDING }
  });
  
  const overdueInvoices = await prisma.invoice.count({
    where: { status: InvoiceStatus.OVERDUE }
  });

  // Fleet stats
  const activeVehicles = await prisma.vehicle.count({
    where: { status: 'ACTIVE' }
  });
  const maintenanceVehicles = await prisma.vehicle.count({
    where: { status: 'MAINTENANCE' }
  });

  return {
    revenue: {
      value: revenue,
      trend: lastRevenue === 0 ? 100 : ((revenue - lastRevenue) / lastRevenue) * 100
    },
    expenses: {
      value: expenses,
      trend: lastExpenses === 0 ? 100 : ((expenses - lastExpenses) / lastExpenses) * 100
    },
    netProfit: {
      value: netProfit,
      trend: lastNetProfit === 0 ? 100 : ((netProfit - lastNetProfit) / Math.abs(lastNetProfit)) * 100
    },
    invoices: {
      pending: pendingInvoices,
      overdue: overdueInvoices
    },
    fleet: {
      active: activeVehicles,
      maintenance: maintenanceVehicles
    }
  };
}

export async function getRevenueExpenseTrends() {
  const yearStart = new Date(new Date().getFullYear(), 0, 1);

  // Group by month
  const invoices = await prisma.invoice.findMany({
    where: { status: InvoiceStatus.PAID, createdAt: { gte: yearStart } },
    select: { total: true, createdAt: true }
  });

  const expenses = await prisma.expense.findMany({
    where: { date: { gte: yearStart } },
    select: { amount: true, date: true }
  });

  const monthlyData: Record<string, { month: string; revenue: number; expense: number; profit: number }> = {};

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  monthNames.forEach(m => monthlyData[m] = { month: m, revenue: 0, expense: 0, profit: 0 });

  invoices.forEach(inv => {
    const month = monthNames[inv.createdAt.getMonth()];
    monthlyData[month].revenue += inv.total;
  });

  expenses.forEach(exp => {
    const month = monthNames[exp.date.getMonth()];
    monthlyData[month].expense += exp.amount;
  });

  Object.values(monthlyData).forEach(m => {
    m.profit = m.revenue - m.expense;
  });

  return Object.values(monthlyData);
}

export async function getExpenseBreakdown() {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);

  const expenses = await prisma.expense.groupBy({
    by: ['category'],
    where: { date: { gte: startOfYear } },
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } }
  });

  return expenses.map(e => ({
    name: e.category,
    value: e._sum.amount || 0
  }));
}
