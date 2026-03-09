import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "./auth.css";

function Auth(){

const [isLogin,setIsLogin] = useState(true);

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [role,setRole] = useState("customer");

const [loading,setLoading] = useState(false);

const navigate = useNavigate();

/* get login function from context */

const { login } = useContext(AuthContext);

const handleSubmit = async (e)=>{

e.preventDefault();

if(!email || !password || (!isLogin && !name)){
alert("Please fill all fields");
return;
}

try{

setLoading(true);

if(isLogin){

const res = await API.post("/auth/login",{
email,
password
});

const user = res.data.user;
const token = res.data.token;

alert(res.data.message || "Login successful");

/* update global auth state */

login(user, token);

/* redirect based on role */

if(user.role === "seller"){
navigate("/seller");
}
else if(user.role === "admin"){
navigate("/admin");
}
else{
navigate("/");
}

}else{

const res = await API.post("/auth/register",{
name,
email,
password,
role
});

alert(res.data.message || "Account created successfully");

/* switch to login */

setIsLogin(true);

}

/* clear form */

setName("");
setEmail("");
setPassword("");

}catch(err){

console.error(err);

alert(err.response?.data?.message || "Authentication failed");

}

setLoading(false);

};

return(

<div className="auth-container">

<div className="auth-card">

<h2>{isLogin ? "Sign In" : "Sign Up"}</h2>

<form onSubmit={handleSubmit}>

{/* Name */}

{!isLogin && (

<input
type="text"
placeholder="Full Name"
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>

)}

{/* Email */}

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

{/* Password */}

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

{/* Role selection */}

{!isLogin && (

<select
value={role}
onChange={(e)=>setRole(e.target.value)}
>

<option value="customer">Customer</option>
<option value="seller">Seller</option>

</select>

)}

<button type="submit" disabled={loading}>

{loading
? "Processing..."
: isLogin
? "Sign In"
: "Create Account"}

</button>

</form>

<p>

{isLogin
? "Don't have an account?"
: "Already have an account?"}

<span onClick={()=>setIsLogin(!isLogin)}>

{isLogin ? " Sign Up" : " Sign In"}

</span>

</p>

</div>

</div>

);

}

export default Auth;