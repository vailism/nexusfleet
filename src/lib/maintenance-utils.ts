export interface MaintenanceRecordData {
  date: Date;
  nextDueDate?: Date | null;
  cost: number;
}

export function calculateMaintenanceStatus(record: MaintenanceRecordData) {
  if (!record.nextDueDate) return { status: 'UNKNOWN', daysUntilDue: null };

  const now = new Date();
  const nextDue = new Date(record.nextDueDate);
  const diffTime = nextDue.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { status: 'OVERDUE', daysUntilDue: diffDays };
  } else if (diffDays <= 30) {
    return { status: 'UPCOMING', daysUntilDue: diffDays };
  } else {
    return { status: 'OK', daysUntilDue: diffDays };
  }
}

export function aggregateMaintenanceCosts(records: MaintenanceRecordData[]) {
  const currentYear = new Date().getFullYear();
  
  return records.reduce((acc, record) => {
    const recordYear = new Date(record.date).getFullYear();
    if (recordYear === currentYear) {
      return acc + record.cost;
    }
    return acc;
  }, 0);
}
