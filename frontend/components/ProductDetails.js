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
        <div>
          {product.imageUrl ? (
            <img 
              src={`${API_BASE}${product.imageUrl}`} 
              alt={product.name}
              className="product-detail-image"
            />
          ) : (
            <div style={{ padding: '100px', background: '#f5f5f5', textAlign: 'center', borderRadius: '8px' }}>
              No Image Available
            </div>
          )}
        </div>
        
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