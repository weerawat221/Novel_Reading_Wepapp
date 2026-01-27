const pool = require('../config/db');

// ดึงประเภทนิยายทั้งหมด
exports.getAllCategories = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [categories] = await connection.query('SELECT * FROM Categories');
        connection.release();

        return res.status(200).json({
            success: true,
            total: categories.length,
            categories: categories
        });
    } catch (error) {
        console.error('Get categories error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประเภทนิยาย',
            error: error.message
        });
    }
};

// ดึงประเภทนิยายเดียว
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ ID ของประเภทนิยาย'
            });
        }

        const connection = await pool.getConnection();
        const [categories] = await connection.query(
            'SELECT * FROM Categories WHERE CategoryID = ?',
            [id]
        );
        connection.release();

        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบประเภทนิยายที่ค้นหา'
            });
        }

        return res.status(200).json({
            success: true,
            category: categories[0]
        });
    } catch (error) {
        console.error('Get category error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประเภทนิยาย',
            error: error.message
        });
    }
};

// สร้างประเภทนิยายใหม่ (Admin only)
exports.createCategory = async (req, res) => {
    try {
        const { categoryName, description } = req.body;

        if (!categoryName) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุชื่อของประเภทนิยาย'
            });
        }

        const connection = await pool.getConnection();

        // ตรวจสอบซ้ำ
        const [existing] = await connection.query(
            'SELECT * FROM Categories WHERE CategoryName = ?',
            [categoryName]
        );

        if (existing.length > 0) {
            connection.release();
            return res.status(409).json({
                success: false,
                message: 'ประเภทนิยายนี้มีอยู่ในระบบแล้ว'
            });
        }

        const [result] = await connection.query(
            'INSERT INTO Categories (CategoryName, Description) VALUES (?, ?)',
            [categoryName, description || null]
        );
        connection.release();

        return res.status(201).json({
            success: true,
            message: 'สร้างประเภทนิยายสำเร็จ',
            categoryID: result.insertId
        });
    } catch (error) {
        console.error('Create category error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการสร้างประเภทนิยาย',
            error: error.message
        });
    }
};

// แก้ไขประเภทนิยาย (Admin only)
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName, description } = req.body;

        if (!id || !categoryName) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ ID และชื่อของประเภทนิยาย'
            });
        }

        const connection = await pool.getConnection();

        // ตรวจสอบว่าประเภทนี้มีอยู่หรือไม่
        const [categories] = await connection.query(
            'SELECT * FROM Categories WHERE CategoryID = ?',
            [id]
        );

        if (categories.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'ไม่พบประเภทนิยายที่ต้องการแก้ไข'
            });
        }

        await connection.query(
            'UPDATE Categories SET CategoryName = ?, Description = ? WHERE CategoryID = ?',
            [categoryName, description || categories[0].Description, id]
        );
        connection.release();

        return res.status(200).json({
            success: true,
            message: 'แก้ไขประเภทนิยายสำเร็จ'
        });
    } catch (error) {
        console.error('Update category error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการแก้ไขประเภทนิยาย',
            error: error.message
        });
    }
};

// ลบประเภทนิยาย (Admin only)
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ ID ของประเภทนิยาย'
            });
        }

        const connection = await pool.getConnection();

        // ตรวจสอบว่าประเภทนี้มีอยู่หรือไม่
        const [categories] = await connection.query(
            'SELECT * FROM Categories WHERE CategoryID = ?',
            [id]
        );

        if (categories.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'ไม่พบประเภทนิยายที่ต้องการลบ'
            });
        }

        // ตรวจสอบว่ามีนิยายที่เกี่ยวข้องหรือไม่
        const [novels] = await connection.query(
            'SELECT COUNT(*) as count FROM Novels WHERE CategoryID = ?',
            [id]
        );

        if (novels[0].count > 0) {
            connection.release();
            return res.status(409).json({
                success: false,
                message: 'ไม่สามารถลบประเภทนิยายนี้ได้ เพราะมีนิยายที่เกี่ยวข้อง'
            });
        }

        await connection.query('DELETE FROM Categories WHERE CategoryID = ?', [id]);
        connection.release();

        return res.status(200).json({
            success: true,
            message: 'ลบประเภทนิยายสำเร็จ'
        });
    } catch (error) {
        console.error('Delete category error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการลบประเภทนิยาย',
            error: error.message
        });
    }
};
