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


  return (
    <div className="page-container animate-fade-in">
      <section className="hero-section" style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--grad-surface)', borderRadius: 'var(--radius-xl)', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Your Health, Simplified.
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          Get authentic medicines and healthcare products delivered to your doorstep.
        </p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for medicines, vitamins, or devices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <div className="category-buttons">
        {['All', 'Pain Relief', 'Vitamins', 'Devices'].map((cat) => (
          <button 
            key={cat} 
            className={category === cat ? "active" : ""} 
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner"></div>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Updating pharmacy shelf...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#EF4444' }}>
          <p>{error}</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No medicines found for your search.</p>
            </div>
          ) : (
            products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
