import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function SellerRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (user.role !== "seller") {
    return <Navigate to="/" />;
  }

  return children;
}

export default SellerRoute;
