import type { ReactNode } from "react";
import "./auth.css";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <header className="auth-page__brand">MDMS</header>
      <main className="auth-card">
        <h1 className="auth-card__title">{title}</h1>
        {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
        {children}
      </main>
    </div>
  );
}
