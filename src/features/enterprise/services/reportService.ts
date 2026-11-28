import { fetchAll, fetchPage } from "../../../services/query";
import type { Zone } from "../../../shared/types/models";
import { formatShortDate } from "../../../shared/utils/format";

export type ComparePeriod = "7d" | "4w" | "12w";

// How many days to look back, and how many days go into one group of bars.
const periodConfig: Record<ComparePeriod, { days: number; bucket: number }> = {
  "7d": { days: 7, bucket: 1 },
  "4w": { days: 28, bucket: 7 },
  "12w": { days: 84, bucket: 7 },
};

// One group of bars: `label` plus one number per zone id (kWh).
export type ComparisonRow = Record<string, string | number>;

export interface ZoneComparison {
  zones: { id: string; name: string }[];
  rows: ComparisonRow[];
}

interface DailyRow {
  zoneId: string;
  date: string;
  totalKwh: number;
}

const DAY_MS = 86_400_000;
const toTime = (isoDate: string) => Date.parse(`${isoDate}T00:00:00Z`);
const shiftDays = (isoDate: string, days: number) =>
  new Date(toTime(isoDate) + days * DAY_MS).toISOString().slice(0, 10);

// Total kWh per zone for each group of days in the period (oldest group first).
export async function getZoneComparison(
  period: ComparePeriod,
  signal?: AbortSignal,
): Promise<ZoneComparison> {
  const { days, bucket } = periodConfig[period];

  const latest = await fetchPage<DailyRow>(
    "/zoneDailyConsumption",
    { perPage: 1, sort: { field: "date", direction: "desc" } },
    signal,
  );
  if (latest.data.length === 0) return { zones: [], rows: [] };

  const to = latest.data[0].date;
  const from = shiftDays(to, -(days - 1));

  const [daily, zoneList] = await Promise.all([
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

  const rows: ComparisonRow[] = Array.from(
    { length: days / bucket },
    (_, i) => {
      const row: ComparisonRow = {
        label: formatShortDate(shiftDays(from, i * bucket)),
      };
      for (const z of zoneList) row[z.id] = 0;
      return row;
    },
  );

  for (const d of daily) {
    const index = Math.floor((toTime(d.date) - toTime(from)) / DAY_MS / bucket);
    const row = rows[index];
    if (row && typeof row[d.zoneId] === "number") {
      row[d.zoneId] =
        Math.round(((row[d.zoneId] as number) + d.totalKwh) * 10) / 10;
    }
  }

  return { zones: zoneList.map((z) => ({ id: z.id, name: z.name })), rows };
}
