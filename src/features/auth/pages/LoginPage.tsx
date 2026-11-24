import { useState } from "react";
import Input from "../../../shared/components/forms/Input";
import PasswordField from "../../../shared/components/forms/PasswordField";
import Checkbox from "../../../shared/components/forms/Checkbox";

export default function LoginPage() {
  const [remember, setRemember] = useState(false);
  return (
    <div style={{ maxWidth: 360, margin: "60px auto" }}>
      <Input label="Email" type="email" placeholder="you@example.com" />
      <PasswordField label="Password" error="Password is required" />
      <Checkbox label="Remember me" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
    </div>
  );
}