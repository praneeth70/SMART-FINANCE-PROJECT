const db = require('../config/db');

// @desc    Add a new income or expense (with Budget Alert check)
exports.addTransaction = async (req, res) => {
  const { amount, category, description, type, transaction_date } = req.body;
  const userId = req.user; // Securely identified by middleware

  try {
    // 1. Insert the transaction into the database
    const result = await db.query(
      'INSERT INTO fin.transactions (user_id, amount, category, description, type, transaction_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, amount, category, description, type, transaction_date || new Date()]
    );

    const savedTransaction = result.rows[0];

    // 2. Check if this caused a Budget Overrun (The "Rules Engine" check)
    let alert = null;
    if (type === 'EXPENSE') {
      const budgetCheck = await db.query(
        `SELECT monthly_limit, current_spent 
         FROM fin.budgets 
         WHERE user_id = $1 AND category = $2 
         AND month_year = date_trunc('month', $3::date)`,
        [userId, category, transaction_date || new Date()]
      );

      if (budgetCheck.rows.length > 0) {
        const { monthly_limit, current_spent } = budgetCheck.rows[0];
        // Note: the DB trigger has already updated current_spent by the time this runs
        if (current_spent > monthly_limit) {
          alert = `⚠️ Warning: You have exceeded your ${category} budget! Limit: ${monthly_limit}, Spent: ${current_spent}`;
        }
      }
    }

    res.status(201).json({
      transaction: savedTransaction,
      alert: alert
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
};

// @desc    Get all transactions for the logged-in user
exports.getTransactions = async (req, res) => {
  const userId = req.user;

  try {
    const result = await db.query(
      'SELECT * FROM fin.transactions WHERE user_id = $1 ORDER BY transaction_date DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// @desc    Get total income and expenses for the current month
exports.getMonthlySummary = async (req, res) => {
  const userId = req.user;

  try {
    const query = `
      SELECT 
        type, 
        SUM(amount) as total 
      FROM fin.transactions 
      WHERE user_id = $1 
      AND date_trunc('month', transaction_date) = date_trunc('month', CURRENT_DATE)
      GROUP BY type
    `;
    
    const result = await db.query(query, [userId]);
    
    const summary = {
      INCOME: 0,
      EXPENSE: 0
    };
    
    result.rows.forEach(row => {
      summary[row.type] = parseFloat(row.total);
    });

    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};

// @desc    Delete a specific transaction
exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  try {
    const result = await db.query(
      'DELETE FROM fin.transactions WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during deletion' });
  }
};