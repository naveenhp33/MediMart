import { useParams } from "react-router-dom";
import { useEffect,useState,useContext } from "react";

import API from "../api/api";
import { CartContext } from "../context/CartContext";
import "../App.css";

function ProductDetail(){

const {id} = useParams();

const [product,setProduct] = useState(null);

const {addToCart} = useContext(CartContext);

useEffect(()=>{

API.get(`/products/${id}`)
.then(res=>setProduct(res.data));

},[id]);

if(!product) return <h2>Loading...</h2>;

return(

<div>

<h1>{product.name}</h1>

<img src={product.imageUrl} width="200"/>

<p>{product.description}</p>

<h3>₹{product.price}</h3>

<button onClick={()=>addToCart(product)}>
Add to Cart
</button>

</div>

)

}

export default ProductDetail;