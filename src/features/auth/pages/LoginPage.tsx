import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/LoginForm";
import RoleSwitcher from "../components/RoleSwitcher";

export default function LoginPage() {
  return (
    <AuthLayout title="Login" subtitle="Sign in to your MDMS account">
      <LoginForm />
      <RoleSwitcher />
    </AuthLayout>
  );
}
