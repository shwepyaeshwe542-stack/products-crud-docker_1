"use client"
import React from 'react'
import ProductForm from '@/components/ProductForm'

export default function page() {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-container">
          <a href="/products" className="logo">ShopHub</a>
          <div className="nav-links">
            <a href="/products">← Back to Products</a>
          </div>
        </div>
      </nav>
      <div className="container">
        <h1 style={{ marginBottom: '30px' }}>Add New Product</h1>
        <ProductForm />
      </div>
    </div>
  )
}