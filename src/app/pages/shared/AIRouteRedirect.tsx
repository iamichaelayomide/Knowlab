import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { openFloatingAI } from "../../services/aiWidget";

export default function AIRouteRedirect() {
  const location = useLocation();

  useEffect(() => {
    const prefill = (location.state as { prefill?: string } | null)?.prefill;
    openFloatingAI(prefill);
  }, [location.state]);

  if (location.pathname.startsWith("/supervisor")) {
    return <Navigate to="/supervisor/dashboard" replace />;
  }
  if (location.pathname.startsWith("/hod")) {
    return <Navigate to="/hod/dashboard" replace />;
  }
  return <Navigate to="/staff/dashboard" replace />;
}
