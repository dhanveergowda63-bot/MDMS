import { eq, fetchPage } from "../../../services/query";
import type { SortState } from "../../../shared/types/api";
import type {
  Alert,
  AlertSeverity,
  AlertStatus,
} from "../../../shared/types/models";

export interface AlertListParams {
  page: number;
  pageSize: number;
  sort: SortState;
  search: string;
  severity: AlertSeverity | "";
  status: AlertStatus | "";
  zoneId: string; // "" = all zones
}

// Alerts from every zone, filtered, sorted and paged on the server.
export const getAllAlerts = (p: AlertListParams, signal?: AbortSignal) =>
  fetchPage<Alert>(
    "/alerts",
    {
      page: p.page,
      perPage: p.pageSize,
      sort: p.sort,
      where: {
        zoneId: eq(p.zoneId),
        severity: eq(p.severity),
        status: eq(p.status),
      },
      search: { term: p.search, fields: ["id", "meterId", "type", "zoneName"] },
    },
    signal,
  );
