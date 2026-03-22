import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function UserRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/auth" />;
  }

  /* Any logged in user (customer, seller, admin) is a 'User' for general routes like Orders/Cart */
  return children;
}

export default UserRoute;
