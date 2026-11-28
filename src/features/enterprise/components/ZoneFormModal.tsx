import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Modal from "../../../shared/components/feedback/Modal";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/forms/Input";
import Select from "../../../shared/components/forms/Select";
import { useApi } from "../../../shared/hooks/useApi";
import { getZoneAdmins } from "../services/adminService";
import { emptyZoneForm, validateZone } from "../utils/zoneValidation";
import type { ZoneFormErrors, ZoneFormValues } from "../utils/zoneValidation";
import type { Zone } from "../../../shared/types/models";

const FORM_ID = "zone-form";

interface ZoneFormProps {
  zone: Zone | null;
  onValid: (values: ZoneFormValues) => void;
}

function ZoneForm({ zone, onValid }: ZoneFormProps) {
  const [values, setValues] = useState<ZoneFormValues>(
    zone
      ? {
          name: zone.name,
          adminId: zone.adminId,
          location: zone.location,
          pincode: zone.pincode,
          description: zone.description,
        }
      : emptyZoneForm,
  );
  const [errors, setErrors] = useState<ZoneFormErrors>({});
  const admins = useApi(getZoneAdmins, "zone-admins");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateZone(values);
    setErrors(found);
    if (Object.keys(found).length === 0) onValid(values);
  };

  const adminOptions = (admins.data ?? []).map((a) => ({
    value: a.id,
    label: a.name,
  }));

  return (
    <form id={FORM_ID} onSubmit={handleSubmit} noValidate>
      <Input
        label="Zone name"
        name="name"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
      />
      <Select
        label="Zone admin"
        name="adminId"
        value={values.adminId}
        onChange={handleChange}
        options={adminOptions}
        placeholder={admins.loading ? "Loading admins…" : "Select an admin"}
        error={errors.adminId}
      />
      <Input
        label="Location"
        name="location"
        value={values.location}
        onChange={handleChange}
        error={errors.location}
      />
      <Input
        label="Pincode"
        name="pincode"
        inputMode="numeric"
        maxLength={6}
        value={values.pincode}
        onChange={handleChange}
        error={errors.pincode}
      />
      <div className="field">
        <label htmlFor="zone-description" className="field__label">
          Description
        </label>
        <textarea
          id="zone-description"
          name="description"
          rows={3}
          className={`field__input ${errors.description ? "field__input--error" : ""}`}
          value={values.description}
          onChange={handleChange}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="field__error" role="alert">
            {errors.description}
          </p>
        )}
      </div>
    </form>
  );
}

interface ZoneFormModalProps {
  open: boolean;
  zone: Zone | null; // null = add a new zone
  onClose: () => void;
  onValid: (values: ZoneFormValues) => void;
}

// Phase 1: validation only. Saving the zone comes in a later phase.
export default function ZoneFormModal({
  open,
  zone,
  onClose,
  onValid,
}: ZoneFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={zone ? `Edit ${zone.name}` : "Add zone"}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" form={FORM_ID} variant="primary">
            {zone ? "Save changes" : "Add zone"}
          </Button>
        </>
      }
    >
      <ZoneForm key={zone?.id ?? "new"} zone={zone} onValid={onValid} />
    </Modal>
  );
}
