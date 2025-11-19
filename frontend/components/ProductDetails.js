"use client"
import React, { useState, useEffect } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ProductDetails({ id }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/products/${id}`)
      .then(res => res.json())
      .then(json => {
        console.log(json);
        setProduct(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading">Loading product...</div>
  if (!product) return <div className="loading">Product not found</div>

  return (
    <div className="product-detail">
      <div className="product-detail-grid">
        
        {/* === COLUMN 1: IMAGE (Correctly placed as the first grid item) === */}
        <div>
          {product.imageUrl ? (
            <img
              src={`http://localhost:4000${product.imageUrl}`}
              alt={product.name}
              /* Note: Tailwind classes 'w-full h-96 object-cover rounded-lg' should be merged 
                 with 'product-detail-image' or removed if not using Tailwind. 
                 I've kept them as they were in your code. */
              className="product-detail-image w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';
              }}
            />
          ) : (
            <div className="product-detail-image w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
              <span className="text-gray-400 text-xl">No Image Available</span>
            </div>
          )}
        </div>
        
        {/* === COLUMN 2: INFO (Correctly placed as the second grid item) === */}
        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <div className="product-detail-category">{product.category?.name || 'Uncategorized'}</div>
          <div className="product-detail-price">${product.price}</div>
          <div className="product-detail-description">
            <strong>Description:</strong><br />
            {product.description || 'No description available'}
          </div>
          <div className="product-detail-meta">
            <p><strong>Slug:</strong> {product.slug}</p>
            <p><strong>Created:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="form-actions" style={{ marginTop: '30px' }}>
            <a href={`/products/${id}/edit`} className="btn btn-primary">Edit Product</a>
            <a href="/products" className="btn btn-secondary">Back to Products</a>
          </div>
        </div>
        
      </div>
    </div>
  )
}