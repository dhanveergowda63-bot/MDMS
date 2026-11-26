export type ActiveStatus = "Active" | "Deactivated";
export type MeterStatus = "Active" | "Deactivated" | "Pending";
export type UserRole = "enterprise" | "zone_admin" | "customer";
export type AlertSeverity = "Critical" | "Warning" | "Info";
export type AlertStatus = "Open" | "Acknowledged" | "Resolved";
export type ConsumptionPeriod = "day" | "week" | "month" | "year";

export interface Zone {
  id: string;
  name: string;
  location: string;
  pincode: string;
  description: string;
  adminId: string;
  adminName: string;
  status: ActiveStatus;
  totalMeters: number;
  totalUsers: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  zoneId: string | null;
  status: ActiveStatus;
  joinedOn: string;
}

export interface Meter {
  id: string;
  ownerId: string;
  ownerName: string;
  zoneId: string;
  zoneName: string;
  address: string;
  status: MeterStatus;
  lastReadingKwh: number | null;
  lastReadingAt: string | null;
  installedDate: string;
  tariffCategory: "Domestic" | "Commercial" | "Industrial";
}

export interface Alert {
  id: string;
  meterId: string;
  zoneId: string;
  zoneName: string;
  type: string;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  resource: string;
  status: "Success" | "Failed";
}

export interface EnterpriseSettings {
  dataRetention: { meterReadingsMonths: number; alertsMonths: number };
  policies: { autoLogoutMinutes: number; auditLogRetentionDays: number };
  localisation: { timeZone: string; defaultLanguage: string; currency: string };
  notificationDefaults: { email: boolean; sms: boolean; inApp: boolean };
}

export interface ZoneConsumption {
  id: string;
  zoneId: string;
  zoneName: string;
  period: ConsumptionPeriod;
  label: string;
  avgKwh: number;
}
