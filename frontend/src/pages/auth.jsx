import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";
import "./auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      showToast("⚠️ All fields are required");
      return;
    }

    try {
      setLoading(true);
      if (isLogin) {
        const res = await API.post("/auth/login", { email, password });
        const { user, token } = res.data;
        login(user, token);
        showToast(`👋 Welcome back, ${user.name}!`);

        if (user.role === "seller") navigate("/seller");
        else if (user.role === "admin") navigate("/admin");
        else navigate("/");

      } else {
        const res = await API.post("/auth/register", { name, email, password, role });
        const { user: newUser, token } = res.data;
        login(newUser, token);
        showToast(" Account created! Welcome to MediMart.");

        if (newUser.role === "seller") navigate("/seller");
        else if (newUser.role === "admin") navigate("/admin");
        else navigate("/");
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };


return(

    <div className="auth-container">
      <div className="auth-card animate-fade-in">
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className="subtitle">
          {isLogin 
            ? "Sign in to access your prescriptions and orders" 
            : "Join MediMart for a better pharmacy experience"}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isLogin && (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customer">I am a Customer</option>
              <option value="seller">I am a Seller</option>
            </select>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? "Authenticating..."
              : isLogin
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin
            ? "New to MediMart?"
            : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Create an account" : " Sign in instead"}
          </span>
        </p>
      </div>
    </div>


);

}

export default Auth;