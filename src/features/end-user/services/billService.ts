import { eq, fetchAll, fetchOne, fetchPage } from "../../../services/query";
import type { Paginated } from "../../../shared/types/api";
import type { Bill, BillDay, BillStatus } from "../types/endUser";

export interface BillListQuery {
  page: number;
  perPage: number;
  status?: BillStatus | ""; // "" means all statuses
}

// One page of a customer's bills, newest first (Bills & Payments table).
export const getBills = (
  customerId: string,
  query: BillListQuery,
  signal?: AbortSignal,
): Promise<Paginated<Bill>> =>
  fetchPage<Bill>(
    "/bills",
    {
      page: query.page,
      perPage: query.perPage,
      sort: { field: "month", direction: "desc" },
      where: { customerId: eq(customerId), status: eq(query.status) },
    },
    signal,
  );

// The latest `count` bills, oldest first (dashboard cards and Year chart).
export const getRecentBills = async (
  customerId: string,
  count: number,
  signal?: AbortSignal,
): Promise<Bill[]> => {
  const page = await fetchPage<Bill>(
    "/bills",
    {
      perPage: count,
      sort: { field: "month", direction: "desc" },
      where: { customerId: eq(customerId) },
    },
    signal,
  );
  return [...page.data].reverse();
};

// Bills that still have to be paid (outstanding balance).
export const getUnpaidBills = (customerId: string, signal?: AbortSignal) =>
  fetchAll<Bill>(
    "/bills",
    { where: { customerId: eq(customerId), status: { in: ["Pending", "Overdue"] } } },
    signal,
  );

// The most recent payment, or null if the customer never paid.
export const getLastPaidBill = async (
  customerId: string,
  signal?: AbortSignal,
): Promise<Bill | null> => {
  const page = await fetchPage<Bill>(
    "/bills",
    {
      perPage: 1,
      sort: { field: "paidOn", direction: "desc" },
      where: { customerId: eq(customerId), status: eq("Paid") },
    },
    signal,
  );
  return page.data[0] ?? null;
};

// A single bill (Bill details summary).
export const getBill = (billId: string, signal?: AbortSignal) =>
  fetchOne<Bill>(`/bills/${encodeURIComponent(billId)}`, signal);

// Every day inside a bill, in date order (Bill details table).
export const getBillDays = (billId: string, signal?: AbortSignal) =>
  fetchAll<BillDay>(
    "/billDays",
    { where: { billId: eq(billId) }, sort: { field: "date", direction: "asc" } },
    signal,
  );
