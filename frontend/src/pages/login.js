import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate, Link } from 'react-router-dom'; // Added Link for navigation
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(formData);
      localStorage.setItem('token', data.token); // Store JWT for session persistence
      navigate('/dashboard');
    } catch (err) {
      alert('Login Failed: ' + (err.response?.data?.error || 'Invalid Credentials'));
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <LogIn size={40} color="#10b981" />
          <h2 style={{ color: '#1e293b', marginTop: '10px' }}>Login</h2>
        </div>

        <div style={styles.inputGroup}>
          <Mail size={20} color="#94a3b8" />
          <input 
            type="email" 
            placeholder="testuser@example.com" 
            required 
            style={styles.input}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div style={styles.inputGroup}>
          <Lock size={20} color="#94a3b8" />
          <input 
            type="password" 
            placeholder="••••••••••••" 
            required 
            style={styles.input}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button type="submit" style={styles.button}>Sign In</button>

        {/* Link to the Register page */}
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={styles.link}>Register Here</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' },
  form: { padding: '40px', borderRadius: '16px', backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '400px', border: '1px solid #e2e8f0' },
  inputGroup: { display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', padding: '10px 15px', borderRadius: '10px', marginBottom: '15px' },
  input: { border: 'none', outline: 'none', marginLeft: '10px', width: '100%' },
  button: { width: '100%', padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  link: { color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }
};

export default Login;