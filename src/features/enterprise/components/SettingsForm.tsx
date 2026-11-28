import { RotateCcw, Save } from "lucide-react";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/forms/Input";
import Select from "../../../shared/components/forms/Select";
import type { SelectOption } from "../../../shared/components/forms/Select";
import Toggle from "../../../shared/components/forms/Toggle";
import { useToast } from "../../../shared/components/feedback/toast-context";
import { useForm } from "../../../shared/hooks/useForm";
import type { EnterpriseSettings } from "../types/enterprise";
import { validateSettings } from "../utils/settingsValidation";
import type { SettingsFormValues } from "../utils/settingsValidation";

const timeZones: SelectOption[] = [
  { value: "Asia/Kolkata", label: "India Standard Time (Asia/Kolkata)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (Asia/Dubai)" },
  { value: "Asia/Singapore", label: "Singapore Time (Asia/Singapore)" },
  { value: "Europe/London", label: "London (Europe/London)" },
  { value: "America/New_York", label: "Eastern Time (America/New_York)" },
  { value: "UTC", label: "UTC" },
];
const languages: SelectOption[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "kn", label: "Kannada" },
];
const currencies: SelectOption[] = [
  { value: "INR", label: "Indian rupee (INR)" },
  { value: "USD", label: "US dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "AED", label: "UAE dirham (AED)" },
];

// Keeps a value that came from the server selectable even if it is not in the list.
const withCurrent = (options: SelectOption[], value: string): SelectOption[] =>
  options.some((o) => o.value === value)
    ? options
    : [...options, { value, label: value }];

const toFormValues = (s: EnterpriseSettings): SettingsFormValues => ({
  meterReadingsMonths: String(s.dataRetention.meterReadingsMonths),
  alertsMonths: String(s.dataRetention.alertsMonths),
  autoLogoutMinutes: String(s.policies.autoLogoutMinutes),
  auditLogRetentionDays: String(s.policies.auditLogRetentionDays),
  timeZone: s.localisation.timeZone,
  defaultLanguage: s.localisation.defaultLanguage,
  currency: s.localisation.currency,
  email: s.notificationDefaults.email,
  sms: s.notificationDefaults.sms,
  inApp: s.notificationDefaults.inApp,
});

const unit = (text: string) => (
  <span className="field__adornment field__unit">{text}</span>
);

// Phase 1 is read-only: the form validates but nothing is saved yet.
const NOT_SAVED_NOTE = "Saving to the server comes in Phase 2.";

export default function SettingsForm({
  settings,
}: {
  settings: EnterpriseSettings;
}) {
  const { showToast } = useToast();
  const initial = toFormValues(settings);
  const { values, errors, setField, handleSubmit, reset } =
    useForm<SettingsFormValues>(initial, validateSettings);

  const submit = handleSubmit(() =>
    showToast(`Settings are valid. ${NOT_SAVED_NOTE}`, "info"),
  );

  return (
    <form className="page" onSubmit={submit} noValidate>
      <section className="card">
        <h2 className="card__title">Data retention</h2>
        <div className="form-grid">
          <Input
            label="Keep meter readings for"
            type="number"
            min={1}
            inputMode="numeric"
            value={values.meterReadingsMonths}
            onChange={(e) => setField("meterReadingsMonths", e.target.value)}
            error={errors.meterReadingsMonths}
            endAdornment={unit("months")}
          />
          <Input
            label="Keep alerts for"
            type="number"
            min={1}
            inputMode="numeric"
            value={values.alertsMonths}
            onChange={(e) => setField("alertsMonths", e.target.value)}
            error={errors.alertsMonths}
            endAdornment={unit("months")}
          />
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">Policies and rules</h2>
        <div className="form-grid">
          <Input
            label="Auto-logout after inactivity"
            type="number"
            min={5}
            inputMode="numeric"
            value={values.autoLogoutMinutes}
            onChange={(e) => setField("autoLogoutMinutes", e.target.value)}
            error={errors.autoLogoutMinutes}
            endAdornment={unit("minutes")}
          />
          <Input
            label="Keep audit logs for"
            type="number"
            min={30}
            inputMode="numeric"
            value={values.auditLogRetentionDays}
            onChange={(e) => setField("auditLogRetentionDays", e.target.value)}
            error={errors.auditLogRetentionDays}
            endAdornment={unit("days")}
          />
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">Localisation</h2>
        <div className="form-grid">
          <Select
            label="Time zone"
            options={withCurrent(timeZones, values.timeZone)}
            placeholder="Select a time zone"
            value={values.timeZone}
            onChange={(e) => setField("timeZone", e.target.value)}
            error={errors.timeZone}
          />
          <Select
            label="Default language"
            options={withCurrent(languages, values.defaultLanguage)}
            placeholder="Select a language"
            value={values.defaultLanguage}
            onChange={(e) => setField("defaultLanguage", e.target.value)}
            error={errors.defaultLanguage}
          />
          <Select
            label="Currency"
            options={withCurrent(currencies, values.currency)}
            placeholder="Select a currency"
            value={values.currency}
            onChange={(e) => setField("currency", e.target.value)}
            error={errors.currency}
          />
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">Notification defaults</h2>
        <Toggle
          label="Email"
          description="Default for new zones: send alerts by email."
          checked={values.email}
          onChange={(v) => setField("email", v)}
        />
        <Toggle
          label="SMS"
          description="Default for new zones: send critical alerts by SMS."
          checked={values.sms}
          onChange={(v) => setField("sms", v)}
        />
        <Toggle
          label="In-app"
          description="Default for new zones: show alerts under the bell icon."
          checked={values.inApp}
          onChange={(v) => setField("inApp", v)}
        />
        {errors.inApp && (
          <p className="field__error" role="alert">
            {errors.inApp}
          </p>
        )}
      </section>

      <div className="row" style={{ justifyContent: "flex-end" }}>
        <Button icon={<RotateCcw size={16} />} onClick={() => reset(initial)}>
          Reset changes
        </Button>
        <Button variant="primary" type="submit" icon={<Save size={16} />}>
          Save settings
        </Button>
      </div>
    </form>
  );
}
