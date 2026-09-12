import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../../utils/adminApi";

const ProtectedRoute = () => {
  if (!isLoggedIn()) {
    return <Navigate to="/vani" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;