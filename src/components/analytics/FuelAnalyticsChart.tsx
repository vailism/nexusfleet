"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FuelAnalyticsChartProps {
  data: { month: string; totalLiters: number; totalCost: number }[];
}

export function FuelAnalyticsChart({ data }: FuelAnalyticsChartProps) {
  return (
    <Card className="col-span-full bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle>Fuel Consumption & Cost Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="totalLiters" name="Volume (Liters)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line yAxisId="right" type="monotone" dataKey="totalCost" name="Cost ($)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
