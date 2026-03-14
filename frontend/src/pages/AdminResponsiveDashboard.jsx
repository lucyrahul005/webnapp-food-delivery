import { useMemo, useState } from "react";
import "./AdminResponsiveDashboard.css";

const METRICS = [
  { title: "Total Orders", value: "12,480", delta: "+8.2%" },
  { title: "Active Restaurants", value: "1,240", delta: "+3.1%" },
  { title: "New Users", value: "3,904", delta: "+5.6%" },
  { title: "Revenue", value: "₹8.2L", delta: "+11.4%" },
];

const ORDERS = [
  { id: "ODR-1142", customer: "Aarav K.", restaurant: "Spice Hub", amount: "₹540", status: "Preparing" },
  { id: "ODR-1143", customer: "Meera S.", restaurant: "Biryani House", amount: "₹820", status: "Delivered" },
  { id: "ODR-1144", customer: "Kabir P.", restaurant: "Urban Tadka", amount: "₹310", status: "Out for Delivery" },
];

const USERS = [
  { id: "USR-2321", name: "Nisha R.", role: "Customer", orders: 18 },
  { id: "USR-2322", name: "Rohit D.", role: "Rider", orders: 124 },
  { id: "USR-2323", name: "Harsha T.", role: "Restaurant", orders: 82 },
];

const RESTAURANTS = [
  { id: "RST-901", name: "Grill & Go", city: "Bengaluru", rating: "4.7" },
  { id: "RST-902", name: "Saffron Lane", city: "Hyderabad", rating: "4.5" },
  { id: "RST-903", name: "Bowls & More", city: "Pune", rating: "4.6" },
];

const PRODUCTS = [
  { name: "Butter Chicken Bowl", price: "₹320", tag: "Popular" },
  { name: "Veggie Fiesta Pizza", price: "₹420", tag: "New" },
  { name: "Paneer Tikka Wrap", price: "₹220", tag: "Trending" },
  { name: "Choco Lava Cake", price: "₹180", tag: "Dessert" },
];

const NAV_ITEMS = [
  "Overview",
  "Orders",
  "Restaurants",
  "Users",
  "Menus",
  "Offers",
  "Analytics",
  "Support",
];

function TableCard({ title, rows, columns }) {
  return (
    <section className="panel">
      <header className="panel-header">
        <h3>{title}</h3>
        <button className="btn ghost">View all</button>
      </header>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.key} data-label={column.label}>
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function AdminResponsiveDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const orderColumns = useMemo(
    () => [
      { key: "id", label: "Order ID" },
      { key: "customer", label: "Customer" },
      { key: "restaurant", label: "Restaurant" },
      { key: "amount", label: "Amount" },
      { key: "status", label: "Status" },
    ],
    []
  );

  const userColumns = useMemo(
    () => [
      { key: "id", label: "User ID" },
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "orders", label: "Orders" },
    ],
    []
  );

  const restaurantColumns = useMemo(
    () => [
      { key: "id", label: "Restaurant ID" },
      { key: "name", label: "Restaurant" },
      { key: "city", label: "City" },
      { key: "rating", label: "Rating" },
    ],
    []
  );

  return (
    <div className={`admin-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">🍲</span>
          <div>
            <p className="brand-title">FoodFlow Admin</p>
            <span className="brand-sub">Premium Control</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button key={item} className="nav-item">
              <span className="nav-dot" />
              <span className="nav-label">{item}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="btn accent">Create Offer</button>
          <button className="btn ghost">Settings</button>
        </div>
      </aside>

      <div className="page">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-btn"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <button
              className="icon-btn desktop-only"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              aria-label="Collapse sidebar"
            >
              ⇔
            </button>
            <div>
              <h1>Dashboard</h1>
              <p>Track orders, restaurants, and operations at a glance.</p>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="search">
              <input type="search" placeholder="Search orders or users" />
            </div>
            <button className="icon-btn">🔔</button>
            <div className="profile-chip">
              <span className="avatar">AR</span>
              <div>
                <p className="profile-name">Admin Rahul</p>
                <span className="profile-role">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="content">
          <section className="metrics-grid">
            {METRICS.map((metric) => (
              <div className="metric-card" key={metric.title}>
                <p className="metric-title">{metric.title}</p>
                <h2>{metric.value}</h2>
                <span className="metric-delta">{metric.delta}</span>
              </div>
            ))}
          </section>

          <section className="analytics-grid">
            <div className="panel chart-panel">
              <header className="panel-header">
                <h3>Weekly Orders</h3>
                <button className="btn ghost">Export</button>
              </header>
              <div className="chart-placeholder">
                <div className="chart-bar" />
                <div className="chart-bar tall" />
                <div className="chart-bar mid" />
                <div className="chart-bar" />
                <div className="chart-bar tall" />
              </div>
            </div>
            <div className="panel chart-panel">
              <header className="panel-header">
                <h3>Revenue Mix</h3>
                <button className="btn ghost">Details</button>
              </header>
              <div className="chart-donut">
                <div className="donut" />
                <ul>
                  <li>Delivery: 54%</li>
                  <li>Pickup: 28%</li>
                  <li>Offers: 18%</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="product-grid">
            {PRODUCTS.map((product) => (
              <article className="product-card" key={product.name}>
                <div className="product-image" />
                <div>
                  <h4>{product.name}</h4>
                  <p>{product.price}</p>
                </div>
                <span className="product-tag">{product.tag}</span>
              </article>
            ))}
          </section>

          <div className="table-grid">
            <TableCard title="Recent Orders" rows={ORDERS} columns={orderColumns} />
            <TableCard title="Active Users" rows={USERS} columns={userColumns} />
            <TableCard title="Top Restaurants" rows={RESTAURANTS} columns={restaurantColumns} />
          </div>
        </main>
      </div>
    </div>
  );
}
