import { eq, fetchAll, fetchOne } from "../../../services/query";
import type { Meter, MeterReading, User } from "../../../shared/types/models";
import type { HourlyReading } from "../types/endUser";

// The logged-in customer (name for the welcome banner).
export const getCustomer = (userId: string, signal?: AbortSignal) =>
  fetchOne<User>(`/users/${encodeURIComponent(userId)}`, signal);

// Meters the customer owns (meter number and zone name for the banner).
export const getCustomerMeters = (customerId: string, signal?: AbortSignal) =>
  fetchAll<Meter>("/meters", { where: { ownerId: eq(customerId) } }, signal);

// Daily readings of one meter between two dates, both included (YYYY-MM-DD).
export const getDailyReadings = (
  meterId: string,
  from: string,
  to: string,
  signal?: AbortSignal,
) =>
  fetchAll<MeterReading>(
    "/meterReadings",
    {
      where: { meterId: eq(meterId), date: { gte: from, lte: to } },
      sort: { field: "date", direction: "asc" },
    },
    signal,
  );

// Hourly usage of one meter on one day (dashboard Day view).
export const getHourlyReadings = (
  meterId: string,
  date: string,
  signal?: AbortSignal,
) =>
  fetchAll<HourlyReading>(
    "/hourlyReadings",
    {
      where: { meterId: eq(meterId), date: eq(date) },
      sort: { field: "hour", direction: "asc" },
    },
    signal,
  );
