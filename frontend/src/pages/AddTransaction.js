import React, { useState } from 'react';
import { addTransaction } from '../services/api';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, IndianRupee } from 'lucide-react';

const AddTransaction = () => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    type: 'EXPENSE',
    description: '',
    transaction_date: new Date().toISOString().split('T')[0]
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addTransaction(formData);
      // If the backend returns a budget warning, we alert the user
      if (data.alert) {
        alert(data.alert);
      } else {
        alert('Transaction Added Successfully!');
      }
      navigate('/dashboard'); // Go back to see the updated charts
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Failed to add transaction'));
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '260px', flex: 1, padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div style={styles.formCard}>
          <h2 style={styles.title}><PlusCircle size={24} style={{marginRight: '10px'}}/> Add New Transaction</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label>Amount (₹)</label>
              <input 
                type="number" step="0.01" required
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                style={styles.input}
                placeholder="0.00"
              />
            </div>

            <div style={styles.inputGroup}>
              <label>Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                style={styles.input}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label>Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={styles.input}
              >
                <option value="Food">Food</option>
                <option value="Rent">Rent</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Salary">Salary (Income)</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label>Date</label>
              <input 
                type="date" required
                value={formData.transaction_date}
                onChange={(e) => setFormData({...formData, transaction_date: e.target.value})}
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.button}>Save Transaction</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  formCard: { maxWidth: '500px', margin: '0 auto', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  title: { display: 'flex', alignItems: 'center', marginBottom: '25px', color: '#1e293b' },
  inputGroup: { marginBottom: '20px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '5px', fontSize: '1rem' },
  button: { width: '100%', padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};

export default AddTransaction;