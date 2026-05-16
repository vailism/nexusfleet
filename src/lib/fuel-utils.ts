export interface FuelLogData {
  liters: number;
  cost: number;
  odometer: number;
}

export function calculateFuelEfficiency(currentLog: FuelLogData, previousLog?: FuelLogData) {
  if (!previousLog) {
    return {
      distance: 0,
      kmpl: 0, // Kilometers per liter
      costPerKm: 0,
    };
  }

  const distance = currentLog.odometer - previousLog.odometer;
  
  // Prevent division by zero or negative distance anomalies
  if (distance <= 0 || currentLog.liters <= 0) {
    return { distance: 0, kmpl: 0, costPerKm: 0 };
  }

  const kmpl = distance / currentLog.liters;
  const costPerKm = currentLog.cost / distance;

  return {
    distance,
    kmpl,
    costPerKm,
  };
}

export function aggregateMonthlyFuelStats(logs: { date: Date; liters: number; cost: number }[]) {
  // Reduces logs into a monthly summary
  const summary = logs.reduce((acc, log) => {
    const month = log.date.toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { month, totalLiters: 0, totalCost: 0 };
    }
    acc[month].totalLiters += log.liters;
    acc[month].totalCost += log.cost;
    return acc;
  }, {} as Record<string, { month: string; totalLiters: number; totalCost: number }>);

  return Object.values(summary);
}
