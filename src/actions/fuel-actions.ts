"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { fuelLogSchema } from "@/lib/validations";
import { z } from "zod";

export async function createFuelLog(data: z.infer<typeof fuelLogSchema>) {
  try {
    const validatedData = fuelLogSchema.parse(data);
    
    // Check for lower odometer
    const lastLog = await prisma.fuelLog.findFirst({
      where: { vehicleId: validatedData.vehicleId },
      orderBy: { odometer: 'desc' },
    });

    if (lastLog && validatedData.odometer <= lastLog.odometer) {
      return { success: false, message: `Odometer reading must be higher than previous (${lastLog.odometer} km).` };
    }

    await prisma.fuelLog.create({
      data: validatedData,
    });
    
    // Also create a linked expense automatically
    await prisma.expense.create({
      data: {
        amount: validatedData.cost,
        category: "Fuel",
        description: `Fuel log: ${validatedData.liters}L at ${validatedData.odometer}km`,
        date: validatedData.date,
        vehicleId: validatedData.vehicleId,
      }
    });

    revalidatePath("/vehicles"); // Assuming fuel logs are viewed on vehicle details
    return { success: true, message: "Fuel log created successfully." };
  } catch (error) {
    return { success: false, message: "Failed to create fuel log.", error };
  }
}
