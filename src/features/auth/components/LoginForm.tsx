import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import Input from "../../../shared/components/forms/Input";
import PasswordField from "../../../shared/components/forms/PasswordField";
import Checkbox from "../../../shared/components/forms/Checkbox";
import { validateLogin } from "../utils/validation";
import type { LoginFormErrors, LoginFormValues } from "../types/auth";
import "./auth.css";

const initialValues: LoginFormValues = {
  email: "",
  password: "",
  remember: false,
};

export default function LoginForm() {
  const [values, setValues] = useState<LoginFormValues>(initialValues);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [valid, setValid] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setValid(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateLogin(values);
    setErrors(found);
    setValid(Object.keys(found).length === 0);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="user@gmail.com"
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />
      <PasswordField
        label="Password"
        name="password"
        autoComplete="current-password"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
      />

      <div className="auth-row">
        <Checkbox
          label="Remember me"
          name="remember"
          checked={values.remember}
          onChange={handleChange}
        />
        <Link to="/forgot-password" className="auth-link">
          Forgot password?
        </Link>
      </div>

      <button type="submit" className="auth-btn">
        Login
      </button>

      {valid && (
        <p className="auth-info">
          Form is valid. Real login comes in a later phase, so use the role
          links below.
        </p>
      )}
    </form>
  );
}
