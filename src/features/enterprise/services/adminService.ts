import { eq, fetchAll } from "../../../services/query";
import type { User } from "../../../shared/types/models";

// Zone admins, used to pick the admin in the zone form
export const getZoneAdmins = (signal?: AbortSignal): Promise<User[]> =>
  fetchAll<User>(
    "/users",
    {
      where: { role: eq("zone_admin") },
      sort: { field: "name", direction: "asc" },
    },
    signal,
  );
