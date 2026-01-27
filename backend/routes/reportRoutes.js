
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

// Admin = 1, Author = 2
const adminOnly = [authorizeRole([1])];
const authorAndAdmin = [authorizeRole([1, 2])];

// รายงาน: ยอดผู้เข้าใช้งานรายเดือน (Admin)
router.get('/admin/monthly-usage', authenticateToken, adminOnly, reportController.getMonthlyUsageReport);

// รายงาน: ยอดผู้เข้าใช้งานรายวัน (Admin)
router.get('/admin/daily-usage', authenticateToken, adminOnly, reportController.getDailyUsageReport);

// รายงาน: ยอดผู้เข้าใช้งานรายปี (Admin)
router.get('/admin/yearly-usage', authenticateToken, adminOnly, reportController.getYearlyUsageReport);

// ==================== ADMIN REPORTS ====================

// รายงาน: ผู้ใช้ทั้งหมด
router.get('/admin/total-users', authenticateToken, adminOnly, reportController.getTotalUsersReport);

// รายงาน: ผู้ใช้รายวัน
router.get('/admin/daily-users', authenticateToken, adminOnly, reportController.getDailyUsersReport);

// รายงาน: ผู้ใช้รายเดือน (เดิม)
router.get('/admin/monthly-users', authenticateToken, adminOnly, reportController.getMonthlyUsersReport);

// รายงาน: ผู้ใช้รายปี
router.get('/admin/yearly-users', authenticateToken, adminOnly, reportController.getYearlyUsersReport);

// รายงาน: ยอดผู้เข้าชมตามประเภทนิยาย
router.get('/admin/views-by-category', authenticateToken, adminOnly, reportController.getViewsByCategory);

// รายงาน: ยอดผู้เข้าชมตามผู้แต่ง
router.get('/admin/views-by-author', authenticateToken, adminOnly, reportController.getViewsByAuthor);

// ==================== AUTHOR REPORTS ====================

// รายงาน: ยอดผู้เข้าชมของแต่ละเรื่อง (Author)
router.get('/author/my-views', authenticateToken, authorAndAdmin, reportController.getAuthorViewReport);

// รายงาน: ยอดผู้แสดงความคิดเห็นของแต่ละตอน (Author)
router.get('/author/comments', authenticateToken, authorAndAdmin, reportController.getAuthorCommentReport);

// ==================== PUBLIC REPORTS ====================

// รายงาน: นิยายยอดนิยม (ทุกคน)
router.get('/public/popular-novels', reportController.getPopularNovelsReport);

// ==================== SYSTEM ====================

// รายงาน: สถิติทั่วไป (Admin)
router.get('/admin/system-stats', authenticateToken, adminOnly, reportController.getSystemStats);

module.exports = router;
