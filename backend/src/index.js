const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 🛡️ Middleware: Production-Grade CORS
app.use(cors({
  origin: [
    'https://smart-finance-tracker-inky.vercel.app', // Your Vercel Live URL
    'http://localhost:3000'                         // Your local dev environment
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); 

// 🛣️ Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);

// 🚀 Test route to verify the server is running on Render
app.get('/test', (req, res) => {
  res.send('🚀 Smart Finance Backend is running in the Cloud!');
});

// 🧪 Database connection verification route
app.get('/db-test', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ message: 'Cloud Database connection successful!', time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// 🏁 Start Server: Binding to 0.0.0.0 for Cloud Deployment
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ Server is humming on port ${PORT}`);
});