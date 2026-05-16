"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RevenueExpenseChartProps {
  data: { month: string; revenue: number; expense: number; profit: number }[];
}

export function RevenueExpenseChart({ data }: RevenueExpenseChartProps) {
  return (
    <Card className="col-span-full xl:col-span-2 bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle>Financial Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <Tooltip 
              formatter={(value: number) => `$${value.toFixed(2)}`}
              contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }} 
            />
            <Legend verticalAlign="top" height={36}/>
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" />
            <Area type="monotone" dataKey="expense" name="Expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExp)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
