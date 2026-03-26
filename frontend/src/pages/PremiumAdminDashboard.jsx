import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts";
import { API_URL } from "../config/api";
import Toast from "../components/Toast";
import "./PremiumAdminDashboard.css";

// ============ REVENUE CHART DATA ============
const revenueChartData = [
  { date: "Mon", revenue: 4000, orders: 240 },
  { date: "Tue", revenue: 3000, orders: 221 },
  { date: "Wed", revenue: 2000, orders: 229 },
  { date: "Thu", revenue: 2780, orders: 200 },
  { date: "Fri", revenue: 1890, orders: 229 },
  { date: "Sat", revenue: 2390, orders: 200 },
  { date: "Sun", revenue: 3490, orders: 310 },
];

const topRestaurantsData = [
  { name: "Spice Garden", orders: 1240, revenue: 52000 },
  { name: "Pizza Palace", orders: 980, revenue: 45000 },
  { name: "Biryani House", orders: 876, revenue: 38000 },
  { name: "Burger Zone", orders: 754, revenue: 32000 },
];

const topFoodsData = [
  { name: "Biryani", sales: 450 },
  { name: "Pizza", sales: 380 },
  { name: "Burgers", sales: 290 },
  { name: "Desserts", sales: 180 },
];

const COLORS = ["#8b5cf6", "#ec4899", "#06b6d4", "#f59e0b"];

// ============ SKELETON LOADERS ============
const SkeletonKPICard = () => (
  <div className="kpi-card skeleton">
    <div className="skeleton-icon"></div>
    <div className="skeleton-content">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-value"></div>
      <div className="skeleton-line skeleton-change"></div>
    </div>
  </div>
);

const SkeletonChartCard = () => (
  <div className="glass-card chart-card skeleton">
    <div className="skeleton-header">
      <div className="skeleton-line skeleton-chart-title"></div>
    </div>
    <div className="skeleton-chart"></div>
  </div>
);

const SkeletonTableRow = () => (
  <tr className="skeleton-row">
    <td><div className="skeleton-line"></div></td>
    <td><div className="skeleton-line"></div></td>
    <td><div className="skeleton-line"></div></td>
    <td><div className="skeleton-line"></div></td>
    <td><div className="skeleton-line"></div></td>
  </tr>
);

const SkeletonRestaurantCard = () => (
  <div className="restaurant-item skeleton">
    <div className="skeleton-rank"></div>
    <div className="skeleton-image"></div>
    <div className="skeleton-line skeleton-rest-name"></div>
    <div className="skeleton-line skeleton-rest-stats"></div>
    <div className="skeleton-line skeleton-rest-revenue"></div>
  </div>
);

// ============ KPI CARD COMPONENT ============
const KPICard = ({ icon, title, value, change, gradient }) => (
  <motion.div
    whileHover={{ translateY: -5 }}
    className={`kpi-card gradient-${gradient}`}
  >
    <div className="kpi-icon">{icon}</div>
    <div className="kpi-content">
      <p className="kpi-title">{title}</p>
      <h3 className="kpi-value">{value}</h3>
      <span className={`kpi-change ${change > 0 ? "positive" : "negative"}`}>
        {change > 0 ? "↑" : "↓"} {Math.abs(change)}% from last week
      </span>
    </div>
  </motion.div>
);

// ============ STATUS BADGE COMPONENT ============
const StatusBadge = ({ status }) => {
  const statusMap = {
    "Delivered": { class: "badge-delivered", icon: "✓" },
    "Pending": { class: "badge-pending", icon: "○" },
    "Cancelled": { class: "badge-cancelled", icon: "✕" },
    "Preparing": { class: "badge-preparing", icon: "⟳" },
  };
  const badge = statusMap[status] || statusMap["Pending"];
  return <span className={`status-badge ${badge.class}`}>{badge.icon} {status}</span>;
};

