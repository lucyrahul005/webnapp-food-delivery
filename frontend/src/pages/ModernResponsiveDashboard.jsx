import React, { useState } from 'react';
import ResponsiveLayout from '../layout/ResponsiveLayout';
import './ModernDashboard.css';

/**
 * Modern Dashboard with Responsive Layout
 * Demonstrates:
 * - Responsive grid layouts
 * - Adaptive cards
 * - Responsive tables
 * - Mobile-first design
 */
const ModernResponsiveDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample Data
  const stats = [
    { title: 'Total Orders', value: '2,345', change: '+12.5%', icon: '📦' },
    { title: 'Revenue', value: '$45,231', change: '+8.2%', icon: '💰' },
    { title: 'Active Users', value: '1,234', change: '+4.3%', icon: '👥' },
    { title: 'Growth', value: '32%', change: '+2.1%', icon: '📈' },
  ];

  const orders = [
    { id: 1, customer: 'John Doe', product: 'Pizza', price: '$120', status: 'Delivered', date: '2024-03-10' },
    { id: 2, customer: 'Jane Smith', product: 'Burger', price: '$85', status: 'In Transit', date: '2024-03-11' },
    { id: 3, customer: 'Mike Johnson', product: 'Biryani', price: '$150', status: 'Processing', date: '2024-03-12' },
    { id: 4, customer: 'Sarah Williams', product: 'Salad', price: '$45', status: 'Delivered', date: '2024-03-13' },
  ];

  const products = [
    { id: 1, name: 'Cheese Burger', category: 'burger', price: '$120', rating: 4.5, status: 'In Stock' },
    { id: 2, name: 'Margherita Pizza', category: 'pizza', price: '$180', rating: 4.8, status: 'In Stock' },
    { id: 3, name: 'Veg Biryani', category: 'biryani', price: '$150', rating: 4.6, status: 'Low Stock' },
    { id: 4, name: 'Iced Tea', category: 'drinks', price: '$50', rating: 4.3, status: 'In Stock' },
    { id: 5, name: 'Chicken Wings', category: 'chicken', price: '$95', rating: 4.7, status: 'In Stock' },
    { id: 6, name: 'Veg Sandwich', category: 'sandwich', price: '$60', rating: 4.4, status: 'Out of Stock' },
  ];

  const categories = [
    { name: 'All', value: 'all' },
    { name: 'Pizza', value: 'pizza' },
    { name: 'Burger', value: 'burger' },
    { name: 'Biryani', value: 'biryani' },
    { name: 'Drinks', value: 'drinks' },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <ResponsiveLayout title="Dashboard">
      {/* ============ STATS SECTION ============ */}
      <section className="stats-section">
        <h3 className="section-title">Quick Stats</h3>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <p className="stat-label">{stat.title}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
              <p className="stat-change positive">{stat.change}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ PRODUCTS SECTION ============ */}
      <section className="products-section">
        <div className="section-header">
          <h3 className="section-title">Products</h3>
          <div className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-wrapper">
                <div className="product-image"></div>
                <div className={`product-badge ${product.status === 'In Stock' ? 'in-stock' : 'low-stock'}`}>
                  {product.status}
                </div>
              </div>
              <div className="product-info">
                <h4 className="product-title">{product.name}</h4>
                <div className="product-rating">
                  <span className="rating-stars">⭐ {product.rating}</span>
                </div>
                <p className="product-price">{product.price}</p>
                <button className="btn btn-primary">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ ORDERS TABLE SECTION ============ */}
      <section className="orders-section">
        <div className="section-header">
          <h3 className="section-title">Recent Orders</h3>
          <button className="btn btn-secondary">View All</button>
        </div>

        <div className="table-container">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td data-label="Order ID">#{order.id.toString().padStart(5, '0')}</td>
                  <td data-label="Customer">{order.customer}</td>
                  <td data-label="Product">{order.product}</td>
                  <td data-label="Price">{order.price}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                      {order.status}
                    </span>
                  </td>
                  <td data-label="Date">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============ INFO PANELS SECTION ============ */}
      <section className="panels-section">
        <div className="panel-glass">
          <h4>Welcome to WebnApp Dashboard</h4>
          <p>This modern responsive layout works seamlessly on mobile, tablet, and desktop devices. Resize your browser to see the responsive design in action!</p>
        </div>
      </section>
    </ResponsiveLayout>
  );
};

export default ModernResponsiveDashboard;
