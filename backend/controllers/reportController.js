// รายงาน: ยอดผู้เข้าใช้งานรายเดือน (Admin)
exports.getMonthlyUsageReport = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [report] = await connection.query(`
            SELECT 
                DATE_FORMAT(LastReadAt, '%Y-%m') as month,
                COUNT(DISTINCT UserID) as userCount,
                COUNT(*) as totalReads
            FROM readinghistory
            WHERE LastReadAt >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(LastReadAt, '%Y-%m')
            ORDER BY month DESC
        `);
        connection.release();
        return res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Monthly usage report error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงรายงาน',
            error: error.message
        });
    }
};
// รายงาน: ยอดผู้เข้าใช้งานรายวัน (Admin)
exports.getDailyUsageReport = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [report] = await connection.query(`
            SELECT 
                DATE(LastReadAt) as date,
                COUNT(DISTINCT UserID) as userCount,
                COUNT(*) as totalReads
            FROM readinghistory
            WHERE LastReadAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(LastReadAt)
            ORDER BY date DESC
        `);
        connection.release();
        return res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Daily usage report error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงรายงาน',
            error: error.message
        });
    }
};

// รายงาน: ยอดผู้เข้าใช้งานรายปี (Admin)
exports.getYearlyUsageReport = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [report] = await connection.query(`
            SELECT 
                YEAR(LastReadAt) as year,
                COUNT(DISTINCT UserID) as userCount,
                COUNT(*) as totalReads
            FROM readinghistory
            WHERE LastReadAt >= DATE_SUB(NOW(), INTERVAL 5 YEAR)
            GROUP BY YEAR(LastReadAt)
            ORDER BY year DESC
        `);
        connection.release();
        return res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Yearly usage report error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงรายงาน',
            error: error.message
        });
    }
};
const pool = require('../config/db');

// ========== ADMIN REPORTS ==========

// รายงาน: ผู้ใช้ทั้งหมด (Admin)
exports.getTotalUsersReport = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [[result]] = await connection.query('SELECT COUNT(*) as total FROM Users');
        connection.release();

        return res.status(200).json({
            success: true,
            totalUsers: result.total
        });
    } catch (error) {
        console.error('Total users report error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงรายงาน',
            error: error.message
        });
    }
};

// รายงาน: ผู้ใช้รายวัน (Admin)
exports.getDailyUsersReport = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [report] = await connection.query(`
            SELECT 
                DATE(CreatedAt) as date,
                COUNT(*) as newUsers
            FROM Users
            WHERE CreatedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(CreatedAt)
            ORDER BY date DESC
        `);
        connection.release();

        return res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Daily users report error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงรายงาน',
            error: error.message
        });
    }
};

// รายงาน: ผู้ใช้รายเดือน (Admin)
exports.getMonthlyUsersReport = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [report] = await connection.query(`
            SELECT 
                DATE_FORMAT(CreatedAt, '%Y-%m') as month,
                COUNT(*) as newUsers
            FROM Users
            WHERE CreatedAt >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(CreatedAt, '%Y-%m')
            ORDER BY month DESC
        `);
        connection.release();

        return res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Monthly users report error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงรายงาน',
            error: error.message
        });
    }
};

// รายงาน: ผู้ใช้รายปี (Admin)
exports.getYearlyUsersReport = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [report] = await connection.query(`
            SELECT 
                YEAR(CreatedAt) as year,
                COUNT(*) as newUsers
            FROM Users
            WHERE CreatedAt >= DATE_SUB(NOW(), INTERVAL 5 YEAR)
            GROUP BY YEAR(CreatedAt)
            ORDER BY year DESC
        `);
        connection.release();

        return res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Yearly users report error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงรายงาน',
            error: error.message
        });
    }
};

// รายงาน: ยอดผู้เข้าชมตามประเภทนิยาย (Admin)
exports.getViewsByCategory = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [report] = await connection.query(`
            SELECT 
                c.CategoryID,
                c.CategoryName,
                COUNT(DISTINCT nc.NovelID) as novelCount,
                COALESCE(SUM(n.ViewCount), 0) as totalViews
            FROM Categories c
            LEFT JOIN Novel_Categories nc ON c.CategoryID = nc.CategoryID
            LEFT JOIN Novels n ON nc.NovelID = n.NovelID
            GROUP BY c.CategoryID, c.CategoryName
            ORDER BY totalViews DESC
        `);
        connection.release();

        return res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Views by category report error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงรายงาน',
            error: error.message
        });
    }
};

