import type { Alert } from "../types/enterprise";
import { fetchList } from "./query";
import type { ListParams } from "./query";

// filters: { zoneId, severity, status }
export const getAlerts = (params?: ListParams) =>
  fetchList<Alert>("/alerts", params);
