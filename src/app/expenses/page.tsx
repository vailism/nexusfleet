"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseForm } from "@/components/forms/ExpenseForm";
import { DataTable } from "@/components/DataTable";
import { deleteExpense } from "@/actions/expense-actions";
import { toast } from "sonner";
import { Expense, Vehicle } from "@prisma/client";

type ExpenseWithVehicle = Expense & { vehicle?: Vehicle | null };

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseWithVehicle[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production we fetch these from server components
    Promise.all([
      fetch("/api/expenses-placeholder").catch(() => []),
      fetch("/api/vehicles-placeholder").catch(() => [])
    ]).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (expense: ExpenseWithVehicle) => {
    if (confirm(`Are you sure you want to delete this expense of $${expense.amount}?`)) {
      const result = await deleteExpense(expense.id);
      if (result.success) {
        toast.success(result.message);
        setExpenses(e => e.filter(x => x.id !== expense.id));
      } else {
        toast.error(result.message);
      }
    }
  };

  const columns = [
    { 
      header: "Date", 
      cell: (item: ExpenseWithVehicle) => new Date(item.date).toLocaleDateString()
    },
    { 
      header: "Category", 
      cell: (item: ExpenseWithVehicle) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          {item.category}
        </span>
      )
    },
    { 
      header: "Description", 
      cell: (item: ExpenseWithVehicle) => <span className="truncate max-w-[200px] block">{item.description || '-'}</span> 
    },
    { 
      header: "Vehicle", 
      cell: (item: ExpenseWithVehicle) => item.vehicle?.licensePlate || 'N/A'
    },
    { 
      header: "Amount", 
      cell: (item: ExpenseWithVehicle) => <span className="font-medium">${item.amount.toFixed(2)}</span>
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
        <ExpenseForm vehicles={vehicles} />
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-6 text-muted-foreground">Loading expenses...</div>
          ) : (
            <DataTable 
              data={expenses} 
              columns={columns} 
              searchKey="description"
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
