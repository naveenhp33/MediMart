import { useEffect,useState } from "react";
import API from "../api/api";
import "./admin.css";

function AdminUsers(){

const [users,setUsers] = useState([]);

useEffect(()=>{

API.get("/users")
.then(res=>setUsers(res.data));

},[]);

return(

<div className="admin-container">

<h2>Users</h2>

<table className="admin-table">

<thead>
<tr>
<th>Name</th>
<th>Email</th>
<th>Role</th>
</tr>
</thead>

<tbody>

{users.map(u=>(
<tr key={u._id}>

<td>{u.name}</td>
<td>{u.email}</td>
<td>{u.role}</td>

</tr>
))}

</tbody>

</table>

</div>

)

}

export default AdminUsers;