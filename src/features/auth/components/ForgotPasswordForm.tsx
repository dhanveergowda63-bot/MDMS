import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import Input from "../../../shared/components/forms/Input";
import { validateEmail } from "../utils/validation";
import "./auth.css";

interface ForgotPasswordFormProps {
  onSent: (email: string) => void;
}

export default function ForgotPasswordForm({
  onSent,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateEmail(email);
    setError(found);
    if (!found) onSent(email.trim());
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="user@gmail.com"
        autoComplete="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError(undefined);
        }}
        error={error}
      />
      <button type="submit" className="auth-btn">
        Send reset link
      </button>
      <div className="auth-center">
        <Link to="/login" className="auth-link">
          Back to Login
        </Link>
      </div>
    </form>
  );
}
