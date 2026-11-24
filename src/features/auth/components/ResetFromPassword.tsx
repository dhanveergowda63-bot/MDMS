import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import PasswordField from "../../../shared/components/forms/PasswordField";
import { passwordRules, validateReset } from "../utils/validation";
import type { ResetPasswordErrors, ResetPasswordValues } from "../types/auth";
import "./auth.css";

interface ResetPasswordFormProps {
  onDone: () => void;
}

export default function ResetPasswordForm({ onDone }: ResetPasswordFormProps) {
  const [values, setValues] = useState<ResetPasswordValues>({
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<ResetPasswordErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateReset(values);
    setErrors(found);
    if (Object.keys(found).length === 0) onDone();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <PasswordField
        label="New password"
        name="password"
        autoComplete="new-password"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
      />

      <ul className="auth-rules">
        {passwordRules.map((rule) => (
          <li
            key={rule.id}
            className={rule.test(values.password) ? "auth-rules__ok" : ""}
          >
            {rule.label}
          </li>
        ))}
      </ul>

      <PasswordField
        label="Confirm password"
        name="confirm"
        autoComplete="new-password"
        value={values.confirm}
        onChange={handleChange}
        error={errors.confirm}
      />

      <button type="submit" className="auth-btn">
        Reset password
      </button>
    </form>
  );
}
