import React, { useState } from 'react';
import { register } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert('Registration Successful! Please Login.');
      navigate('/login');
    } catch (err) {
      alert('Registration Failed: ' + (err.response?.data?.error || 'Server Error'));
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <UserPlus size={40} color="#1e293b" />
          <h2 style={{ color: '#1e293b', marginTop: '10px' }}>Create Account</h2>
        </div>

        <div style={styles.inputGroup}>
          <User size={20} color="#94a3b8" />
          <input type="text" placeholder="Full Name" required style={styles.input}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>

        <div style={styles.inputGroup}>
          <Mail size={20} color="#94a3b8" />
          <input type="email" placeholder="Email" required style={styles.input}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </div>

        <div style={styles.inputGroup}>
          <Lock size={20} color="#94a3b8" />
          <input type="password" placeholder="Password" required style={styles.input}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        </div>

        <button type="submit" style={styles.button}>Sign Up</button>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b' }}>
          Already have an account? <Link to="/login" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}>Login</Link>
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
  button: { width: '100%', padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#1e293b', color: 'white', fontWeight: 'bold', cursor: 'pointer' }
};

export default Register;