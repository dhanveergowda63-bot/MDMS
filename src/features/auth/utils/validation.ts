import type {
  LoginFormErrors,
  LoginFormValues,
  ResetPasswordErrors,
  ResetPasswordValues,
} from "../types/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required";
  if (!EMAIL_PATTERN.test(email.trim())) return "Enter a valid email address";
  return undefined;
}

export function validateLogin(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {};

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}

export const passwordRules = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (p: string) => p.length >= 8,
  },
  {
    id: "upper",
    label: "One uppercase letter",
    test: (p: string) => /[A-Z]/.test(p),
  },
  {
    id: "lower",
    label: "One lowercase letter",
    test: (p: string) => /[a-z]/.test(p),
  },
  { id: "number", label: "One number", test: (p: string) => /\d/.test(p) },
  {
    id: "special",
    label: "One special character",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
];

export function validateReset(
  values: ResetPasswordValues,
): ResetPasswordErrors {
  const errors: ResetPasswordErrors = {};

  if (!values.password) {
    errors.password = "New password is required";
  } else if (!passwordRules.every((rule) => rule.test(values.password))) {
    errors.password = "Password does not meet all the rules below";
  }

  if (!values.confirm) {
    errors.confirm = "Please confirm your password";
  } else if (values.confirm !== values.password) {
    errors.confirm = "Passwords do not match";
  }

  return errors;
}
