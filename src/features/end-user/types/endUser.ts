// Data shapes used by the end-user pages. They match db.json
// (see the end-user section of scripts/generate-db.mjs).

export type BillStatus = "Paid" | "Pending" | "Overdue";

export interface Bill {
  id: string;
  customerId: string;
  zoneId: string;
  month: string; // "YYYY-MM", e.g. "2026-10"
  label: string; // "Oct 2026"
  unitsKwh: number;
  amount: number; // in Rs
  generatedOn: string; // YYYY-MM-DD, always the 1st of the next month
  dueDate: string; // YYYY-MM-DD
  status: BillStatus;
  paidOn: string | null; // only set when status is "Paid"
}

// One row per day inside a bill (the Bill details table).
export interface BillDay {
  id: string;
  billId: string;
  meterId: string;
  date: string; // YYYY-MM-DD
  readingKwh: number; // meter register at the end of the day
  consumptionKwh: number;
  cost: number; // in Rs
}

// Usage per hour for one day (the Day view of the dashboard chart).
export interface HourlyReading {
  id: string;
  meterId: string;
  date: string; // YYYY-MM-DD
  hour: string; // "00:00" to "23:00"
  consumptionKwh: number;
}

export type NotificationType =
  | "Bill generated"
  | "Payment received"
  | "Payment due soon"
  | "Payment overdue"
  | "High consumption"
  | "Maintenance";

// Named UserNotification because "Notification" already exists in the browser.
export interface UserNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string; // ISO date and time
  read: boolean;
}
