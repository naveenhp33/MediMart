import { useEffect, useState } from "react";

import API from "../api/api";
import ProductCard from "../components/ProductCard";

import "../App.css";

function Home(){

const [products,setProducts] = useState([]);
const [category,setCategory] = useState("All");
const [search,setSearch] = useState("");

const [loading,setLoading] = useState(false);
const [error,setError] = useState("");

useEffect(()=>{

const fetchProducts = async ()=>{

try{

setLoading(true);

const res = await API.get(`/products?category=${category}&search=${search}`);

setProducts(res.data);

setError("");

}catch(err){

setError("Failed to load products");

}

setLoading(false);

}

fetchProducts();

},[category,search]);


return(

<div className="home-container">

<h1>MediMart Pharmacy</h1>

{/* SEARCH */}

<div className="search-bar">

<input
type="text"
placeholder="Search medicines..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>


{/* CATEGORY FILTER */}

<div className="category-buttons">

<button onClick={()=>setCategory("All")}>All</button>
<button onClick={()=>setCategory("Pain Relief")}>Pain Relief</button>
<button onClick={()=>setCategory("Vitamins")}>Vitamins</button>
<button onClick={()=>setCategory("Devices")}>Devices</button>

</div>


{/* LOADING */}

{loading && <p>Loading medicines...</p>}


{/* ERROR */}

{error && <p>{error}</p>}


{/* PRODUCTS */}

<div className="product-grid">

{products.length === 0 && !loading ? (
<p>No medicines found</p>
) : (
products.map(product => (
<ProductCard key={product._id} product={product}/>
))
)}

</div>

</div>

)

}

export default Home;