const db = require('../config/db');

// @desc    Set or Update a budget for a category
exports.setBudget = async (req, res) => {
  const { category, monthly_limit, month_year } = req.body;
  const userId = req.user;

  try {
    const query = `
      INSERT INTO fin.budgets (user_id, category, monthly_limit, month_year)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, category, month_year) 
      DO UPDATE SET monthly_limit = EXCLUDED.monthly_limit
      RETURNING *;
    `;
    
    const result = await db.query(query, [userId, category, monthly_limit, month_year]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to set budget' });
  }
};

// @desc    Get all budgets for the logged-in user
exports.getBudgets = async (req, res) => {
  const userId = req.user;

  try {
    const result = await db.query(
      'SELECT * FROM fin.budgets WHERE user_id = $1 ORDER BY month_year DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
};