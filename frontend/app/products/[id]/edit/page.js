"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import ProductEditForm from '@/components/ProductEditForm'

export default function page() {
  const { id } = useParams();
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
        <h1 style={{ marginBottom: '30px' }}>Edit Product</h1>
        <ProductEditForm id={id} />
      </div>
    </div>
  )
}