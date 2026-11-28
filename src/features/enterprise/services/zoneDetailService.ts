import { eq, fetchCount, fetchPage } from "../../../services/query";
import type { SortState } from "../../../shared/types/api";
import type {
  Meter,
  MeterStatus,
  User,
  UserStatus,
} from "../../../shared/types/models";

export interface ZoneListParams<S extends string> {
  page: number;
  pageSize: number;
  sort: SortState;
  search: string;
  status: S | "";
}

export const getMetersOfZone = (
  zoneId: string,
  p: ZoneListParams<MeterStatus>,
  signal?: AbortSignal,
) =>
  fetchPage<Meter>(
    "/meters",
    {
      page: p.page,
      perPage: p.pageSize,
      sort: p.sort,
      where: { zoneId: eq(zoneId), status: eq(p.status) },
      search: { term: p.search, fields: ["id", "ownerName"] },
    },
    signal,
  );

export const getCustomersOfZone = (
  zoneId: string,
  p: ZoneListParams<UserStatus>,
  signal?: AbortSignal,
) =>
  fetchPage<User>(
    "/users",
    {
      page: p.page,
      perPage: p.pageSize,
      sort: p.sort,
      where: { role: eq("customer"), zoneId: eq(zoneId), status: eq(p.status) },
      search: { term: p.search, fields: ["id", "name", "email", "phone"] },
    },
    signal,
  );

export const countMetersOfZone = (
  zoneId: string,
  status?: MeterStatus,
  signal?: AbortSignal,
) => fetchCount("/meters", { zoneId: eq(zoneId), status: eq(status) }, signal);

export const countOpenAlertsOfZone = (zoneId: string, signal?: AbortSignal) =>
  fetchCount("/alerts", { zoneId: eq(zoneId), status: eq("Open") }, signal);
