"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, Activity, Truck, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

interface KPIData {
  revenue: { value: number; trend: number };
  expenses: { value: number; trend: number };
  netProfit: { value: number; trend: number };
  invoices: { pending: number; overdue: number };
  fleet: { active: number; maintenance: number };
}

interface KPICardsProps {
  data: KPIData;
}

export function KPICards({ data }: KPICardsProps) {
  const formatCurrency = (val: number) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const TrendIndicator = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    return (
      <p className={`text-xs flex items-center mt-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {Math.abs(value).toFixed(1)}% from last month
      </p>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/80 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(data.revenue.value)}</div>
          <TrendIndicator value={data.revenue.trend} />
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/80 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Operating Expenses</CardTitle>
          <CreditCard className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(data.expenses.value)}</div>
          <TrendIndicator value={data.expenses.trend} />
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/80 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          <Activity className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(data.netProfit.value)}</div>
          <TrendIndicator value={data.netProfit.trend} />
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/80 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fleet & Operations</CardTitle>
          <Truck className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.fleet.active} <span className="text-sm font-normal text-muted-foreground">Active</span></div>
          <div className="flex gap-4 mt-1">
            <p className="text-xs text-yellow-500 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" /> {data.fleet.maintenance} in shop
            </p>
            <p className="text-xs text-red-500 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" /> {data.invoices.overdue} overdue inv.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
