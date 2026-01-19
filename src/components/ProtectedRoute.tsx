import { Navigate, Outlet } from "react-router-dom";
import { authStore } from "../store/authStore";

const ProtectedRoute = () => {
  const user = authStore((state) => state.user);

  if (!user) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
