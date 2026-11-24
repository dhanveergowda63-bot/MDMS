import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

interface CheckEmailPanelProps {
  email: string;
}

export default function CheckEmailPanel({ email }: CheckEmailPanelProps) {
  const [resent, setResent] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <p className="auth-message">
        We sent a password reset link to <strong>{email}</strong>. Open it to
        choose a new password.
      </p>

      <button
        type="button"
        className="auth-btn"
        onClick={() => setResent(true)}
      >
        Resend link
      </button>
      {resent && <p className="auth-info">Reset link sent again.</p>}

      <div className="auth-center">
        <Link to="/login" className="auth-link">
          Back to Login
        </Link>
      </div>

      {/* TEMPORARY: stands in for the link that will arrive by email */}
      <button
        type="button"
        className="auth-btn auth-btn--secondary"
        onClick={() => navigate("/reset-password/demo-token")}
      >
        Demo: open reset link
      </button>
    </div>
  );
}
