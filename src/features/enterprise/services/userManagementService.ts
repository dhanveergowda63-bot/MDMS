import { eq, fetchCount, fetchPage } from "../../../services/query";
import type { SortState } from "../../../shared/types/api";
import type { User, UserRole, UserStatus } from "../../../shared/types/models";

export interface UserListParams {
  roles: UserRole[];
  page: number;
  pageSize: number;
  sort: SortState;
  search: string;
  status: UserStatus | "";
  zoneId: string; // "" = all zones
}

// Users of the given roles across all zones, filtered, sorted and paged on the server.
export const getUsersByRole = (p: UserListParams, signal?: AbortSignal) =>
  fetchPage<User>(
    "/users",
    {
      page: p.page,
      perPage: p.pageSize,
      sort: p.sort,
      where: {
        role: { in: p.roles },
        status: eq(p.status),
        zoneId: eq(p.zoneId),
      },
      search: { term: p.search, fields: ["id", "name", "email", "phone"] },
    },
    signal,
  );

export interface UserSplit {
  active: number;
  deactivated: number;
}

// Active and deactivated users that joined up to the end of `year`.
export async function getUserSplit(
  year: number,
  signal?: AbortSignal,
): Promise<UserSplit> {
  const joined = { lte: `${year}-12-31` };
  const [active, deactivated] = await Promise.all([
    fetchCount("/users", { joinedOn: joined, status: eq("Active") }, signal),
    fetchCount(
      "/users",
      { joinedOn: joined, status: eq("Deactivated") },
      signal,
    ),
  ]);
  return { active, deactivated };
}
