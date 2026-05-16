"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RevenueForecastChartProps {
  data: { month: string; actual?: number; forecast?: number }[];
}

export function RevenueForecastChart({ data }: RevenueForecastChartProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Revenue Forecast</CardTitle>
          <CardDescription>Predictive cashflow analysis based on growth trends.</CardDescription>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
          AI MODEL: Prophet-Lite
        </Badge>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Legend verticalAlign="top" height={36}/>
            <Line 
              type="monotone" 
              dataKey="actual" 
              name="Historical Revenue" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              name="Predicted Revenue" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              strokeDasharray="5 5" 
              dot={{ r: 4 }} 
            />
            <ReferenceLine x="May" stroke="#666" label={{ position: 'top', value: 'Today', fill: '#666', fontSize: 10 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
