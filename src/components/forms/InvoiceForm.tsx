"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Trash2, Calculator, Loader2 } from "lucide-react";
import { InvoiceStatus, Customer } from "@prisma/client";
import { calculateInvoiceTotals, calculateItemTotal } from "@/lib/invoice-calculations";

// In a real app we'd fetch this via Server Components and pass it as a prop
// We assume it's passed here for the Customer selector
interface InvoiceFormProps {
  customers: Customer[];
  onSave: (data: any) => Promise<void>;
}

export function InvoiceForm({ customers, onSave }: InvoiceFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      status: InvoiceStatus.PENDING,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      customerId: "",
      notes: "",
      terms: "Please pay within 14 days of receiving this invoice.",
      items: [
        { description: "", quantity: 1, unitPrice: 0, gstPercent: 0, discount: 0 }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchItems = form.watch("items");
  const totals = calculateInvoiceTotals(watchItems as any);

  const onSubmit = async (data: z.infer<typeof invoiceSchema>) => {
    setLoading(true);
    
    const payload = {
      ...data,
      amount: totals.subtotal,
      tax: totals.gstTotal,
      total: totals.grandTotal,
    };

    try {
      await onSave(payload);
      toast.success("Invoice saved successfully!");
      // Optionally redirect or reset form
    } catch (e) {
      toast.error("Failed to save invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Editor Section */}
      <div className="xl:col-span-2 space-y-8">
        <form id="invoice-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Customer</Label>
                <Select onValueChange={(val) => form.setValue("customerId", val)} defaultValue={form.getValues("customerId")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.customerId && <p className="text-xs text-red-500">{form.formState.errors.customerId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Invoice Number</Label>
                <Input {...form.register("number")} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select onValueChange={(val: any) => form.setValue("status", val)} defaultValue={form.getValues("status")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={InvoiceStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={InvoiceStatus.PAID}>Paid</SelectItem>
                    <SelectItem value={InvoiceStatus.OVERDUE}>Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" {...form.register("dueDate", { valueAsDate: true })} />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Line Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", quantity: 1, unitPrice: 0, gstPercent: 0, discount: 0 })}>
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => {
                const itemTotal = calculateItemTotal(watchItems[index] as any);
                return (
                  <div key={field.id} className="grid grid-cols-12 gap-4 items-end p-4 rounded-lg bg-background/50 border border-border/50 transition-all hover:border-border">
                    <div className="col-span-12 md:col-span-4 space-y-2">
                      <Label>Description</Label>
                      <Input {...form.register(`items.${index}.description`)} placeholder="Service description" />
                    </div>
                    <div className="col-span-4 md:col-span-2 space-y-2">
                      <Label>Qty</Label>
                      <Input type="number" step="0.01" {...form.register(`items.${index}.quantity`, { valueAsNumber: true })} />
                    </div>
                    <div className="col-span-4 md:col-span-2 space-y-2">
                      <Label>Price</Label>
                      <Input type="number" step="0.01" {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })} />
                    </div>
                    <div className="col-span-4 md:col-span-1 space-y-2">
                      <Label>GST %</Label>
                      <Input type="number" {...form.register(`items.${index}.gstPercent`, { valueAsNumber: true })} />
                    </div>
                    <div className="col-span-10 md:col-span-2 space-y-2 text-right">
                      <Label>Total</Label>
                      <div className="h-10 flex items-center justify-end font-medium">
                        ${itemTotal.total.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex justify-end pb-2">
                      <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => remove(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Notes to Customer</Label>
              <textarea 
                {...form.register("notes")} 
                className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Thank you for your business!"
              />
            </div>
            <div className="space-y-2">
              <Label>Terms & Conditions</Label>
              <textarea 
                {...form.register("terms")} 
                className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>

        </form>
      </div>

      {/* Summary / Preview Panel */}
      <div className="xl:col-span-1">
        <div className="sticky top-24 p-6 rounded-xl border border-border bg-primary/5 backdrop-blur-md space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-border/50">
            <Calculator className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Summary</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.discountTotal > 0 && (
              <div className="flex justify-between text-green-500">
                <span>Discount</span>
                <span>-${totals.discountTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (GST)</span>
              <span>${totals.gstTotal.toFixed(2)}</span>
            </div>
            <div className="pt-4 mt-4 border-t border-border/50 flex justify-between items-center">
              <span className="text-base font-semibold">Grand Total</span>
              <span className="text-2xl font-bold text-primary">${totals.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <Button form="invoice-form" type="submit" className="w-full shadow-lg" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save & Create Invoice
            </Button>
            <Button variant="outline" className="w-full">
              Preview PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
