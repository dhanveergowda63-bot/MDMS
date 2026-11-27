import type { AppRole } from "../layout/menuConfig";

// TEMPORARY (Phase 1): there is no real login yet, so each role area acts as
// a fixed account from db.json. Replace with the logged-in user in Phase 2.
export interface DemoAccount {
  userId: string;
  name: string;
  email: string;
  zoneId: string | null;
}

export const demoAccounts: Record<AppRole, DemoAccount> = {
  // U-010 has one meter and 12 months of bills with daily rows (see generate-db.mjs).
  user: { userId: "U-010", name: "Aatmaja Ahuja", email: "aatmaja.ahuja10@example.com", zoneId: "ZN-001" },
  zone: { userId: "U-002", name: "Chatur Acharya", email: "chatur.acharya2@example.com", zoneId: "ZN-001" },
  enterprise: { userId: "U-001", name: "Divya Kapoor", email: "divya.kapoor1@example.com", zoneId: null },
};
