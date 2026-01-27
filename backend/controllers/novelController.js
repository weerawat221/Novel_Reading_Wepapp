const pool = require('../config/db');

// ดึงนิยายทั้งหมด
exports.getAllNovels = async (req, res) => {
    try {
        const { categoryID, status, search } = req.query;

        const connection = await pool.getConnection();
        let query = `SELECT DISTINCT n.*, u.Username as AuthorName 
                    FROM Novels n 
                    LEFT JOIN Users u ON n.AuthorID = u.UserID 
                    LEFT JOIN Novel_Categories nc ON n.NovelID = nc.NovelID`;
        let params = [];
        let conditions = [];

        if (categoryID) {
            conditions.push('nc.CategoryID = ?');
            params.push(categoryID);
        }

        if (status) {
            conditions.push('n.Status = ?');
            params.push(status);
        }

        if (search) {
            conditions.push('n.Title LIKE ?');
            params.push(`%${search}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY n.CreatedAt DESC';

        const [novels] = await connection.query(query, params);
        
        // Fetch categories for each novel
        for (let novel of novels) {
            const [categories] = await connection.query(
                `SELECT c.CategoryID, c.CategoryName FROM Categories c 
                 LEFT JOIN Novel_Categories nc ON c.CategoryID = nc.CategoryID 
                 WHERE nc.NovelID = ?`,
                [novel.NovelID]
            );
            novel.categories = categories;
        }
        
        connection.release();

        return res.status(200).json({
            success: true,
            total: novels.length,
            novels: novels
        });

    } catch (error) {
        console.error('Get novels error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลนิยาย',
            error: error.message
        });
    }
};

// ดึงนิยายเดียว
exports.getNovelById = async (req, res) => {
    try {
        const { id } = req.params;
        const { countView } = req.query; // Check if view should be counted (default true for backward compatibility)

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ ID ของนิยาย'
            });
        }

        const connection = await pool.getConnection();
        
        const [novels] = await connection.query(
            `SELECT n.*, u.Username as AuthorName 
             FROM Novels n 
             LEFT JOIN Users u ON n.AuthorID = u.UserID 
             WHERE n.NovelID = ?`,
            [id]
        );

        if (novels.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'ไม่พบนิยายที่ค้นหา'
            });
        }

        // Fetch categories for this novel
        const [categories] = await connection.query(
            `SELECT c.CategoryID, c.CategoryName FROM Categories c 
             LEFT JOIN Novel_Categories nc ON c.CategoryID = nc.CategoryID 
             WHERE nc.NovelID = ?`,
            [id]
        );

        // Update ViewCount only if countView is not false (default true)
        if (countView !== 'false') {
            await connection.query(
                'UPDATE Novels SET ViewCount = ViewCount + 1 WHERE NovelID = ?',
                [id]
            );
        }

        connection.release();
        
        const novel = novels[0];
        novel.categories = categories;

        return res.status(200).json({
            success: true,
            novel: novel
        });

    } catch (error) {
        console.error('Get novel error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลนิยาย',
            error: error.message
        });
    }
};

// เพิ่มนิยายใหม่ (Author & Admin)
exports.createNovel = async (req, res) => {
    try {
        const { title, description, categoryID, status } = req.body;
        const authorID = req.user.userID;
        const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

        // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
        if (!title || !description || !categoryID) {
            // Delete uploaded file if validation fails
            if (req.file) {
                const fs = require('fs');
                const path = require('path');
                fs.unlinkSync(path.join(__dirname, `../uploads/${req.file.filename}`));
            }
            return res.status(400).json({
                success: false,
                message: 'กรุณากรอกข้อมูลให้ครบ (title, description, categoryID)'
            });
        }

        const connection = await pool.getConnection();

        // categoryID สามารถเป็น array หรือ single value
        const categoryIDs = Array.isArray(categoryID) ? categoryID : [categoryID];

        // ตรวจสอบว่า Categories ทั้งหมดมีอยู่หรือไม่
        for (let catID of categoryIDs) {
            const [categories] = await connection.query(
                'SELECT * FROM Categories WHERE CategoryID = ?',
                [catID]
            );

            if (categories.length === 0) {
                connection.release();
                // Delete uploaded file if validation fails
                if (req.file) {
                    const fs = require('fs');
                    const path = require('path');
                    fs.unlinkSync(path.join(__dirname, `../uploads/${req.file.filename}`));
                }
                return res.status(400).json({
                    success: false,
                    message: `ไม่พบประเภทนิยาย ID: ${catID}`
                });
            }
        }

        // เพิ่มนิยายใหม่ (ไม่มี CategoryID)
        const [result] = await connection.query(
            'INSERT INTO Novels (Title, Description, AuthorID, Status, CoverImage) VALUES (?, ?, ?, ?, ?)',
            [title, description, authorID, status || 'กำลังเขียน', coverImage]
        );

        // เพิ่มหมวดหมู่เข้าตาราง Novel_Categories (สำหรับแต่ละหมวดหมู่)
        for (let catID of categoryIDs) {
            await connection.query(
                'INSERT INTO Novel_Categories (NovelID, CategoryID) VALUES (?, ?)',
                [result.insertId, catID]
            );
        }

        connection.release();

        return res.status(201).json({
            success: true,
            message: 'เพิ่มนิยายสำเร็จ',
            novelID: result.insertId
        });

    } catch (error) {
        console.error('Create novel error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการเพิ่มนิยาย',
            error: error.message
        });
    }
};

// แก้ไขนิยาย (Author & Admin)
exports.updateNovel = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, categoryID, status } = req.body;
        const userID = req.user.userID;
        const newCoverImage = req.file ? `/uploads/${req.file.filename}` : null;

        if (!id) {
            if (req.file) {
                const fs = require('fs');
                const path = require('path');
                fs.unlinkSync(path.join(__dirname, `../uploads/${req.file.filename}`));
            }
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ ID ของนิยาย'
            });
        }

        const connection = await pool.getConnection();

        // ตรวจสอบว่านิยายนี้มีอยู่หรือไม่
        const [novels] = await connection.query(
            'SELECT * FROM Novels WHERE NovelID = ?',
            [id]
        );

        if (novels.length === 0) {
            connection.release();
            if (req.file) {
                const fs = require('fs');
                const path = require('path');
                fs.unlinkSync(path.join(__dirname, `../uploads/${req.file.filename}`));
            }
            return res.status(404).json({
                success: false,
                message: 'ไม่พบนิยายที่ค้นหา'
            });
        }

        // ตรวจสอบสิทธิ์
        if (req.user.roleID !== 1 && novels[0].AuthorID !== userID) {
            connection.release();
            if (req.file) {
                const fs = require('fs');
                const path = require('path');
                fs.unlinkSync(path.join(__dirname, `../uploads/${req.file.filename}`));
            }
            return res.status(403).json({
                success: false,
                message: 'คุณไม่มีสิทธิ์แก้ไขนิยายนี้'
            });
        }

        // แก้ไขนิยาย (ไม่มี CategoryID)
        const finalCoverImage = newCoverImage || novels[0].CoverImage;
        
        // Delete old cover if new one is uploaded
        if (newCoverImage && novels[0].CoverImage) {
            const fs = require('fs');
            const path = require('path');
            const oldPath = path.join(__dirname, `..${novels[0].CoverImage}`);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }
        
        await connection.query(
            'UPDATE Novels SET Title = ?, Description = ?, Status = ?, CoverImage = ? WHERE NovelID = ?',
            [title || novels[0].Title, description || novels[0].Description, status || novels[0].Status, finalCoverImage, id]
        );

        // แก้ไขหมวดหมู่ (ถ้าระบุมา)
        if (categoryID) {
            // ลบหมวดหมู่เดิม
            await connection.query('DELETE FROM Novel_Categories WHERE NovelID = ?', [id]);
            // เพิ่มหมวดหมู่ใหม่
            await connection.query(
                'INSERT INTO Novel_Categories (NovelID, CategoryID) VALUES (?, ?)',
                [id, categoryID]
            );
        }

        connection.release();

        return res.status(200).json({
            success: true,
            message: 'แก้ไขนิยายสำเร็จ'
        });

    } catch (error) {
        console.error('Update novel error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการแก้ไขนิยาย',
            error: error.message
        });
    }
};

// ลบนิยาย (Author & Admin)
exports.deleteNovel = async (req, res) => {
    try {
        const { id } = req.params;
        const userID = req.user.userID;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ ID ของนิยาย'
            });
        }

        const connection = await pool.getConnection();

        // ตรวจสอบว่านิยายนี้มีอยู่หรือไม่
        const [novels] = await connection.query(
            'SELECT * FROM Novels WHERE NovelID = ?',
            [id]
        );

        if (novels.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'ไม่พบนิยายที่ค้นหา'
            });
        }

        // ตรวจสอบสิทธิ์
        if (req.user.roleID !== 1 && novels[0].AuthorID !== userID) {
            connection.release();
            return res.status(403).json({
                success: false,
                message: 'คุณไม่มีสิทธิ์ลบนิยายนี้'
            });
        }

        // Delete cover image if exists
        if (novels[0].CoverImage) {
            const fs = require('fs');
            const path = require('path');
            const imagePath = path.join(__dirname, `..${novels[0].CoverImage}`);
            if (fs.existsSync(imagePath)) {
                try {
                    fs.unlinkSync(imagePath);
                } catch (err) {
                    console.error('Failed to delete cover image:', err);
                }
            }
        }

        // Delete comments related to chapters of this novel (Handle nested foreign keys)
        // First get all chapters for this novel
        const [chapters] = await connection.query(
            'SELECT ChapterID FROM Chapters WHERE NovelID = ?',
            [id]
        );

        // Delete comments for each chapter
        for (let chapter of chapters) {
            await connection.query('DELETE FROM Comments WHERE ChapterID = ?', [chapter.ChapterID]);
        }

        // Delete all chapters for this novel
        await connection.query('DELETE FROM Chapters WHERE NovelID = ?', [id]);

        // Delete comments related to this novel directly
        await connection.query('DELETE FROM Comments WHERE NovelID = ?', [id]);

        // ลบหมวดหมู่ที่เกี่ยวข้อง (Foreign Key Constraint)
        await connection.query('DELETE FROM Novel_Categories WHERE NovelID = ?', [id]);

        // ลบนิยาย
        await connection.query('DELETE FROM Novels WHERE NovelID = ?', [id]);

        connection.release();

        return res.status(200).json({
            success: true,
            message: 'ลบนิยายสำเร็จ'
        });

    } catch (error) {
        console.error('Delete novel error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการลบนิยาย',
            error: error.message
        });
    }
};
