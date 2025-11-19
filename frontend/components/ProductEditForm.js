"use client"
import React, { useState, useEffect } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ProductEditForm({ id }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    price: '',
    category: '', // Changed from categoryId to category
    stock: '0',
    description: '',
    image: null
  });

  useEffect(() => {
    fetch(`${API_BASE}/api/categories`)
      .then(res => res.json())
      .then(json => {
        setCategories(json);
      })
      .catch(err => console.error(err));

    fetch(`${API_BASE}/api/products/${id}`)
      .then(res => res.json())
      .then(json => {
        setForm({
          name: json.name,
          slug: json.slug,
          price: json.price,
          category: json.category || '', // Changed from categoryId to category
          stock: json.stock || '0',
          description: json.description || '',
          image: null
        });
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
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

    const res = await fetch(`${API_BASE}/api/products/${id}`, {
      method: 'PUT',
      body: formData
    });
    const data = await res.json();
    if (res.ok) {
      alert('Product updated.');
      window.location.href = '/products';
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
            onChange={handleChange}
            type='text'
            placeholder='Enter product name'
            required
          />
        </div>
        
        <div className="form-group">
          <label>Slug *</label>
          <input
            name='slug'
            value={form.slug}
            onChange={handleChange}
            type='text'
            placeholder='product-slug'
            required
          />
        </div>
        
        <div className="form-group">
          <label>Price *</label>
          <input
            name='price'
            value={form.price}
            onChange={handleChange}
            type='number'
            step='0.01'
            placeholder='0.00'
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
            onChange={handleChange}
            type='number'
            min="0"
            placeholder='0'
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name='description'
            value={form.description}
            onChange={handleChange}
            placeholder='Enter product description'
            rows={5}
          />
        </div>
        
        <div className="form-group">
          <label>New Product Image (max 5MB, optional)</label>
          <input
            name='image'
            type='file'
            accept='image/*'
            onChange={handleImageChange}
          />
        </div>
        
        <div className="form-actions">
          <button type='submit' className="btn btn-primary">Update Product</button>
          <a href="/products" className="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  )
}