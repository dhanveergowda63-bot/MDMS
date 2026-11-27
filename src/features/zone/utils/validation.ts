import type { FormErrors } from "../../../shared/hooks/useForm";
import type { CustomerFormValues, MeterFormValues } from "../types/zone";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Indian mobile: optional +91, then 10 digits starting with 6-9
const PHONE_RE = /^(\+91[\s-]?)?[6-9]\d{9}$/;
const METER_ID_RE = /^M-\d{4,}$/;
const NAME_RE = /^[A-Za-z][A-Za-z .'-]*$/;

const today = () => new Date().toISOString().slice(0, 10);

export function validateMeterForm(v: MeterFormValues): FormErrors<MeterFormValues> {
  const errors: FormErrors<MeterFormValues> = {};
  const id = v.meterId.trim();
  if (!id) errors.meterId = "Meter ID is required.";
  else if (!METER_ID_RE.test(id)) errors.meterId = "Use the format M-1234.";

  if (!v.ownerId) errors.ownerId = "Choose the customer who owns this meter.";

  const address = v.address.trim();
  if (!address) errors.address = "Installation address is required.";
  else if (address.length < 5) errors.address = "Address is too short.";
  else if (address.length > 120) errors.address = "Keep the address under 120 characters.";

  if (!v.tariffCategory) errors.tariffCategory = "Choose a tariff category.";

  if (!v.installedDate) errors.installedDate = "Installation date is required.";
  else if (v.installedDate > today()) errors.installedDate = "Installation date cannot be in the future.";

  return errors;
}

export function validateCustomerForm(v: CustomerFormValues): FormErrors<CustomerFormValues> {
  const errors: FormErrors<CustomerFormValues> = {};
  const name = v.name.trim();
  if (!name) errors.name = "Full name is required.";
  else if (name.length < 2 || name.length > 60) errors.name = "Name must be 2 to 60 characters.";
  else if (!NAME_RE.test(name)) errors.name = "Use letters, spaces, dots, apostrophes or hyphens only.";

  const email = v.email.trim();
  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  const phone = v.phone.replace(/\s+/g, " ").trim();
  if (!phone) errors.phone = "Phone number is required.";
  else if (!PHONE_RE.test(phone)) errors.phone = "Enter a 10-digit mobile number, e.g. +91 9876543210.";

  return errors;
}
