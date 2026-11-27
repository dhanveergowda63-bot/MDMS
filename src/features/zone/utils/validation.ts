import type { FormErrors } from "../../../shared/hooks/useForm";
import type { MeterFormValues } from "../types/zone";

const METER_ID_RE = /^M-\d{4,}$/;

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
