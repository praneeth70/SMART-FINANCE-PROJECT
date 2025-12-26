import React, { useEffect, useState } from 'react';
import { fetchHealth, fetchTransactions } from '../services/api';
import Sidebar from '../components/Sidebar';
import { Lightbulb, Target, AlertCircle, CheckCircle } from 'lucide-react';

const Insights = () => {
  const [health, setHealth] = useState({ income: 0, expense: 0, savingsRate: '0%' });
  const [topCategory, setTopCategory] = useState({ name: 'None', amount: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const hRes = await fetchHealth('month');
        const tRes = await fetchTransactions();
        
        // Logic: Calculate highest spending category
        const totals = tRes.data.reduce((acc, t) => {
          if (t.type === 'EXPENSE') {
            acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
          }
          return acc;
        }, {});
        
        const top = Object.keys(totals).reduce((a, b) => totals[a] > totals[b] ? a : b, 'None');
        setHealth(hRes.data);
        setTopCategory({ name: top, amount: totals[top] || 0 });
      } catch (err) { console.error(err); }
    };
    loadData();
  }, []);

  const savingsNum = parseFloat(health.savingsRate);

  // Hard Truth: Determine color based on financial health
  const getSeverity = () => {
    if (savingsNum >= 25) return { bg: '#ecfdf5', text: '#065f46', border: '#d1fae5', label: 'Healthy' };
    if (savingsNum >= 15) return { bg: '#fffbeb', text: '#b45309', border: '#fef3c7', label: 'Warning' };
    return { bg: '#fef2f2', text: '#991b1b', border: '#fee2e2', label: 'Alert' };
  };

  const severity = getSeverity();

  return (
    <div style={{ display: 'flex', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>
        <h1 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
          <Lightbulb size={28} style={{ marginRight: '12px', color: '#f59e0b' }} /> Smart Insights
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}><Target size={18} /> Savings Goal Status</h3>
            <h2 style={{ fontSize: '2.5rem', color: savingsNum > 20 ? '#10b981' : '#f59e0b', margin: '20px 0' }}>
              {health.savingsRate}
            </h2>
            <p style={styles.advice}>
              {savingsNum > 25 
                ? "Excellent! Your savings are above the 25% safety threshold. You are building long-term wealth." 
                : "Your savings are low. Try reducing discretionary spending to reach a 25% monthly target."}
            </p>
          </div>

          <div style={{ ...styles.card, backgroundColor: severity.bg, borderColor: severity.border, color: severity.text }}>
            <h3 style={{ ...styles.cardTitle, color: severity.text }}><AlertCircle size={18} /> {severity.label}: Spending Pattern</h3>
            {topCategory.amount > (health.income * 0.4) ? (
              <p style={{ marginTop: '15px' }}>Your <strong>{topCategory.name}</strong> expenses are over 40% of your income. This is an imbalance.</p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
                <CheckCircle size={20} /> <p>Your spending across categories is well-distributed.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: { backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
  cardTitle: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', color: '#334155', fontWeight: 'bold' },
  advice: { fontSize: '0.9rem', color: '#475569', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }
};

export default Insights;