import { createBrowserRouter, Navigate } from "react-router-dom";
import type { ComponentType } from "react";
import ServerError from "../shared/pages/ServerError";

// Turns a dynamic import into a lazy-loaded route
const page = (load: () => Promise<{ default: ComponentType }>) => ({
  lazy: async () => ({ Component: (await load()).default }),
});

const router = createBrowserRouter([
  {
    errorElement: <ServerError />,
    children: [
      { path: "/", element: <Navigate to="/login" replace /> },

      // Auth
      {
        path: "/login",
        ...page(() => import("../features/auth/pages/LoginPage")),
      },
      {
        path: "/forgot-password",
        ...page(() => import("../features/auth/pages/ForgotPasswordPage")),
      },
      {
        path: "/reset-password/:token",
        ...page(() => import("../features/auth/pages/ResetPasswordPage")),
      },

      // End-user
      {
        path: "/user/dashboard",
        ...page(() => import("../features/end-user/pages/Dashboard")),
      },

      // Zone admin
      {
        path: "/zone/dashboard",
        ...page(() => import("../features/zone/pages/ZoneDashboard")),
      },

      // Enterprise
      {
        path: "/enterprise/dashboard",
        ...page(
          () => import("../features/enterprise/pages/EnterpriseDashboard"),
        ),
      },

      // Unknown addresses
      { path: "*", ...page(() => import("../shared/pages/NotFound")) },
    ],
  },
]);

export default router;
