"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { customerSchema } from "@/lib/validations";
import { z } from "zod";

export async function createCustomer(data: z.infer<typeof customerSchema>) {
  try {
    const validatedData = customerSchema.parse(data);
    
    await prisma.customer.create({
      data: validatedData,
    });
    
    revalidatePath("/customers");
    return { success: true, message: "Customer created successfully." };
  } catch (error) {
    return { success: false, message: "Failed to create customer.", error };
  }
}

export async function updateCustomer(id: string, data: z.infer<typeof customerSchema>) {
  try {
    const validatedData = customerSchema.parse(data);
    
    await prisma.customer.update({
      where: { id },
      data: validatedData,
    });
    
    revalidatePath("/customers");
    return { success: true, message: "Customer updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update customer.", error };
  }
}

export async function deleteCustomer(id: string) {
  try {
    await prisma.customer.delete({
      where: { id },
    });
    
    revalidatePath("/customers");
    return { success: true, message: "Customer deleted successfully." };
  } catch (error) {
    return { success: false, message: "Failed to delete customer.", error };
  }
}
