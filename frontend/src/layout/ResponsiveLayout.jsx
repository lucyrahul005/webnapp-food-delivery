import React, { useState } from 'react';
import './ResponsiveLayout.css';
import { Menu, X, Home, ShoppingBag, Users, Settings, Bell, User, Search } from 'lucide-react';

/**
 * Modern Responsive Layout Component
 * Mobile-first design with hamburger menu, collapsible sidebar, and adaptive grid layouts
 * Works seamlessly on mobile (320px-480px), tablet (481px-1024px), and desktop (1025px+)
 */
const ResponsiveLayout = ({ children, title = 'Dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  const navigationItems = [
    { icon: Home, label: 'Home', href: '#' },
    { icon: ShoppingBag, label: 'Products', href: '#' },
    { icon: Users, label: 'Users', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' },
  ];

  return (
    <div className="responsive-layout">
      {/* ============ HEADER / NAVBAR ============ */}
      <header className="navbar">
        <div className="navbar-container">
          {/* Mobile Menu Toggle */}
          <button 
            className="menu-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo / Brand */}
          <div className="navbar-brand">
            <h1 className="brand-name">WebnApp</h1>
          </div>

          {/* Navbar Actions - Right */}
          <div className="navbar-actions">
            <button 
              className="search-button"
              onClick={toggleSearch}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button className="notification-button" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <button className="profile-button" aria-label="Profile">
              <User size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar - Expandable on Mobile */}
        {searchOpen && (
          <div className="search-bar-expanded">
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input"
              autoFocus
            />
          </div>
        )}
      </header>

      {/* ============ MAIN LAYOUT CONTAINER ============ */}
      <div className="layout-container">
        
        {/* ============ SIDEBAR ============ */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            {navigationItems.map((item, index) => (
              <a 
                key={index}
                href={item.href}
                className="nav-item"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="nav-icon" size={20} />
                <span className="nav-label">{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="avatar">R</div>
              <div className="user-info">
                <p className="user-name">Rahul</p>
                <p className="user-email">rahul@example.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ============ OVERLAY (Mobile Sidebar Click Away) ============ */}
        {sidebarOpen && (
          <div 
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* ============ MAIN CONTENT AREA ============ */}
        <main className="main-content">
          <div className="content-header">
            <h2 className="content-title">{title}</h2>
            <p className="content-subtitle">Welcome back! Here's what's happening.</p>
          </div>

          {/* Content Grid - Responsive */}
          <div className="content-area">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResponsiveLayout;
