const pool = require('../config/db');

// ดึงสิทธิ์ทั้งหมด (Admin only)
exports.getAllRoles = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [roles] = await connection.query('SELECT * FROM Roles');
        connection.release();

        return res.status(200).json({
            success: true,
            total: roles.length,
            roles: roles
        });
    } catch (error) {
        console.error('Get roles error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสิทธิ์',
            error: error.message
        });
    }
};

// ดึงสิทธิ์เดียว (Admin only)
exports.getRoleById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ ID ของสิทธิ์'
            });
        }

        const connection = await pool.getConnection();
        const [roles] = await connection.query(
            'SELECT * FROM Roles WHERE RoleID = ?',
            [id]
        );
        connection.release();

        if (roles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบสิทธิ์ที่ค้นหา'
            });
        }

        return res.status(200).json({
            success: true,
            role: roles[0]
        });
    } catch (error) {
        console.error('Get role error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสิทธิ์',
            error: error.message
        });
    }
};

// เพิ่มสิทธิ์ใหม่ (Admin only)
exports.createRole = async (req, res) => {
    try {
        const { roleName } = req.body;

        if (!roleName) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุชื่อของสิทธิ์'
            });
        }

        const connection = await pool.getConnection();
        
        // ตรวจสอบซ้ำ
        const [existing] = await connection.query(
            'SELECT * FROM Roles WHERE RoleName = ?',
            [roleName]
        );

        if (existing.length > 0) {
            connection.release();
            return res.status(409).json({
                success: false,
                message: 'สิทธิ์นี้มีอยู่ในระบบแล้ว'
            });
        }

        const [result] = await connection.query(
            'INSERT INTO Roles (RoleName) VALUES (?)',
            [roleName]
        );
        connection.release();

        return res.status(201).json({
            success: true,
            message: 'เพิ่มสิทธิ์สำเร็จ',
            roleID: result.insertId
        });
    } catch (error) {
        console.error('Create role error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการเพิ่มสิทธิ์',
            error: error.message
        });
    }
};

// แก้ไขสิทธิ์ (Admin only)
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { roleName } = req.body;

        if (!id || !roleName) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ ID และชื่อของสิทธิ์'
            });
        }

        const connection = await pool.getConnection();

        // ตรวจสอบว่าสิทธิ์นี้มีอยู่หรือไม่
        const [roles] = await connection.query(
            'SELECT * FROM Roles WHERE RoleID = ?',
            [id]
        );

        if (roles.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'ไม่พบสิทธิ์ที่ต้องการแก้ไข'
            });
        }

        await connection.query(
            'UPDATE Roles SET RoleName = ? WHERE RoleID = ?',
            [roleName, id]
        );
        connection.release();

        return res.status(200).json({
            success: true,
            message: 'แก้ไขสิทธิ์สำเร็จ'
        });
    } catch (error) {
        console.error('Update role error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการแก้ไขสิทธิ์',
            error: error.message
        });
    }
};

// ลบสิทธิ์ (Admin only)
exports.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ ID ของสิทธิ์'
            });
        }

        const connection = await pool.getConnection();

        // ตรวจสอบว่าสิทธิ์นี้มีอยู่หรือไม่
        const [roles] = await connection.query(
            'SELECT * FROM Roles WHERE RoleID = ?',
            [id]
        );

        if (roles.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'ไม่พบสิทธิ์ที่ต้องการลบ'
            });
        }

        // ตรวจสอบว่ามีผู้ใช้ที่มีสิทธิ์นี้หรือไม่
        const [users] = await connection.query(
            'SELECT COUNT(*) as count FROM Users WHERE RoleID = ?',
            [id]
        );

        if (users[0].count > 0) {
            connection.release();
            return res.status(409).json({
                success: false,
                message: 'ไม่สามารถลบสิทธิ์นี้ได้ เพราะมีผู้ใช้ที่มีสิทธิ์นี้'
            });
        }

        await connection.query('DELETE FROM Roles WHERE RoleID = ?', [id]);
        connection.release();

        return res.status(200).json({
            success: true,
            message: 'ลบสิทธิ์สำเร็จ'
        });
    } catch (error) {
        console.error('Delete role error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการลบสิทธิ์',
            error: error.message
        });
    }
};
