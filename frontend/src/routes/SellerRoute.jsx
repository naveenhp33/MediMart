import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function SellerRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (user.role !== "seller") {
    return <Navigate to="/" />;
  }

  return children;
}

export default SellerRoute;
