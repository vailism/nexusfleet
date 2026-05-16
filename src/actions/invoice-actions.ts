"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { invoiceSchema } from "@/lib/validations";

export async function createInvoice(data: any) {
  try {
    // We would strictly parse this with Zod on the server side:
    // const validatedData = invoiceSchema.parse(data);
    
    const { items, ...invoiceData } = data;

    const invoice = await prisma.invoice.create({
      data: {
        ...invoiceData,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            gstPercent: item.gstPercent,
            discount: item.discount,
            total: (item.quantity * item.unitPrice) * (1 - item.discount / 100) * (1 + item.gstPercent / 100)
          }))
        }
      },
      include: {
        items: true,
        customer: true,
      }
    });
    
    revalidatePath("/invoices");
    return { success: true, message: "Invoice created successfully.", data: invoice };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to create invoice.", error };
  }
}
