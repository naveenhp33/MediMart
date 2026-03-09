import { useEffect, useState } from "react";
import API from "../api/api";
import "./seller.css";

function SellerProducts(){

const [products,setProducts] = useState([]);

const user = JSON.parse(localStorage.getItem("user"));

useEffect(()=>{

fetchProducts();

},[]);

const fetchProducts = () => {

API.get(`/seller/products/${user._id}`)
.then(res=>setProducts(res.data));

};


/* DELETE PRODUCT */

const deleteProduct = async (id) => {

if(!window.confirm("Delete this medicine?")) return;

try{

await API.delete(`/products/${id}`);

alert("Medicine deleted");

fetchProducts();

}catch(err){

alert("Error deleting medicine");

}

};

return(

<div className="seller-products">

<h2>My Medicines</h2>

<table className="medicine-table">

<thead>

<tr>
<th>Image</th>
<th>Name</th>
<th>Price</th>
<th>Stock</th>
<th>Actions</th>
</tr>

</thead>

<tbody>

{products.map(p=>(
<tr key={p._id}>

<td>
<img src={p.imageUrl} alt={p.name} className="product-img"/>
</td>

<td>{p.name}</td>

<td>₹{p.price}</td>

<td>{p.stock}</td>

<td>

<button className="edit-btn">
Edit
</button>

<button
className="delete-btn"
onClick={()=>deleteProduct(p._id)}
>
Delete
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

);

}

export default SellerProducts;