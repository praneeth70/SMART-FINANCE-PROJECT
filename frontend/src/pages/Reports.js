import React, { useEffect, useState } from 'react';
import { fetchTransactions, fetchHealth } from '../services/api';
import Sidebar from '../components/Sidebar';
import { FileText, Printer } from 'lucide-react';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [health, setHealth] = useState({ income: 0, expense: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const tRes = await fetchTransactions();
        const hRes = await fetchHealth('year');
        setTransactions(tRes.data);
        setHealth(hRes.data);
      } catch (err) { console.error(err); }
    };
    loadData();
  }, []);

  return (
    <div style={{ display: 'flex', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>
        <h1 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center' }}>
          <FileText size={28} style={{marginRight: '12px'}}/> Financial Report
        </h1>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{flex: 1, textAlign: 'center'}}>
            <span style={{color: '#64748b', fontSize: '0.8rem'}}>TOTAL INCOME</span>
            <h2 style={{color: '#10b981'}}>₹{Math.abs(health.income).toLocaleString('en-IN')}</h2>
          </div>
          <div style={{flex: 1, textAlign: 'center'}}>
            <span style={{color: '#64748b', fontSize: '0.8rem'}}>TOTAL EXPENSES</span>
            <h2 style={{color: '#ef4444'}}>₹{Math.abs(health.expense).toLocaleString('en-IN')}</h2>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Category</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={styles.td}>{new Date(t.transaction_date).toLocaleDateString()}</td>
                  <td style={styles.td}>{t.category}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontWeight: 'bold', color: t.type === 'EXPENSE' ? '#ef4444' : '#10b981' }}>
                    {/* FIX: Absolute value applied here too */}
                    {t.type === 'EXPENSE' ? '-' : '+'}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  th: { padding: '15px 20px', fontSize: '0.85rem', color: '#64748b', textAlign: 'left' },
  td: { padding: '15px 20px', color: '#334155' }
};

export default Reports;