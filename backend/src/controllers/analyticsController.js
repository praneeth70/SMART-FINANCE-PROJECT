const db = require('../config/db');

exports.getHealthCheck = async (req, res) => {
  const userId = req.user;

  try {
    const query = `
      SELECT 
        SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) as total_expense
      FROM fin.transactions
      WHERE user_id = $1
      AND date_trunc('month', transaction_date) = date_trunc('month', CURRENT_DATE)
    `;

    const result = await db.query(query, [userId]);
    const { total_income, total_expense } = result.rows[0];
    
    const income = parseFloat(total_income) || 0;
    const expense = parseFloat(total_expense) || 0;
    const savings = income - expense;
    const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(2) : 0;

    res.json({
      month: new Date().toLocaleString('default', { month: 'long' }),
      income,
      expense,
      savings,
      savingsRate: `${savingsRate}%`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch financial health' });
  }
};