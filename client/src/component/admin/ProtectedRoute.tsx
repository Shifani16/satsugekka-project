import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAdmin = localStorage.getItem("is_admin");

  if (isAdmin !== "true") {
    return <Navigate to="/vani" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;