// ============ RECENT ORDERS TABLE ============
const RecentOrdersTable = ({ orders }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
    <div className="card-header">
      <h3>📦 Recent Orders</h3>
    </div>
    <div className="table-wrapper">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.slice(0, 5).map(order => (
            <motion.tr
              key={order._id}
              whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
            >
              <td className="order-id">#{order._id.slice(-6)}</td>
              <td>{order.userId?.name || "Guest"}</td>
              <td className="amount">₹{order.total || 0}</td>
              <td><StatusBadge status={order.orderStatus} /></td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

// ============ TOP RESTAURANTS SECTION ============
const TopRestaurants = ({ restaurants }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
    <div className="card-header">
      <h3>🏆 Top Restaurants</h3>
    </div>
    <div className="restaurants-grid">
      {restaurants.slice(0, 4).map((rest, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.02 }}
          className="restaurant-item"
        >
          <div className="rank-badge">#{idx + 1}</div>
          {rest.image && <img src={rest.image} alt={rest.name} className="rest-thumb" />}
          <h4>{rest.name}</h4>
          <p className="rest-stats">
            <span>⭐ {rest.rating || "4.5"}</span> • <span>{rest.totalOrders || 0} orders</span>
          </p>
          <p className="rest-revenue">₹{(rest.totalRevenue || 0).toLocaleString()}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// ============ MAIN PREMIUM ADMIN DASHBOARD ============
function PremiumAdminDashboard() {
  const token = sessionStorage.getItem("token") || "";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [toast, setToast] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard"); // Active section state

  // Data states
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [riders, setRiders] = useState([]);

  const authHeaders = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes, restaurantsRes, usersRes, ridersRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/stats`, authHeaders).catch(() => ({ data: null })),
        axios.get(`${API_URL}/api/admin/orders`, authHeaders).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/admin/restaurants`, authHeaders).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/admin/users`, authHeaders).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/admin/riders/pending`, authHeaders).catch(() => ({ data: [] })),
      ]);

      setStats(statsRes?.data || null);
      setOrders(Array.isArray(ordersRes?.data) ? ordersRes.data : []);
      setRestaurants(Array.isArray(restaurantsRes?.data) ? restaurantsRes.data : []);
      setUsers(Array.isArray(usersRes?.data) ? usersRes.data : []);
      setRiders(Array.isArray(ridersRes?.data) ? ridersRes.data : []);
      setLoadingData(false); // Set loading to false AFTER data is set
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setToast({ message: "Error loading dashboard data", type: "error" });
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 30000);
      return () => clearInterval(interval);
    } else {
      setLoadingData(false); // If no token, stop loading
    }
  }, [token]);

  const logout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/admin-login";
  };

  const menuItems = [
    { icon: "📊", label: "Dashboard" },
    { icon: "🍽️", label: "Orders" },
    { icon: "🏪", label: "Restaurants" },
    { icon: "🚴", label: "Riders" },
    { icon: "👤", label: "Users" },
    { icon: "💳", label: "Payments" },
    { icon: "📈", label: "Analytics" },
    { icon: "⭐", label: "Reviews" },
    { icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className={`premium-dashboard ${darkMode ? "dark" : "light"}`}>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* ============ SIDEBAR ============ */}
      <aside className={`premium-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">🍴</div>
            {sidebarOpen && <h1>FoodFlow</h1>}
          </div>
          <button
            className="collapse-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, idx) => {
            const sectionId = item.label.toLowerCase();
            const isActive = activeSection === sectionId;
            return (
              <motion.button
                key={idx}
                whileHover={{ x: 5 }}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => setActiveSection(sectionId)}
              >
                <span className="nav-icon">{item.icon}</span>
                {sidebarOpen && <span className="nav-label">{item.label}</span>}
              </motion.button>
            );
          })}
        </nav>

        <button className="logout-btn" onClick={logout}>
          🚪 {sidebarOpen ? "Logout" : ""}
        </button>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <div className="premium-main">
        {/* ============ TOP NAVBAR ============ */}
        <header className="premium-navbar">
          <div className="navbar-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search orders, restaurants..." />
            </div>
          </div>

          <div className="navbar-right">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="navbar-icon-btn"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "🌙" : "☀️"}
            </motion.button>

            <motion.button whileHover={{ scale: 1.1 }} className="navbar-icon-btn">
              🔔
              <span className="notification-badge">3</span>
            </motion.button>

            <div className="admin-profile">
              <img src="https://via.placeholder.com/40" alt="Admin" className="profile-avatar" />
              <motion.button whileHover={{ scale: 1.05 }} className="profile-menu">
                ▼
              </motion.button>
            </div>
          </div>
        </header>

        {/* ============ DASHBOARD CONTENT ============ */}
        <main className="dashboard-content">
          {loadingData ? (
            <>
              {/* Skeleton Page Header */}
              <div className="page-header skeleton-header">
                <div className="skeleton-line skeleton-title-lg"></div>
                <div className="skeleton-line skeleton-subtitle"></div>
              </div>

              {/* Skeleton KPI Cards */}
              <div className="kpi-grid">
                <SkeletonKPICard />
                <SkeletonKPICard />
                <SkeletonKPICard />
                <SkeletonKPICard />
                <SkeletonKPICard />
              </div>

              {/* Skeleton Charts */}
              <div className="charts-grid">
                <SkeletonChartCard />
                <SkeletonChartCard />
              </div>

              {/* Skeleton Tables and Cards */}
              <div className="bottom-section">
                <div className="glass-card chart-card skeleton">
                  <div className="skeleton-header">
                    <div className="skeleton-line skeleton-chart-title"></div>
                  </div>
                  <table className="orders-table skeleton-table">
                    <tbody>
                      <SkeletonTableRow />
                      <SkeletonTableRow />
                      <SkeletonTableRow />
                      <SkeletonTableRow />
                      <SkeletonTableRow />
                    </tbody>
                  </table>
                </div>
                <div className="glass-card skeleton">
                  <div className="skeleton-header">
                    <div className="skeleton-line skeleton-chart-title"></div>
                  </div>
                  <div className="restaurants-grid">
                    <SkeletonRestaurantCard />
                    <SkeletonRestaurantCard />
                    <SkeletonRestaurantCard />
                    <SkeletonRestaurantCard />
                  </div>
                </div>
              </div>

              {/* Skeleton Quick Stats */}
              <div className="quick-stats">
                <div className="glass-card stat-box skeleton">
                  <div className="skeleton-line skeleton-short"></div>
                  <div className="skeleton-line skeleton-value"></div>
                </div>
                <div className="glass-card stat-box skeleton">
                  <div className="skeleton-line skeleton-short"></div>
                  <div className="skeleton-line skeleton-value"></div>
                </div>
                <div className="glass-card stat-box skeleton">
                  <div className="skeleton-line skeleton-short"></div>
                  <div className="skeleton-line skeleton-value"></div>
                </div>
                <div className="glass-card stat-box skeleton">
                  <div className="skeleton-line skeleton-short"></div>
                  <div className="skeleton-line skeleton-value"></div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* DASHBOARD SECTION */}
              {activeSection === "dashboard" && (
                <>
                  {/* Page Title */}
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                    <h1>Dashboard Overview</h1>
                    <p>Welcome back, Admin! Here's your platform's performance.</p>
                  </motion.div>

              {/* KPI Cards */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="kpi-grid"
              >
                <KPICard
                  icon="📦"
                  title="Total Orders"
                  value={stats?.totalOrders || 0}
                  change={12}
                  gradient="purple"
                />
                <KPICard
                  icon="💰"
                  title="Total Revenue"
                  value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
                  change={18}
                  gradient="pink"
                />
                <KPICard
                  icon="👥"
                  title="Active Users"
                  value={stats?.totalUsers || 0}
                  change={8}
                  gradient="cyan"
                />
                <KPICard
                  icon="🏪"
                  title="Restaurants"
                  value={stats?.totalRestaurants || 0}
                  change={5}
                  gradient="amber"
                />
                <KPICard
                  icon="🚴"
                  title="Delivery Partners"
                  value="45"
                  change={3}
                  gradient="green"
                />
              </motion.div>

              {/* Charts Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="charts-grid"
              >
                {/* Revenue & Orders Chart */}
                <div className="glass-card chart-card">
                  <div className="card-header">
                    <h3>📊 Revenue & Orders</h3>
                    <select className="chart-period">
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>This Year</option>
                    </select>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(20, 20, 40, 0.95)",
                          border: "1px solid rgba(139, 92, 246, 0.3)",
                          borderRadius: "12px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: "#8b5cf6", r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#ec4899"
                        strokeWidth={3}
                        dot={{ fill: "#ec4899", r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Selling Foods */}
                <div className="glass-card chart-card">
                  <div className="card-header">
                    <h3>🍔 Top Selling Foods</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={topFoodsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, sales }) => `${name}: ${sales}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="sales"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Recent Orders & Top Restaurants */}
              <div className="bottom-section">
                <RecentOrdersTable orders={orders} />
                <TopRestaurants restaurants={restaurants} />
              </div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="quick-stats"
              >
                <div className="glass-card stat-box">
                  <h4>🟢 Pending Orders</h4>
                  <p className="stat-value">{stats?.pendingOrders || 0}</p>
                </div>
                <div className="glass-card stat-box">
                  <h4>✓ Delivered Orders</h4>
                  <p className="stat-value">{stats?.deliveredOrders || 0}</p>
                </div>
                <div className="glass-card stat-box">
                  <h4>✕ Cancelled Orders</h4>
                  <p className="stat-value">{stats?.cancelledOrders || 0}</p>
                </div>
                <div className="glass-card stat-box">
                  <h4>⭐ Avg Rating</h4>
                  <p className="stat-value">4.8</p>
                </div>
              </motion.div>
                </>
              )}

              {/* ORDERS SECTION */}
              {activeSection === "orders" && (
                <>
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                    <h1>Orders Management</h1>
                    <p>Manage all food orders from customers.</p>
                  </motion.div>
                  <RecentOrdersTable orders={orders} />
                </>
              )}

              {/* RESTAURANTS SECTION */}
              {activeSection === "restaurants" && (
                <>
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                    <h1>Restaurants Management</h1>
                    <p>Manage all partner restaurants.</p>
                  </motion.div>
                  <TopRestaurants restaurants={restaurants} />
                </>
              )}

              {/* RIDERS SECTION */}
              {activeSection === "riders" && (
                <>
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                    <h1>Delivery Partners</h1>
                    <p>Manage delivery partners and assignments.</p>
                  </motion.div>
                  <motion.div className="glass-card">
                    <div className="card-header">
                      <h3>🚴 Active Riders ({riders.length})</h3>
                    </div>
                    <div className="table-wrapper">
                      <table className="orders-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {riders.length > 0 ? riders.map(rider => (
                            <tr key={rider._id}>
                              <td>#{rider._id?.slice(-6) || 'N/A'}</td>
                              <td>{rider.name || 'N/A'}</td>
                              <td>{rider.phone || 'N/A'}</td>
                              <td><span className="status-badge badge-delivered">✓ Active</span></td>
                              <td>⭐ {rider.rating || 4.5}</td>
                            </tr>
                          )) : (
                            <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No riders found</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </>
              )}

              {/* USERS SECTION */}
              {activeSection === "users" && (
                <>
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                    <h1>Users Management</h1>
                    <p>Manage all platform users and accounts.</p>
                  </motion.div>
                  <motion.div className="glass-card">
                    <div className="card-header">
                      <h3>👥 All Users ({users.length})</h3>
                    </div>
                    <div className="table-wrapper">
                      <table className="orders-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.length > 0 ? users.map(user => (
                            <tr key={user._id}>
                              <td>#{user._id?.slice(-6) || 'N/A'}</td>
                              <td>{user.name || 'N/A'}</td>
                              <td>{user.email || 'N/A'}</td>
                              <td>{user.phone || 'N/A'}</td>
                              <td><span className="status-badge badge-delivered">✓ Active</span></td>
                            </tr>
                          )) : (
                            <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No users found</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </>
              )}

              {/* PAYMENTS SECTION */}
              {activeSection === "payments" && (
                <>
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                    <h1>Payments Management</h1>
                    <p>View all payment transactions.</p>
                  </motion.div>
                  <motion.div className="glass-card">
                    <div className="card-header">
                      <h3>💳 Recent Transactions</h3>
                    </div>
                    <p style={{padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)'}}>Payment section coming soon...</p>
                  </motion.div>
                </>
              )}

              {/* ANALYTICS SECTION */}
              {activeSection === "analytics" && (
                <>
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                    <h1>Analytics</h1>
                    <p>View platform analytics and insights.</p>
                  </motion.div>
                  <motion.div className="glass-card">
                    <div className="card-header">
                      <h3>📈 Coming Soon</h3>
                    </div>
                    <p style={{padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)'}}>Advanced analytics section coming soon...</p>
                  </motion.div>
                </>
              )}

              {/* REVIEWS SECTION */}
              {activeSection === "reviews" && (
                <>
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                    <h1>Reviews & Ratings</h1>
                    <p>Manage customer reviews and ratings.</p>
                  </motion.div>
                  <motion.div className="glass-card">
                    <div className="card-header">
                      <h3>⭐ Reviews Section</h3>
                    </div>
                    <p style={{padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)'}}>Reviews section coming soon...</p>
                  </motion.div>
                </>
              )}

              {/* SETTINGS SECTION */}
              {activeSection === "settings" && (
                <>
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                    <h1>Settings</h1>
                    <p>Configure admin dashboard settings.</p>
                  </motion.div>
                  <motion.div className="glass-card">
                    <div className="card-header">
                      <h3>⚙️ Settings</h3>
                    </div>
                    <p style={{padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)'}}>Settings section coming soon...</p>
                  </motion.div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default PremiumAdminDashboard;
