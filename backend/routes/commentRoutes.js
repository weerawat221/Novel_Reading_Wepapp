const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

// Admin = 1
const adminOnly = [authorizeRole([1])];

// Public
router.get('/', commentController.getAllComments);
router.get('/:id', commentController.getCommentById);

// User & Author & Admin (ต้อง Login)
router.post('/', authenticateToken, commentController.createComment);
router.put('/:id', authenticateToken, commentController.updateComment);
router.delete('/:id', authenticateToken, commentController.deleteComment);

module.exports = router;
