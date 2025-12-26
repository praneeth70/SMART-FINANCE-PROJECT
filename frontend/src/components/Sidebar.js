import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  PieChart, 
  BarChart3, 
  Settings, 
  LogOut, 
  FileText 
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear the JWT from storage to end the session
    localStorage.removeItem('token');
    
    // 2. Immediately send the user back to the login screen
    navigate('/login');
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>Smart Finance</div>
      
      <nav style={styles.nav}>
        <NavItem to="/dashboard" icon={<LayoutDashboard size={20}/>} label="Dashboard" />
        <NavItem to="/add" icon={<PlusCircle size={20}/>} label="Add Transaction" />
        <NavItem to="/budgets" icon={<PieChart size={20}/>} label="Budgets" />
        <NavItem to="/insights" icon={<BarChart3 size={20}/>} label="Insights" />
        <NavItem to="/reports" icon={<FileText size={20}/>} label="Reports" />
        <NavItem to="/settings" icon={<Settings size={20}/>} label="Settings" />
      </nav>

      {/* 🚪 THE LOGOUT BUTTON (Visible at the bottom) */}
      <button onClick={handleLogout} style={styles.logoutBtn}>
        <LogOut size={20} style={{ marginRight: '12px' }} />
        Logout
      </button>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    style={({ isActive }) => ({
      ...styles.navLink,
      backgroundColor: isActive ? '#1e293b' : 'transparent',
      color: isActive ? '#fff' : '#64748b'
    })}
  >
    <span style={{ marginRight: '12px' }}>{icon}</span>
    {label}
  </NavLink>
);

const styles = {
  sidebar: { 
    width: '260px', 
    height: '100vh', 
    position: 'fixed', 
    backgroundColor: '#fff', 
    borderRight: '1px solid #e2e8f0', 
    display: 'flex', 
    flexDirection: 'column', 
    padding: '20px',
    boxSizing: 'border-box' 
  },
  logo: { 
    fontSize: '1.5rem', 
    fontWeight: '800', 
    color: '#1e293b', 
    marginBottom: '25px', 
    padding: '0 12px' 
  },
  nav: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '4px', 
    flex: 1,
    overflowY: 'auto' 
  },
  navLink: { 
    display: 'flex', 
    alignItems: 'center', 
    padding: '10px 12px', 
    borderRadius: '8px', 
    textDecoration: 'none', 
    fontWeight: '600', 
    transition: '0.2s',
    marginBottom: '4px'
  },
  logoutBtn: { 
    display: 'flex', 
    alignItems: 'center', 
    padding: '12px', 
    borderRadius: '8px', 
    backgroundColor: '#fef2f2', 
    color: '#991b1b', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    marginTop: '20px', 
    transition: '0.2s',
    border: '1px solid #fee2e2' // Fixed: Only one border definition now
  }
};

export default Sidebar;