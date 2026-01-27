const pool = require('../config/db');

// ดึงตอนของนิยายทั้งหมด
exports.getAllChapters = async (req, res) => {
    try {
        const { novelID } = req.query;

        const connection = await pool.getConnection();
        let query = 'SELECT c.*, n.Title as NovelTitle FROM Chapters c LEFT JOIN Novels n ON c.NovelID = n.NovelID';
        let params = [];

        if (novelID) {
            query += ' WHERE c.NovelID = ?';
            params.push(novelID);
        }

        query += ' ORDER BY c.ChapterNumber ASC';

        const [chapters] = await connection.query(query, params);
        connection.release();

        return res.status(200).json({
            success: true,
            total: chapters.length,
            chapters: chapters
        });
    } catch (error) {
        console.error('Get chapters error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลตอนนิยาย',
            error: error.message
        });
    }
};

// ดึงตอนเดียว
exports.getChapterById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ ID ของตอนนิยาย'
            });
        }

        const connection = await pool.getConnection();
        const [chapters] = await connection.query(
            'SELECT c.*, n.Title as NovelTitle FROM Chapters c LEFT JOIN Novels n ON c.NovelID = n.NovelID WHERE c.ChapterID = ?',
            [id]
        );
        connection.release();

        if (chapters.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบตอนนิยายที่ค้นหา'
            });
        }

        return res.status(200).json({
            success: true,
            chapter: chapters[0]
        });
    } catch (error) {
        console.error('Get chapter error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลตอนนิยาย',
            error: error.message
        });
    }
};

// สร้างตอนใหม่ (Author & Admin)
exports.createChapter = async (req, res) => {
    try {
        const { novelID, chapterNumber, title, content } = req.body;
        const authorID = req.user.userID;

        if (!novelID || !chapterNumber || !title || !content) {
            return res.status(400).json({
                success: false,
                message: 'กรุณากรอกข้อมูลให้ครบ'
            });
        }

        const connection = await pool.getConnection();

        // ตรวจสอบว่านิยายนี้มีอยู่หรือไม่
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

        // ตรวจสอบว่าผู้ใช้เป็นผู้แต่งของนิยายนี้หรือไม่ (ถ้าไม่ใช่ Admin)
        if (req.user.roleID !== 1 && novels[0].AuthorID !== authorID) {
            connection.release();
            return res.status(403).json({
                success: false,
                message: 'คุณไม่มีสิทธิ์เพิ่มตอนให้นิยายนี้'
            });
        }

        // ตรวจสอบว่าเลขตอนนี้มีอยู่แล้วหรือไม่
        const [existing] = await connection.query(
            'SELECT * FROM Chapters WHERE NovelID = ? AND ChapterNumber = ?',
            [novelID, chapterNumber]
        );

        if (existing.length > 0) {
            connection.release();
            return res.status(409).json({
                success: false,
                message: 'ตอนนี้มีอยู่ในระบบแล้ว'
            });
        }

        const [result] = await connection.query(
            'INSERT INTO Chapters (NovelID, ChapterNumber, Title, Content) VALUES (?, ?, ?, ?)',
            [novelID, chapterNumber, title, content]
        );
        connection.release();

        return res.status(201).json({
            success: true,
            message: 'สร้างตอนใหม่สำเร็จ',
            chapterID: result.insertId
        });
    } catch (error) {
        console.error('Create chapter error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการสร้างตอนใหม่',
            error: error.message
        });
    }
};

// แก้ไขตอน (Author & Admin)
exports.updateChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const userID = req.user.userID;

        if (!id || !title || !content) {
            return res.status(400).json({
                success: false,
                message: 'กรุณากรอกข้อมูลให้ครบ'
            });
        }

        const connection = await pool.getConnection();

        // ตรวจสอบว่าตอนนี้มีอยู่หรือไม่
        const [chapters] = await connection.query(
            'SELECT c.*, n.AuthorID FROM Chapters c LEFT JOIN Novels n ON c.NovelID = n.NovelID WHERE c.ChapterID = ?',
            [id]
        );

        if (chapters.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'ไม่พบตอนนิยายที่ต้องการแก้ไข'
            });
        }

        // ตรวจสอบสิทธิ์
        if (req.user.roleID !== 1 && chapters[0].AuthorID !== userID) {
            connection.release();
            return res.status(403).json({
                success: false,
                message: 'คุณไม่มีสิทธิ์แก้ไขตอนนี้'
            });
        }

        await connection.query(
            'UPDATE Chapters SET Title = ?, Content = ? WHERE ChapterID = ?',
            [title, content, id]
        );
        connection.release();

        return res.status(200).json({
            success: true,
            message: 'แก้ไขตอนสำเร็จ'
        });
    } catch (error) {
        console.error('Update chapter error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการแก้ไขตอน',
            error: error.message
        });
    }
};

// ลบตอน (Author & Admin)
exports.deleteChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const userID = req.user.userID;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ ID ของตอนนิยาย'
            });
        }

        const connection = await pool.getConnection();

        // ตรวจสอบว่าตอนนี้มีอยู่หรือไม่
        const [chapters] = await connection.query(
            'SELECT c.*, n.AuthorID FROM Chapters c LEFT JOIN Novels n ON c.NovelID = n.NovelID WHERE c.ChapterID = ?',
            [id]
        );

        if (chapters.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'ไม่พบตอนนิยายที่ต้องการลบ'
            });
        }

        // ตรวจสอบสิทธิ์
        if (req.user.roleID !== 1 && chapters[0].AuthorID !== userID) {
            connection.release();
            return res.status(403).json({
                success: false,
                message: 'คุณไม่มีสิทธิ์ลบตอนนี้'
            });
        }

        await connection.query('DELETE FROM Chapters WHERE ChapterID = ?', [id]);
        connection.release();

        return res.status(200).json({
            success: true,
            message: 'ลบตอนสำเร็จ'
        });
    } catch (error) {
        console.error('Delete chapter error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการลบตอน',
            error: error.message
        });
    }
};
