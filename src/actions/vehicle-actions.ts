"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { vehicleSchema } from "@/lib/validations";
import { z } from "zod";

export async function createVehicle(data: z.infer<typeof vehicleSchema>) {
  try {
    const validatedData = vehicleSchema.parse(data);
    
    await prisma.vehicle.create({
      data: validatedData,
    });
    
    revalidatePath("/vehicles");
    return { success: true, message: "Vehicle created successfully." };
  } catch (error) {
    return { success: false, message: "Failed to create vehicle.", error };
  }
}

export async function updateVehicle(id: string, data: z.infer<typeof vehicleSchema>) {
  try {
    const validatedData = vehicleSchema.parse(data);
    
    await prisma.vehicle.update({
      where: { id },
      data: validatedData,
    });
    
    revalidatePath("/vehicles");
    return { success: true, message: "Vehicle updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update vehicle.", error };
  }
}

export async function deleteVehicle(id: string) {
  try {
    await prisma.vehicle.delete({
      where: { id },
    });
    
    revalidatePath("/vehicles");
    return { success: true, message: "Vehicle deleted successfully." };
  } catch (error) {
    return { success: false, message: "Failed to delete vehicle.", error };
  }
}
