"use client"
import React, { useState, useEffect } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    fetch(`${API_BASE}/api/categories`)
      .then(res => res.json())
      .then(json => {
        setCategories(json);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (query) params.append('search', query);
    if (categoryFilter) params.append('categoryId', categoryFilter);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);

    fetch(`${API_BASE}/api/products?${params}`)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setProducts(json.data || []);
        setTotalPages(json.pagination?.totalPages || 1);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [query, categoryFilter, minPrice, maxPrice, page]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete Product: ${name}?`)) return;
    const res = await fetch(`${API_BASE}/api/products/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (res.ok) {
      alert(`Product "${name}" deleted.`);
      window.location.href = '/products';
    } else {
      alert(data.error);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-container">
          <a href="/products" className="logo">ShopHub</a>
          <div className="nav-links">
            <a href="/products">All Products</a>
            <a href="/products/create" className="btn btn-primary">+ Add Product</a>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="search-section">
          <div className="search-row">
            <input
              type="text"
              className="search-input"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={() => {
                setQuery(search);
                setPage(1);
              }}
            >
              Search
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearch("");
                setQuery("");
                setCategoryFilter("");
                setMinPrice("");
                setMaxPrice("");
                setPage(1);
              }}
            >
              Clear
            </button>
          </div>

          <div className="filter-row">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="products-header">
          <h1>All Products ({products.length})</h1>
        </div>

        <div className="products-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <div className="product-image">
                {p.imageUrl ? (
                  <img src={`${API_BASE}${p.imageUrl}`} alt={p.name} />
                ) : (
                  <span>No Image</span>
                )}
              </div>
              <div className="product-info">
                <div className="product-category">{p.category?.name || 'Uncategorized'}</div>
                <div className="product-name">{p.name}</div>
                <div className="product-price">${p.price}</div>
                <div className="product-actions">
                  <a href={`/products/${p.id}`}>View</a>
                  <a href={`/products/${p.id}/edit`}>Edit</a>
                  <button onClick={() => handleDelete(p.id, p.name)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              ← Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button 
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}