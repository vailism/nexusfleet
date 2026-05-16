import prisma from "@/lib/prisma";

export async function detectFuelAnomalies(orgId: string) {
  const fuelLogs = await prisma.fuelLog.findMany({
    where: { vehicle: { organizationId: orgId } },
    include: { vehicle: true },
    orderBy: { date: 'desc' },
    take: 100
  });

  // Simple Z-score anomaly detection logic (simplified for ERP)
  const statsByVehicle: Record<string, { total: number; count: number; avg: number }> = {};
  
  fuelLogs.forEach(log => {
    const costPerLiter = log.cost / log.liters;
    if (!statsByVehicle[log.vehicleId]) {
      statsByVehicle[log.vehicleId] = { total: 0, count: 0, avg: 0 };
    }
    statsByVehicle[log.vehicleId].total += costPerLiter;
    statsByVehicle[log.vehicleId].count++;
  });

  const anomalies = [];

  for (const log of fuelLogs) {
    const costPerLiter = log.cost / log.liters;
    const avg = statsByVehicle[log.vehicleId].total / statsByVehicle[log.vehicleId].count;
    
    // If cost per liter is 30% higher than vehicle average, flag it
    if (costPerLiter > avg * 1.3) {
      anomalies.push({
        vehicleId: log.vehicleId,
        plate: log.vehicle.licensePlate,
        type: 'FUEL_COST_SPIKE',
        message: `Abnormal fuel cost detected for ${log.vehicle.licensePlate}: $${costPerLiter.toFixed(2)}/L vs avg $${avg.toFixed(2)}/L`,
        date: log.date
      });
    }
  }

  return anomalies;
}
