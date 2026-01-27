const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

// Admin only - Role ID 1
const adminOnly = [authorizeRole([1])];

// ดึงสิทธิ์ทั้งหมด (Admin)
router.get('/', authenticateToken, adminOnly, roleController.getAllRoles);

// ดึงสิทธิ์เดียว (Admin)
router.get('/:id', authenticateToken, adminOnly, roleController.getRoleById);

// เพิ่มสิทธิ์ (Admin)
router.post('/', authenticateToken, adminOnly, roleController.createRole);

// แก้ไขสิทธิ์ (Admin)
router.put('/:id', authenticateToken, adminOnly, roleController.updateRole);

// ลบสิทธิ์ (Admin)
router.delete('/:id', authenticateToken, adminOnly, roleController.deleteRole);

module.exports = router;
