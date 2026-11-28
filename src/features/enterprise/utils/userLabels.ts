import type { UserRole } from "../../../shared/types/models";

export const roleLabels: Record<UserRole, string> = {
  enterprise: "Enterprise admin",
  zone_admin: "Zone admin",
  customer: "Consumer",
};
