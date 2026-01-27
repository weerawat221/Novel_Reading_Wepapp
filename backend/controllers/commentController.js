const pool = require('../config/db');

// ดึงความเห็นทั้งหมด
exports.getAllComments = async (req, res) => {
    try {
        const { novelID, chapterID } = req.query;

        const connection = await pool.getConnection();
        let query = 'SELECT c.*, u.Username, n.Title as NovelTitle FROM Comments c LEFT JOIN Users u ON c.UserID = u.UserID LEFT JOIN Novels n ON c.NovelID = n.NovelID';
        let params = [];
        let conditions = [];

        if (novelID) {
            conditions.push('c.NovelID = ?');
            params.push(novelID);
        }

        if (chapterID) {
            conditions.push('c.ChapterID = ?');
            params.push(chapterID);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY c.CommentedAt DESC';

        const [comments] = await connection.query(query, params);
        connection.release();

        return res.status(200).json({
            success: true,
            total: comments.length,
            comments: comments
        });
    } catch (error) {
        console.error('Get comments error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลความเห็น',
            error: error.message
        });
    }
};

// ดึงความเห็นเดียว
exports.getCommentById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ ID ของความเห็น'
            });
        }

        const connection = await pool.getConnection();
        const [comments] = await connection.query(
            'SELECT c.*, u.Username FROM Comments c LEFT JOIN Users u ON c.UserID = u.UserID WHERE c.CommentID = ?',
            [id]
        );
        connection.release();

        if (comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบความเห็นที่ค้นหา'
            });
        }

        return res.status(200).json({
            success: true,
            comment: comments[0]
        });
    } catch (error) {
        console.error('Get comment error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลความเห็น',
            error: error.message
        });
    }
};

// สร้างความเห็นใหม่ (User & Author & Admin)
exports.createComment = async (req, res) => {
    try {
        const { novelID, chapterID, message } = req.body;
        const userID = req.user.userID;

        if (!message || (!novelID && !chapterID)) {
            return res.status(400).json({
                success: false,
                message: 'กรุณากรอกข้อมูลให้ครบ'
            });
        }

        const connection = await pool.getConnection();

        // ตรวจสอบว่านิยายหรือตอนนี้มีอยู่หรือไม่
        if (novelID) {
            const [novels] = await connection.query(
                'SELECT * FROM Novels WHERE NovelID = ?',
                [novelID]
            );

            if (novels.length === 0) {
                connection.release();
                return res.status(404).json({
                    success: false,
                    message: 'ไม่พบนิยายที่ระบุ'
                });
            }
        }

        if (chapterID) {
            const [chapters] = await connection.query(
                'SELECT * FROM Chapters WHERE ChapterID = ?',
                [chapterID]
            );

            if (chapters.length === 0) {
                connection.release();
                return res.status(404).json({
                    success: false,
                    message: 'ไม่พบตอนนิยายที่ระบุ'
                });
            }
        }

        const [result] = await connection.query(
            'INSERT INTO Comments (UserID, NovelID, ChapterID, Message) VALUES (?, ?, ?, ?)',
            [userID, novelID || null, chapterID || null, message]
        );
        connection.release();

        return res.status(201).json({
            success: true,
            message: 'สร้างความเห็นสำเร็จ',
            commentID: result.insertId
        });
    } catch (error) {
        console.error('Create comment error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการสร้างความเห็น',
            error: error.message
        });
    }
};

// แก้ไขความเห็น (User & Admin)
exports.updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const userID = req.user.userID;

        if (!id || !message) {
            return res.status(400).json({
                success: false,
                message: 'กรุณากรอกข้อมูลให้ครบ'
            });
        }

        const connection = await pool.getConnection();

        // ตรวจสอบว่าความเห็นนี้มีอยู่หรือไม่
        const [comments] = await connection.query(
            'SELECT * FROM Comments WHERE CommentID = ?',
            [id]
        );

        if (comments.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'ไม่พบความเห็นที่ต้องการแก้ไข'
            });
        }

        // ตรวจสอบสิทธิ์
        if (req.user.roleID !== 1 && comments[0].UserID !== userID) {
            connection.release();
            return res.status(403).json({
                success: false,
                message: 'คุณไม่มีสิทธิ์แก้ไขความเห็นนี้'
            });
        }

        await connection.query(
            'UPDATE Comments SET Message = ? WHERE CommentID = ?',
            [message, id]
        );
        connection.release();

        return res.status(200).json({
            success: true,
            message: 'แก้ไขความเห็นสำเร็จ'
        });
    } catch (error) {
        console.error('Update comment error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการแก้ไขความเห็น',
            error: error.message
        });
    }
};

// ลบความเห็น (User & Admin)
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userID = req.user.userID;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ ID ของความเห็น'
            });
        }

        const connection = await pool.getConnection();

        // ตรวจสอบว่าความเห็นนี้มีอยู่หรือไม่
        const [comments] = await connection.query(
            'SELECT * FROM Comments WHERE CommentID = ?',
            [id]
        );

        if (comments.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'ไม่พบความเห็นที่ต้องการลบ'
            });
        }

        // ตรวจสอบสิทธิ์
        if (req.user.roleID !== 1 && comments[0].UserID !== userID) {
            connection.release();
            return res.status(403).json({
                success: false,
                message: 'คุณไม่มีสิทธิ์ลบความเห็นนี้'
            });
        }

        await connection.query('DELETE FROM Comments WHERE CommentID = ?', [id]);
        connection.release();

        return res.status(200).json({
            success: true,
            message: 'ลบความเห็นสำเร็จ'
        });
    } catch (error) {
        console.error('Delete comment error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการลบความเห็น',
            error: error.message
        });
    }
};
