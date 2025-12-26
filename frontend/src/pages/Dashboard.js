import React, { useEffect, useState } from 'react';
import { fetchHealth, fetchTransactions } from '../services/api';
import Sidebar from '../components/Sidebar';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const [health, setHealth] = useState({ income: 0, expense: 0, savingsRate: '0%' });
  const [transactions, setTransactions] = useState([]);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    const loadData = async () => {
      try {
        const hRes = await fetchHealth(timeRange);
        const tRes = await fetchTransactions();
        setHealth(hRes.data);
        setTransactions(tRes.data);
      } catch (err) { console.error(err); }
    };
    loadData();
  }, [timeRange]);

  // Logic: Handle empty chart state professionally
  const isDataEmpty = health.expense === 0 && health.income === 0;
  const pieData = isDataEmpty 
    ? [{ name: 'No Data', value: 1 }] 
    : [
        { name: 'Expenses', value: Math.abs(health.expense) },
        { name: 'Savings', value: Math.max(0, health.income - health.expense) }
      ];

  return (
    <div style={{ display: 'flex', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>
        <header style={styles.header}>
          <h1 style={styles.title}><LayoutDashboard size={28} style={{marginRight: '12px'}}/> Dashboard</h1>
          <div style={styles.filterBar}>
            {['Week', 'Month', 'Year'].map((r) => (
              <button key={r} onClick={() => setTimeRange(r.toLowerCase())}
                style={{
                  ...styles.filterBtn, 
                  backgroundColor: timeRange === r.toLowerCase() ? '#1e293b' : '#fff', 
                  color: timeRange === r.toLowerCase() ? '#fff' : '#64748b'
                }}>
                {r}
              </button>
            ))}
          </div>
        </header>

        {/* Summary Cards */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <SummaryCard title="Income" value={`₹${Math.abs(health.income).toLocaleString('en-IN')}`} icon={<TrendingUp color="#10b981" />} />
          <SummaryCard title="Expenses" value={`₹${Math.abs(health.expense).toLocaleString('en-IN')}`} icon={<TrendingDown color="#ef4444" />} />
          <SummaryCard title="Savings Rate" value={health.savingsRate} icon={<Wallet color="#2563eb" />} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
          {/* Expense Breakdown Chart */}
          <div style={styles.sectionContainer}>
            <h3 style={styles.sectionTitle}>Expense Breakdown</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={pieData} 
                    innerRadius={70} 
                    outerRadius={90} 
                    dataKey="value"
                    stroke="none"
                  >
                    {isDataEmpty ? (
                      <Cell fill="#e2e8f0" /> /* Grey for empty state */
                    ) : (
                      <>
                        <Cell fill="#ef4444" /> {/* Expense Color */}
                        <Cell fill="#10b981" /> {/* Savings Color */}
                      </>
                    )}
                  </Pie>
                  {!isDataEmpty && <Tooltip />}
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Transactions List */}
          <div style={styles.sectionContainer}>
            <h3 style={styles.sectionTitle}>Recent Transactions</h3>
            <div style={{ overflowY: 'auto', maxHeight: '330px' }}>
              {transactions.length > 0 ? (
                transactions.map(t => (
                  <div key={t.id} style={styles.transactionRow}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{t.category}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(t.transaction_date).toLocaleDateString()}</div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: t.type === 'EXPENSE' ? '#ef4444' : '#10b981' }}>
                      {/* FIX: Absolute value applied, UI determines sign context */}
                      {t.type === 'EXPENSE' ? '-' : '+'}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '50px' }}>No transactions recorded.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon }) => (
  <div style={styles.card}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
      <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>{title}</span>
      {icon}
    </div>
    <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>{value}</div>
  </div>
);

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' },
  title: { display: 'flex', alignItems: 'center', fontSize: '1.8rem', fontWeight: 'bold' },
  filterBar: { display: 'flex', gap: '8px', backgroundColor: '#fff', padding: '4px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  filterBtn: { padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.2s' },
  card: { flex: 1, padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' },
  sectionContainer: { backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' },
  sectionTitle: { marginBottom: '20px', fontWeight: '700' },
  transactionRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }
};

export default Dashboard;