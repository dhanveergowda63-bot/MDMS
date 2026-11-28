import { eq, fetchCount, fetchPage } from "../../../services/query";
import type { Alert } from "../../../shared/types/models";
import { getConsumptionByZone } from "./meterManagementService";
import type { ZoneConsumptionPoint } from "./meterManagementService";

export const countZones = (signal?: AbortSignal) => fetchCount("/zones", {}, signal);

export const countAllMeters = (signal?: AbortSignal) => fetchCount("/meters", {}, signal);

// Critical alerts that are still open or acknowledged.
export const countCriticalAlerts = (signal?: AbortSignal) =>
  fetchCount("/alerts", { severity: eq("Critical"), status: { ne: "Resolved" } }, signal);

export const getRecentCriticalAlerts = async (limit: number, signal?: AbortSignal): Promise<Alert[]> => {
  const page = await fetchPage<Alert>(
    "/alerts",
    {
      perPage: limit,
      sort: { field: "createdAt", direction: "desc" },
      where: { severity: eq("Critical"), status: { ne: "Resolved" } },
    },
    signal,
  );
  return page.data;
};

// Average kWh per day for each zone over the latest `days` days.
export async function getAverageDailyByZone(
  days: number,
  signal?: AbortSignal,
): Promise<ZoneConsumptionPoint[]> {
  const totals = await getConsumptionByZone(days, signal);
  return totals.map((t) => ({ zone: t.zone, kwh: Math.round((t.kwh / days) * 10) / 10 }));
}