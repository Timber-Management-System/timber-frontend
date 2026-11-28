
// Delivery trip information

export type Trip = {
  id: string;
  receiptNo?: string;
  origin: string;
  vehicle: string;
  driver: string;
  date: string;

  // Log tracking
  logIds: string[];
  received: string[];
  rejected: string[];

  // Receiving status
  status: 'Pending' | 'In Progress' | 'Completed';
};


// Individual timber log information

export type Log = {
  id: string;
  treeId: string;
  species: string;

  // Log measurements
  diameter: number;
  length: number;
  volume: number;

  // Associated delivery trip
  tripId: string;
};


// Generate a stable demo receipt number

export function getReceiptNo(trip: Trip): string {
  if (trip.receiptNo) {
    return trip.receiptNo;
  }

  const year = trip.date.slice(0, 4);
  const number = trip.id.split('-').pop() ?? '0';

  return `RCV-${year}-${number.padStart(4, '0')}`;
}
