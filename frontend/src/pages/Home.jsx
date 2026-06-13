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
const [rxOnly, setRxOnly] = useState(false);

const [allCategories, setAllCategories] = useState(["All"]);
const [suggestions, setSuggestions] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);

useEffect(() => {
  API.get("/categories").then(res => setAllCategories(res.data));
}, []);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/products?category=${category}&search=${search}`);
      setProducts(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load products");
    }
    setLoading(false);
  };

  const debounce = setTimeout(() => {
    fetchProducts();
  }, 400); // Wait 400ms after user stops typing

  return () => clearTimeout(debounce);
}, [category, search]);


  return (
    <div className="page-container animate-fade-in">
      <section className="hero-section">
        <h1>Your Health, Simplified.</h1>
        <p>Get authentic medicines and healthcare products delivered to your doorstep.</p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for medicines, vitamins, or devices..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onFocus={() => search && setShowSuggestions(true)}
          />
          
          {showSuggestions && search && products.length > 0 && (
            <ul className="search-suggestions animate-scale-up">
              {products.slice(0, 6).map(p => (
                <li 
                  key={p._id} 
                  className="suggestion-item"
                  onClick={() => {
                    setSearch(p.name);
                    setShowSuggestions(false);
                  }}
                >
                  <img src={p.imageUrl || "/placeholder.png"} alt="" />
                  <div className="suggestion-name">{p.name}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="filter-row" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="category-buttons" style={{ marginBottom: 0 }}>
          {allCategories.map((cat) => (
            <button 
              key={cat} 
              className={category === cat ? "active" : ""} 
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="rx-filter-toggle" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface)', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', cursor: 'pointer', userSelect: 'none' }} onClick={() => setRxOnly(!rxOnly)}>
           <div className={`toggle-switch ${rxOnly ? 'active' : ''}`} style={{ width: '40px', height: '20px', background: rxOnly ? 'var(--primary)' : '#CBD5E1', borderRadius: '10px', position: 'relative', transition: '0.3s' }}>
              <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: rxOnly ? '22px' : '2px', transition: '0.3s' }}></div>
           </div>
           <span style={{ fontWeight: 700, fontSize: '0.875rem', color: rxOnly ? 'var(--primary)' : 'var(--text-muted)' }}>📄 Rx Required</span>
        </div>
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
          {products.filter(p => !rxOnly || p.requiresPrescription).length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No medicines found for your search.</p>
            </div>
          ) : (
            products.filter(p => !rxOnly || p.requiresPrescription).map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
