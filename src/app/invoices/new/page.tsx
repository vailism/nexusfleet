import { InvoiceForm } from "@/components/forms/InvoiceForm";
import prisma from "@/lib/prisma";
import { createInvoice } from "@/actions/invoice-actions";
import { redirect } from "next/navigation";

export default async function NewInvoicePage() {
  const customers = await prisma.customer.findMany({
    orderBy: { name: 'asc' }
  });

  const handleSave = async (data: any) => {
    "use server";
    const result = await createInvoice(data);
    if (result.success) {
      redirect("/invoices");
    } else {
      throw new Error("Failed to save invoice");
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Invoice</h2>
          <p className="text-muted-foreground mt-1">Build a new professional invoice with dynamic line items.</p>
        </div>
      </div>

      <InvoiceForm customers={customers} onSave={handleSave} />
    </div>
  );
}
