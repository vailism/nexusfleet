"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerForm } from "@/components/forms/CustomerForm";
import { DataTable } from "@/components/DataTable";
import { deleteCustomer } from "@/actions/customer-actions";
import { toast } from "sonner";
import { Customer } from "@prisma/client";

// Mocking the fetch. In production, this would be a server component
export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We would fetch data here
    fetch("/api/customers-placeholder").catch(() => setLoading(false));
  }, []);

  const handleDelete = async (customer: Customer) => {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      const result = await deleteCustomer(customer.id);
      if (result.success) {
        toast.success(result.message);
        setCustomers(c => c.filter(x => x.id !== customer.id));
      } else {
        toast.error(result.message);
      }
    }
  };

  const columns = [
    { header: "Name", accessorKey: "name" as keyof Customer },
    { header: "Email", accessorKey: "email" as keyof Customer },
    { header: "Phone", accessorKey: "phone" as keyof Customer },
    { 
      header: "Address", 
      cell: (item: Customer) => <span className="truncate max-w-[200px] block">{item.address || 'N/A'}</span> 
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <CustomerForm />
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-6 text-muted-foreground">Loading customers...</div>
          ) : (
            <DataTable 
              data={customers} 
              columns={columns} 
              searchKey="name"
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
