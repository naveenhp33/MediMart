import { useEffect,useState } from "react";
import API from "../api/api";
import "./admin.css";

function AdminProducts(){

const [products,setProducts] = useState([]);

useEffect(()=>{

API.get("/products")
.then(res=>setProducts(res.data));

},[]);

const deleteProduct = async(id)=>{

if(!window.confirm("Delete this medicine?")) return;

await API.delete(`/products/${id}`);

setProducts(products.filter(p=>p._id !== id));

};

return(

<div className="admin-container">

<h2>All Medicines</h2>

<table className="admin-table">

<thead>
<tr>
<th>Name</th>
<th>Price</th>
<th>Stock</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{products.map(p=>(
<tr key={p._id}>

<td>{p.name}</td>
<td>₹{p.price}</td>
<td>{p.stock}</td>

<td>
<button onClick={()=>deleteProduct(p._id)}>
Delete
</button>
</td>

</tr>
))}

</tbody>

</table>

</div>

)

}

export default AdminProducts;