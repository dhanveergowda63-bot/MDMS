import type { FormErrors } from "../../../shared/hooks/useForm";

// Numbers are kept as text while the person types, and checked on submit.
export interface SettingsFormValues {
  meterReadingsMonths: string;
  alertsMonths: string;
  autoLogoutMinutes: string;
  auditLogRetentionDays: string;
  timeZone: string;
  defaultLanguage: string;
  currency: string;
  email: boolean;
  sms: boolean;
  inApp: boolean;
}

const wholeNumber = (
  value: string,
  label: string,
  min: number,
  max: number,
): string | undefined => {
  const text = value.trim();
  if (!text) return `${label} is required.`;
  if (!/^\d+$/.test(text)) return `${label} must be a whole number.`;
  const n = Number(text);
  if (n < min || n > max) return `${label} must be between ${min} and ${max}.`;
  return undefined;
};

export function validateSettings(
  v: SettingsFormValues,
): FormErrors<SettingsFormValues> {
  const errors: FormErrors<SettingsFormValues> = {};

  errors.meterReadingsMonths = wholeNumber(
    v.meterReadingsMonths,
    "Meter readings retention",
    1,
    120,
  );
  errors.alertsMonths = wholeNumber(v.alertsMonths, "Alerts retention", 1, 120);
  errors.autoLogoutMinutes = wholeNumber(
    v.autoLogoutMinutes,
    "Auto-logout timer",
    5,
    480,
  );
  errors.auditLogRetentionDays = wholeNumber(
    v.auditLogRetentionDays,
    "Audit-log retention",
    30,
    3650,
  );

  if (!v.timeZone) errors.timeZone = "Choose a time zone.";
  if (!v.defaultLanguage) errors.defaultLanguage = "Choose a default language.";
  if (!v.currency) errors.currency = "Choose a currency.";

  if (!v.email && !v.sms && !v.inApp)
    errors.inApp = "Keep at least one notification channel on.";

  return errors;
}
