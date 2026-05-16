"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { expenseSchema } from "@/lib/validations";
import { z } from "zod";

export async function createExpense(data: z.infer<typeof expenseSchema>) {
  try {
    const validatedData = expenseSchema.parse(data);
    
    await prisma.expense.create({
      data: validatedData,
    });
    
    revalidatePath("/expenses");
    return { success: true, message: "Expense created successfully." };
  } catch (error) {
    return { success: false, message: "Failed to create expense.", error };
  }
}

export async function updateExpense(id: string, data: z.infer<typeof expenseSchema>) {
  try {
    const validatedData = expenseSchema.parse(data);
    
    await prisma.expense.update({
      where: { id },
      data: validatedData,
    });
    
    revalidatePath("/expenses");
    return { success: true, message: "Expense updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update expense.", error };
  }
}

export async function deleteExpense(id: string) {
  try {
    await prisma.expense.delete({
      where: { id },
    });
    
    revalidatePath("/expenses");
    return { success: true, message: "Expense deleted successfully." };
  } catch (error) {
    return { success: false, message: "Failed to delete expense.", error };
  }
}
