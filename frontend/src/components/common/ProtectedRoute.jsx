import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Loader from "./Loader";

const ProtectedRoute = ({ children, role }) => {
  const { user, initialized, loading } = useSelector((state) => state.auth);

  if (!initialized || loading) {
    return <Loader text="Checking session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
