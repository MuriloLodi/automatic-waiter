import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Login from './pages/auth/Login';
import CustomerDashboard from './pages/customer/Dashboard';
import Menu from './pages/customer/Menu';
import Cart from './pages/customer/Cart';
import OrderTracking from './pages/customer/OrderTracking';
import OrderHistory from './pages/customer/OrderHistory';
import AdminDashboard from './pages/admin/Dashboard';
import MenuManagement from './pages/admin/MenuManagement';
import AdminOrderHistory from './pages/admin/OrderHistory';
import SalesReports from './pages/admin/SalesReports';
import './App.css';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useApp();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function AppRoutes() {
  const { isAuthenticated, user } = useApp();
  
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }
  
  // Rotas baseadas no papel do usuário
  if (user.role === 'admin' || user.role === 'waiter') {
    return (
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/menu-management" element={<MenuManagement />} />
        <Route path="/orders" element={<AdminOrderHistory />} />
        <Route path="/reports" element={<SalesReports />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
  
  // Rotas para clientes
  return (
    <Routes>
      <Route path="/" element={<CustomerDashboard />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/order-tracking" element={<OrderTracking />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <AppRoutes />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;

