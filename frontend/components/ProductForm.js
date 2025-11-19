"use client"
import React, { useState, useEffect } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ProductForm() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    category: "", // Changed from categoryId to category
    stock: "0",
    description: "",
    image: null
  });

  useEffect(() => {
    fetch(`${API_BASE}/api/categories`)
      .then(res => res.json())
      .then(json => {
        setCategories(json);
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setForm(prev => ({
        ...prev,
        slug
      }));
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        e.target.value = '';
        return;
      }
      setForm(prev => ({ ...prev, image: file }));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('slug', form.slug);
    formData.append('price', form.price);
    formData.append('category', form.category); // Changed from categoryId to category
    formData.append('stock', form.stock);
    if (form.description) formData.append('description', form.description);
    if (form.image) formData.append('image', form.image);

    const res = await fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (res.ok) {
      alert("Product Created.");
      window.location.href = "/products";
    } else {
      alert(data.error);
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name *</label>
          <input
            name='name'
            value={form.name}
            type='text'
            placeholder='Enter product name'
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Slug *</label>
          <input
            name='slug'
            value={form.slug}
            type='text'
            placeholder='product-slug'
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Price *</label>
          <input
            name='price'
            value={form.price}
            type='number'
            step='0.01'
            placeholder='0.00'
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Category *</label>
          <select
            name='category'
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Stock</label>
          <input
            name='stock'
            value={form.stock}
            type='number'
            min="0"
            placeholder='0'
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name='description'
            value={form.description}
            placeholder='Enter product description'
            onChange={handleChange}
            rows={5}
          />
        </div>
        
        <div className="form-group">
          <label>Product Image (max 5MB)</label>
          <input
            name='image'
            type='file'
            accept='image/*'
            onChange={handleImageChange}
          />
        </div>
        
        <div className="form-actions">
          <button type='submit' className="btn btn-primary">Create Product</button>
          <a href="/products" className="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  )
}