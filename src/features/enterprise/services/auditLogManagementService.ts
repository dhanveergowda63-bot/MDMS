import { eq, fetchAll, fetchPage } from "../../../services/query";
import type { Condition } from "../../../services/query";
import type { SortState } from "../../../shared/types/api";
import type { User } from "../../../shared/types/models";

export type AuditStatus = "Success" | "Failed";

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  resource: string;
  status: AuditStatus;
}

export interface AuditLogParams {
  page: number;
  pageSize: number;
  sort: SortState;
  search: string;
  userId: string; // "" = all users
  status: AuditStatus | "";
  from: string; // yyyy-mm-dd or ""
  to: string; // yyyy-mm-dd or ""
}

// Turns the two date inputs into a range condition on the ISO timestamp.
const timestampRange = (from: string, to: string): Condition | undefined => {
  if (!from && !to) return undefined;
  const range: Condition = {};
  if (from) range.gte = `${from}T00:00:00.000Z`;
  if (to) range.lte = `${to}T23:59:59.999Z`;
  return range;
};

export const getAuditLogs = (p: AuditLogParams, signal?: AbortSignal) =>
  fetchPage<AuditLog>(
    "/auditLogs",
    {
      page: p.page,
      perPage: p.pageSize,
      sort: p.sort,
      where: {
        userId: eq(p.userId),
        status: eq(p.status),
        timestamp: timestampRange(p.from, p.to),
      },
      search: {
        term: p.search,
        fields: ["id", "userName", "action", "resource"],
      },
    },
    signal,
  );

// People who can appear in the log (admins), for the user filter.
export const getAuditUsers = (signal?: AbortSignal) =>
  fetchAll<User>(
    "/users",
    {
      where: { role: { in: ["zone_admin", "enterprise"] } },
      sort: { field: "name", direction: "asc" },
    },
    signal,
  );
