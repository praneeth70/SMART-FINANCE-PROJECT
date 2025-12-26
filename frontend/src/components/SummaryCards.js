const Card = ({ title, amount, trend, color }) => (
  <div style={styles.card}>
    <p style={styles.label}>{title}</p>
    <h2 style={styles.amount}>{amount}</h2>
    <p style={{...styles.trend, color: color === 'red' ? '#e53e3e' : '#38a169'}}>
      {trend} vs last month
    </p>
  </div>
);

const styles = {
  card: { flex: 1, padding: '20px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' },
  label: { color: '#718096', margin: 0, fontSize: '0.9rem' },
  amount: { margin: '10px 0', fontSize: '1.5rem', fontWeight: 'bold' },
  trend: { fontSize: '0.8rem', margin: 0 }
};