import { eq, fetchAll, fetchPage } from "../../../services/query";
import type { SortState } from "../../../shared/types/api";
import type { Meter, MeterStatus, Zone } from "../../../shared/types/models";

export interface MeterListParams {
  page: number;
  pageSize: number;
  sort: SortState;
  search: string;
  status: MeterStatus | "";
  zoneId: string; // "" = all zones
}

// Meters of every zone, filtered, sorted and paged on the server.
export const getAllMeters = (p: MeterListParams, signal?: AbortSignal) =>
  fetchPage<Meter>(
    "/meters",
    {
      page: p.page,
      perPage: p.pageSize,
      sort: p.sort,
      where: { zoneId: eq(p.zoneId), status: eq(p.status) },
      search: { term: p.search, fields: ["id", "ownerName", "zoneName"] },
    },
    signal,
  );

// For the zone filter dropdown.
export const getZoneOptions = (signal?: AbortSignal) =>
  fetchAll<Zone>(
    "/zones",
    { sort: { field: "name", direction: "asc" } },
    signal,
  );

interface DailyRow {
  zoneId: string;
  date: string;
  totalKwh: number;
}

export interface ZoneConsumptionPoint {
  zone: string;
  kwh: number;
}

const shiftDays = (isoDate: string, days: number): string => {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

// Total kWh per zone over the latest `days` days of data.
export async function getConsumptionByZone(
  days: number,
  signal?: AbortSignal,
): Promise<ZoneConsumptionPoint[]> {
  const latest = await fetchPage<DailyRow>(
    "/zoneDailyConsumption",
    { perPage: 1, sort: { field: "date", direction: "desc" } },
    signal,
  );
  if (latest.data.length === 0) return [];

  const to = latest.data[0].date;
  const from = shiftDays(to, -(days - 1));

  const [rows, zones] = await Promise.all([
    fetchAll<DailyRow>(
      "/zoneDailyConsumption",
      { where: { date: { gte: from, lte: to } } },
      signal,
    ),
    fetchAll<Zone>(
      "/zones",
      { sort: { field: "name", direction: "asc" } },
      signal,
    ),
  ]);

  const totals = new Map<string, number>();
  for (const row of rows)
    totals.set(row.zoneId, (totals.get(row.zoneId) ?? 0) + row.totalKwh);

  return zones.map((z) => ({
    zone: z.name,
    kwh: Math.round(totals.get(z.id) ?? 0),
  }));
}
