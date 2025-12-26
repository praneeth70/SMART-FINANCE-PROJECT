const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, budgetController.setBudget);
router.get('/', auth, budgetController.getBudgets);

module.exports = router;