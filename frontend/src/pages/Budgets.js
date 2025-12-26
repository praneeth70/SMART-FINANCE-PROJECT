import React, { useEffect, useState } from 'react';
import { fetchBudgets, setBudget } from '../services/api';
import Sidebar from '../components/Sidebar';
import { Wallet, AlertTriangle, PlusCircle } from 'lucide-react';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ category: 'Food', monthly_limit: 0 });

  const loadBudgets = async () => {
    try {
      const { data } = await fetchBudgets();
      setBudgets(data);
    } catch (err) {
      console.error("Budget Fetch Error:", err);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleSetBudget = async (e) => {
    e.preventDefault();
    try {
      // Logic: month_year is formatted for the current month's start
      const monthYear = new Date().toISOString().slice(0, 7) + "-01";
      await setBudget({ ...newBudget, month_year: monthYear });
      alert('Budget updated successfully!');
      loadBudgets();
    } catch (err) {
      alert('Failed to set budget');
    }
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center' }}>
            <Wallet size={28} style={{ marginRight: '12px' }} /> Monthly Budgets
          </h1>
          <p style={{ color: '#64748b' }}>Set spending limits to trigger real-time alerts.</p>
        </header>

        {/* Form: Set New Budget */}
        <div style={styles.card}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
            <PlusCircle size={18} style={{ marginRight: '8px' }} /> Set Category Limit
          </h3>
          <form onSubmit={handleSetBudget} style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Category</label>
              <select 
                style={styles.input} 
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
              >
                <option value="Food">Food</option>
                <option value="Rent">Rent</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Limit Amount (₹)</label>
              <input 
                type="number" 
                placeholder="e.g. 5000"
                style={styles.input} 
                onChange={(e) => setNewBudget({ ...newBudget, monthly_limit: e.target.value })} 
              />
            </div>
            <button style={styles.button}>Update Budget</button>
          </form>
        </div>

        {/* List: Current Budgets & Progress */}
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: 'bold' }}>Active Spending Limits</h3>
          <div style={styles.budgetGrid}>
            {budgets.length > 0 ? budgets.map((b) => {
              // Sign-Logic Fix: Using absolute values for clean UI
              const spent = Math.abs(b.current_spent || 0);
              const limit = b.monthly_limit;
              const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
              const isOver = spent > limit;

              // Severity Color Logic
              const barColor = percent >= 100 ? '#ef4444' : percent > 80 ? '#f59e0b' : '#10b981';

              return (
                <div key={b.id} style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{b.category}</span>
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      ₹{spent.toLocaleString('en-IN')} / <span style={{ fontWeight: '600' }}>₹{limit.toLocaleString('en-IN')}</span>
                    </span>
                  </div>
                  
                  {/* Visual Progress Bar */}
                  <div style={styles.progressBg}>
                    <div style={{ ...styles.progressFill, width: `${percent}%`, backgroundColor: barColor }} />
                  </div>

                  {/* Smart Feedback Alerts */}
                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{percent.toFixed(0)}% Utilized</span>
                    {isOver && (
                      <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                        <AlertTriangle size={14} style={{ marginRight: '4px' }} /> Over Budget
                      </span>
                    )}
                  </div>
                </div>
              );
            }) : <p style={{ color: '#94a3b8' }}>No budgets set yet. Use the form above to start tracking.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: { backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
  label: { color: '#64748b', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '5px', display: 'block' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '5px', outline: 'none', transition: '0.2s' },
  button: { padding: '12px 24px', backgroundColor: '#1e293b', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' },
  budgetGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' },
  progressBg: { width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' },
  progressFill: { height: '100%', transition: '0.6s width cubic-bezier(0.4, 0, 0.2, 1)' }
};

export default Budgets;