import type { AuditLog } from "../types/enterprise";
import { fetchList } from "./query";
import type { ListParams } from "./query";

// filters: { userId, status, [rangeKey("timestamp","gte")]: "2026-11-01" }
export const getAuditLogs = (params?: ListParams) =>
  fetchList<AuditLog>("/auditLogs", params);
