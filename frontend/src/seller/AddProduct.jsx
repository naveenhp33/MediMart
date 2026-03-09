import { useState } from "react";
import API from "../api/api";

function AddProduct(){

const [product,setProduct] = useState({
name:"",
price:"",
category:"",
stock:"",
imageUrl:"",
description:""
});

const handleChange = (e)=>{

setProduct({
...product,
[e.target.name]:e.target.value
});

};

const handleSubmit = async (e)=>{

e.preventDefault();

try{

const token = localStorage.getItem("token");

await API.post("/products",product,{
headers:{
Authorization:token
}
});

alert("Medicine added successfully");

setProduct({
name:"",
price:"",
category:"",
stock:"",
imageUrl:"",
description:""
});

}catch(err){

alert("Error adding medicine");

}

};

return(

<div className="seller-form">

<h2>Add Medicine</h2>

<form onSubmit={handleSubmit}>

<input
name="name"
placeholder="Medicine name"
value={product.name}
onChange={handleChange}
/>

<input
name="price"
placeholder="Price"
value={product.price}
onChange={handleChange}
/>

<input
name="category"
placeholder="Category"
value={product.category}
onChange={handleChange}
/>

<input
name="stock"
placeholder="Stock"
value={product.stock}
onChange={handleChange}
/>

<input
name="imageUrl"
placeholder="Image URL"
value={product.imageUrl}
onChange={handleChange}
/>

<textarea
name="description"
placeholder="Description"
value={product.description}
onChange={handleChange}
/>

<button type="submit">
Add Medicine
</button>

</form>

</div>

)

}

export default AddProduct;