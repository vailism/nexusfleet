"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { maintenanceRecordSchema } from "@/lib/validations";
import { z } from "zod";

export async function createMaintenanceRecord(data: z.infer<typeof maintenanceRecordSchema>) {
  try {
    const validatedData = maintenanceRecordSchema.parse(data);
    
    await prisma.maintenanceRecord.create({
      data: validatedData,
    });
    
    // Auto-create expense
    if (validatedData.cost > 0) {
      await prisma.expense.create({
        data: {
          amount: validatedData.cost,
          category: "Maintenance",
          description: validatedData.serviceType + (validatedData.description ? `: ${validatedData.description}` : ''),
          date: validatedData.date,
          vehicleId: validatedData.vehicleId,
        }
      });
    }

    revalidatePath("/vehicles");
    return { success: true, message: "Maintenance record created successfully." };
  } catch (error) {
    return { success: false, message: "Failed to create maintenance record.", error };
  }
}
