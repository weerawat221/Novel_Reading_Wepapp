const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

// Admin only - Role ID 1
const adminOnly = [authorizeRole([1])];

// Public
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin
router.post('/', authenticateToken, adminOnly, categoryController.createCategory);
router.put('/:id', authenticateToken, adminOnly, categoryController.updateCategory);
router.delete('/:id', authenticateToken, adminOnly, categoryController.deleteCategory);

module.exports = router;
