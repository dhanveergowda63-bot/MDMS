import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import CheckEmailPanel from "../components/CheckEmailPanel";

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  return sentTo ? (
    <AuthLayout title="Check your email">
      <CheckEmailPanel email={sentTo} />
    </AuthLayout>
  ) : (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we will send you a reset link"
    >
      <ForgotPasswordForm onSent={setSentTo} />
    </AuthLayout>
  );
}
