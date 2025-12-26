const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/authMiddleware');

// Add both routes here
router.post('/', auth, transactionController.addTransaction);
router.get('/', auth, transactionController.getTransactions); // New line!
router.get('/summary', auth, transactionController.getMonthlySummary);
router.delete('/:id', auth, transactionController.deleteTransaction);
module.exports = router;