import prisma from "@/lib/prisma";
import { addDays, differenceInDays } from "date-fns";

export async function predictMaintenance(orgId: string) {
  const vehicles = await prisma.vehicle.findMany({
    where: { organizationId: orgId },
    include: {
      maintenanceRecords: { orderBy: { date: 'desc' }, take: 5 },
      fuelLogs: { orderBy: { date: 'desc' }, take: 10 }
    }
  });

  const predictions = vehicles.map(vehicle => {
    const lastService = vehicle.maintenanceRecords[0];
    const avgFuelCost = vehicle.fuelLogs.reduce((acc, curr) => acc + curr.cost, 0) / vehicle.fuelLogs.length;
    
    // Heuristic: Predict next service based on frequency and vehicle usage
    let riskScore = 0;
    let predictedDate = lastService ? addDays(lastService.date, 180) : addDays(new Date(), 30);
    
    if (lastService && lastService.nextDueDate) {
      predictedDate = lastService.nextDueDate;
      const daysUntil = differenceInDays(predictedDate, new Date());
      if (daysUntil < 7) riskScore += 50;
      if (daysUntil < 0) riskScore += 100;
    }

    return {
      vehicleId: vehicle.id,
      plate: vehicle.licensePlate,
      predictedDate,
      riskScore: Math.min(riskScore, 100),
      reason: riskScore > 50 ? "Approaching scheduled interval" : "Status Normal"
    };
  });

  return predictions;
}
