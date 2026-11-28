export interface ZoneFormValues {
  name: string;
  adminId: string;
  location: string;
  pincode: string;
  description: string;
}

export type ZoneFormErrors = Partial<Record<keyof ZoneFormValues, string>>;

export const emptyZoneForm: ZoneFormValues = {
  name: "",
  adminId: "",
  location: "",
  pincode: "",
  description: "",
};

export function validateZone(values: ZoneFormValues): ZoneFormErrors {
  const errors: ZoneFormErrors = {};

  if (!values.name.trim()) errors.name = "Zone name is required";
  else if (values.name.trim().length < 3)
    errors.name = "Zone name must be at least 3 characters";

  if (!values.adminId) errors.adminId = "Select an admin for this zone";

  if (!values.location.trim()) errors.location = "Location is required";

  if (!values.pincode.trim()) errors.pincode = "Pincode is required";
  else if (!/^\d{6}$/.test(values.pincode.trim()))
    errors.pincode = "Pincode must be 6 digits";

  if (!values.description.trim())
    errors.description = "Description is required";
  else if (values.description.trim().length > 200)
    errors.description = "Keep the description under 200 characters";

  return errors;
}