// รายงาน: ยอดผู้เข้าชมตามผู้แต่ง (Admin)
exports.getViewsByAuthor = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [report] = await connection.query(`
            SELECT 
                u.UserID,
                u.Username,
                COUNT(n.NovelID) as novelCount,
                SUM(n.ViewCount) as totalViews
            FROM Users u
            LEFT JOIN Novels n ON u.UserID = n.AuthorID
            WHERE u.RoleID = 2
            GROUP BY u.UserID, u.Username
            ORDER BY totalViews DESC
        `);
        connection.release();

        return res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Views by author report error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงรายงาน',
            error: error.message
        });
    }
};

// ========== AUTHOR REPORTS ==========

// รายงาน: ยอดผู้เข้าชมของแต่ละเรื่องที่แต่ง (Author)
exports.getAuthorViewReport = async (req, res) => {
    try {
        const authorID = req.user.userID;

        const connection = await pool.getConnection();

        const [report] = await connection.query(`
            SELECT 
                n.NovelID,
                n.Title,
                n.ViewCount,
                COUNT(DISTINCT c.CommentID) as commentCount,
                n.CreatedAt
            FROM Novels n
            LEFT JOIN Comments c ON n.NovelID = c.NovelID
            WHERE n.AuthorID = ?
            GROUP BY n.NovelID, n.Title, n.ViewCount, n.CreatedAt
            ORDER BY n.ViewCount DESC
        `, [authorID]);

        connection.release();

        return res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {
        console.error('Author view report error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงรายงาน',
            error: error.message
        });
    }
};

// รายงาน: ยอดผู้แสดงความคิดเห็นของแต่ละตอนที่แต่ง (Author)
exports.getAuthorCommentReport = async (req, res) => {
    try {
        const authorID = req.user.userID;

        const connection = await pool.getConnection();

        const [report] = await connection.query(`
            SELECT 
                ch.ChapterID,
                ch.ChapterNumber,
                ch.Title as ChapterTitle,
                n.Title as NovelTitle,
                COUNT(c.CommentID) as commentCount,
                COUNT(DISTINCT c.UserID) as uniqueCommenters
            FROM Chapters ch
            LEFT JOIN Novels n ON ch.NovelID = n.NovelID
            LEFT JOIN Comments c ON ch.ChapterID = c.ChapterID
            WHERE n.AuthorID = ?
            GROUP BY ch.ChapterID, ch.ChapterNumber, ch.Title, n.Title
            ORDER BY commentCount DESC
        `, [authorID]);

        connection.release();

        return res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {
        console.error('Author comment report error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงรายงาน',
            error: error.message
        });
    }
};

// รายงาน: นิยายยอดนิยม (Public - ทุกคน)
exports.getPopularNovelsReport = async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [report] = await connection.query(`
            SELECT 
                n.NovelID,
                n.Title,
                u.Username as AuthorName,
                c.CategoryName,
                n.ViewCount,
                COUNT(DISTINCT ch.ChapterID) as chapterCount,
                COUNT(DISTINCT cm.CommentID) as commentCount
            FROM Novels n
            LEFT JOIN Users u ON n.AuthorID = u.UserID
            LEFT JOIN Categories c ON n.CategoryID = c.CategoryID
            LEFT JOIN Chapters ch ON n.NovelID = ch.NovelID
            LEFT JOIN Comments cm ON n.NovelID = cm.NovelID
            GROUP BY n.NovelID, n.Title, u.Username, c.CategoryName, n.ViewCount
            ORDER BY n.ViewCount DESC
            LIMIT 20
        `);

        connection.release();

        return res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {
        console.error('Popular novels report error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงรายงาน',
            error: error.message
        });
    }
};

// รายงาน: สถิติทั่วไปของระบบ (Admin)
exports.getSystemStats = async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [[stats]] = await connection.query(`
            SELECT 
                (SELECT COUNT(*) FROM Users) as totalUsers,
                (SELECT COUNT(*) FROM Novels) as totalNovels,
                (SELECT COUNT(*) FROM Chapters) as totalChapters,
                (SELECT COUNT(*) FROM Comments) as totalComments,
                (SELECT SUM(ViewCount) FROM Novels) as totalViews,
                (SELECT COUNT(*) FROM Users WHERE RoleID = 2) as totalAuthors
        `);

        connection.release();

        return res.status(200).json({
            success: true,
            stats: stats
        });

    } catch (error) {
        console.error('System stats error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงสถิติ',
            error: error.message
        });
    }
};
