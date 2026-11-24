import { Link } from "react-router-dom";
import "./auth.css";

const roles = [
  { label: "End-user", to: "/user/dashboard" },
  { label: "Zone admin", to: "/zone/dashboard" },
  { label: "Enterprise", to: "/enterprise/dashboard" },
];

// TEMPORARY: remove when real login and role checks are added
export default function RoleSwitcher() {
  return (
    <div className="role-switcher">
      <p className="role-switcher__title">
        Temporary role links (Phase 1 only)
      </p>
      <div className="role-switcher__links">
        {roles.map((role) => (
          <Link key={role.to} to={role.to} className="auth-link">
            {role.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
