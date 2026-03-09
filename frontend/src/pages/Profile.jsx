import { useState } from "react";
import "./profile.css";

function Profile(){

const storedUser = JSON.parse(localStorage.getItem("user"));

const [name,setName] = useState(storedUser?.name || "");
const [email,setEmail] = useState(storedUser?.email || "");
const [phone,setPhone] = useState("");
const [address,setAddress] = useState("");

const handleUpdate = ()=>{

const updatedUser = {
...storedUser,
name,
email
};

localStorage.setItem("user",JSON.stringify(updatedUser));

alert("Profile updated");

};

return(

<div className="profile-page">

<h1>My Profile</h1>

<div className="profile-container">

{/* LEFT SIDE */}

<div className="profile-card">

<div className="avatar">
{ name?.charAt(0).toUpperCase() }
</div>

<h2>{name}</h2>

<p>{email}</p>

</div>


{/* RIGHT SIDE */}

<div className="profile-details">

<h3>Personal Information</h3>

<label>Name</label>
<input
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<label>Email</label>
<input
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<label>Phone</label>
<input
value={phone}
onChange={(e)=>setPhone(e.target.value)}
placeholder="Enter phone"
/>

<label>Address</label>
<textarea
value={address}
onChange={(e)=>setAddress(e.target.value)}
placeholder="Enter delivery address"
/>

<button onClick={handleUpdate}>
Update Profile
</button>

</div>

</div>

</div>

)

}

export default Profile;