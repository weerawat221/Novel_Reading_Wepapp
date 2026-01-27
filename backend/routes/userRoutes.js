const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

// Admin only - Role ID 1
const adminOnly = [authorizeRole([1])];

// Public
router.post('/register', userController.register);
router.post('/login', userController.login);

// User Routes (ต้อง Login)
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);
router.post('/change-password', authenticateToken, userController.changePassword);

// Admin Routes
router.get('/', authenticateToken, adminOnly, userController.getAllUsers);
router.get('/:id', authenticateToken, adminOnly, userController.getUserById);
router.post('/', authenticateToken, adminOnly, userController.createUser);
router.put('/:id', authenticateToken, adminOnly, userController.updateUser);
router.delete('/:id', authenticateToken, adminOnly, userController.deleteUser);

module.exports = router;
