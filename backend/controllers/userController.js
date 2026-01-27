const pool = require('../config/db');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// สมัครสมาชิก (Register) - Role: User (3) or Author (2)
exports.register = async (req, res) => {
    try {
        const { username, email, password, fullName, role } = req.body;

        // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'กรุณากรอกข้อมูลให้ครบ (Username, Email, Password)' 
            });
        }

        // กำหนด RoleID ตามที่ส่งมาจาก Frontend (default = 3 User)
        let roleID = 3; // User
        if (role === 'Author') {
            roleID = 2; // Author
        } else if (role === 'Admin') {
            roleID = 1; // Admin - ห้ามสมัครเป็น Admin ผ่านทางปกติ
            roleID = 3; // Force as User
        }

        const connection = await pool.getConnection();

        // ตรวจสอบว่า Username หรือ Email มีอยู่ในระบบหรือไม่
        const [existing] = await connection.query(
            'SELECT * FROM Users WHERE Username = ? OR Email = ?',
            [username, email]
        );

        if (existing.length > 0) {
            connection.release();
            return res.status(409).json({ 
                success: false,
                message: 'Username หรือ Email นี้มีการลงทะเบียนแล้ว' 
            });
        }

        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcryptjs.hash(password, 10);

        // เพิ่มผู้ใช้ใหม่เข้าฐานข้อมูล (RoleID: 3 = User หรือ 2 = Author)
        const [result] = await connection.query(
            'INSERT INTO Users (Username, Email, Password, FullName, RoleID) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, fullName || username, roleID]
        );

        connection.release();

        return res.status(201).json({ 
            success: true,
            message: 'สมัครสมาชิกสำเร็จ',
            userID: result.insertId,
            role: role === 'Author' ? 'Author' : 'User'
        });

    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก',
            error: error.message 
        });
    }
};

// ล็อกอิน (Login)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'กรุณากรอก Email และ Password' 
            });
        }

        const connection = await pool.getConnection();
        const [users] = await connection.query(
            'SELECT u.*, r.RoleName FROM Users u LEFT JOIN Roles r ON u.RoleID = r.RoleID WHERE u.Email = ?',
            [email]
        );

        if (users.length === 0) {
            connection.release();
            return res.status(401).json({ 
                success: false,
                message: 'Email หรือ Password ไม่ถูกต้อง' 
            });
        }

        const user = users[0];
        const isPasswordValid = await bcryptjs.compare(password, user.Password);

        if (!isPasswordValid) {
            connection.release();
            return res.status(401).json({ 
                success: false,
                message: 'Email หรือ Password ไม่ถูกต้อง' 
            });
        }

        // สร้าง JWT Token
        const token = jwt.sign(
            { userID: user.UserID, email: user.Email, username: user.Username, roleID: user.RoleID },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        connection.release();

        return res.status(200).json({ 
            success: true,
            message: 'ล็อกอินสำเร็จ',
            token: token,
            user: {
                userID: user.UserID,
                username: user.Username,
                email: user.Email,
                fullName: user.FullName,
                role: user.RoleName
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในการล็อกอิน',
            error: error.message 
        });
    }
};

// ดูข้อมูลส่วนตัว (Get Profile)
exports.getProfile = async (req, res) => {
    try {
        const userID = req.user.userID;

        const connection = await pool.getConnection();
        const [users] = await connection.query(
            'SELECT u.*, r.RoleName FROM Users u LEFT JOIN Roles r ON u.RoleID = r.RoleID WHERE u.UserID = ?',
            [userID]
        );

        if (users.length === 0) {
            connection.release();
            return res.status(404).json({ 
                success: false,
                message: 'ไม่พบผู้ใช้' 
            });
        }

        connection.release();

        const user = users[0];
        return res.status(200).json({ 
            success: true,
            user: {
                userID: user.UserID,
                username: user.Username,
                email: user.Email,
                fullName: user.FullName,
                role: user.RoleName,
                createdAt: user.CreatedAt
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์',
            error: error.message 
        });
    }
};

// แก้ไขข้อมูลส่วนตัว (Update Profile)
exports.updateProfile = async (req, res) => {
    try {
        const userID = req.user.userID;
        const { fullName, email } = req.body;

        if (!fullName || !email) {
            return res.status(400).json({
                success: false,
                message: 'กรุณากรอกข้อมูลให้ครบ'
            });
        }

        const connection = await pool.getConnection();

        // ตรวจสอบว่า Email นี้ถูกใช้งานแล้วหรือไม่ (ไม่ใช่ของตัวเอง)
        const [existing] = await connection.query(
            'SELECT * FROM Users WHERE Email = ? AND UserID != ?',
            [email, userID]
        );

        if (existing.length > 0) {
            connection.release();
            return res.status(409).json({
                success: false,
                message: 'Email นี้มีการลงทะเบียนแล้ว'
            });
        }

        await connection.query(
            'UPDATE Users SET FullName = ?, Email = ? WHERE UserID = ?',
            [fullName, email, userID]
        );

        connection.release();

        return res.status(200).json({
            success: true,
            message: 'แก้ไขข้อมูลส่วนตัวสำเร็จ'
        });

    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล',
            error: error.message
        });
    }
};

// เปลี่ยนรหัสผ่าน (Change Password)
exports.changePassword = async (req, res) => {
    try {
        const userID = req.user.userID;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'กรุณากรอกข้อมูลให้ครบ'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'รหัสผ่านใหม่ไม่ตรงกัน'
            });
        }

        const connection = await pool.getConnection();
        const [users] = await connection.query(
            'SELECT Password FROM Users WHERE UserID = ?',
            [userID]
        );

        if (users.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'ไม่พบผู้ใช้'
            });
        }

        const isPasswordValid = await bcryptjs.compare(oldPassword, users[0].Password);

        if (!isPasswordValid) {
            connection.release();
            return res.status(401).json({
                success: false,
                message: 'รหัสผ่านเดิมไม่ถูกต้อง'
            });
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        await connection.query(
            'UPDATE Users SET Password = ? WHERE UserID = ?',
            [hashedPassword, userID]
        );

        connection.release();

        return res.status(200).json({
            success: true,
            message: 'เปลี่ยนรหัสผ่านสำเร็จ'
        });

    } catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน',
            error: error.message
        });
    }
};

// ดึงผู้ใช้ทั้งหมด (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [users] = await connection.query(
            'SELECT u.UserID, u.Username, u.Email, u.FullName, r.RoleName, u.CreatedAt FROM Users u LEFT JOIN Roles r ON u.RoleID = r.RoleID ORDER BY u.CreatedAt DESC'
        );
        connection.release();

        return res.status(200).json({
            success: true,
            total: users.length,
            users: users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้',
            error: error.message
        });
    }
};

// ดึงผู้ใช้เดียว (Admin only)
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ ID ของผู้ใช้'
            });
        }

        const connection = await pool.getConnection();
        const [users] = await connection.query(
            'SELECT u.UserID, u.Username, u.Email, u.FullName, r.RoleName, u.CreatedAt FROM Users u LEFT JOIN Roles r ON u.RoleID = r.RoleID WHERE u.UserID = ?',
            [id]
        );
        connection.release();

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบผู้ใช้ที่ค้นหา'
            });
        }

        return res.status(200).json({
            success: true,
            user: users[0]
        });
    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้',
            error: error.message
        });
    }
};

// สร้างผู้ใช้ (Admin only)
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, fullName, roleID } = req.body;

        if (!username || !email || !password || !roleID) {
            return res.status(400).json({
                success: false,
                message: 'กรุณากรอกข้อมูลให้ครบ'
            });
        }

        const connection = await pool.getConnection();

        // ตรวจสอบซ้ำ
        const [existing] = await connection.query(
            'SELECT * FROM Users WHERE Username = ? OR Email = ?',
            [username, email]
        );

        if (existing.length > 0) {
            connection.release();
            return res.status(409).json({
                success: false,
                message: 'Username หรือ Email นี้มีการลงทะเบียนแล้ว'
            });
        }

        // ตรวจสอบ RoleID
        const [roles] = await connection.query(
            'SELECT * FROM Roles WHERE RoleID = ?',
            [roleID]
        );

        if (roles.length === 0) {
            connection.release();
            return res.status(400).json({
                success: false,
                message: 'ไม่พบสิทธิ์ที่ระบุ'
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const [result] = await connection.query(
            'INSERT INTO Users (Username, Email, Password, FullName, RoleID) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, fullName || username, roleID]
        );

        connection.release();

        return res.status(201).json({
            success: true,
            message: 'สร้างผู้ใช้สำเร็จ',
            userID: result.insertId
        });
    } catch (error) {
        console.error('Create user error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้',
            error: error.message
        });
    }
};

// แก้ไขผู้ใช้ (Admin only)
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, roleID } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ ID ของผู้ใช้'
            });
        }

        const connection = await pool.getConnection();

        // ตรวจสอบว่าผู้ใช้นี้มีอยู่หรือไม่
        const [users] = await connection.query(
            'SELECT * FROM Users WHERE UserID = ?',
            [id]
        );

        if (users.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'ไม่พบผู้ใช้ที่ต้องการแก้ไข'
            });
        }

        // ถ้าเปลี่ยน email ให้ตรวจสอบซ้ำ
        if (email && email !== users[0].Email) {
            const [existing] = await connection.query(
                'SELECT * FROM Users WHERE Email = ?',
                [email]
            );

            if (existing.length > 0) {
                connection.release();
                return res.status(409).json({
                    success: false,
                    message: 'Email นี้มีการลงทะเบียนแล้ว'
                });
            }
        }

        await connection.query(
            'UPDATE Users SET FullName = ?, Email = ?, RoleID = ? WHERE UserID = ?',
            [fullName || users[0].FullName, email || users[0].Email, roleID || users[0].RoleID, id]
        );

        connection.release();

        return res.status(200).json({
            success: true,
            message: 'แก้ไขผู้ใช้สำเร็จ'
        });
    } catch (error) {
        console.error('Update user error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการแก้ไขผู้ใช้',
            error: error.message
        });
    }
};

// ลบผู้ใช้ (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ ID ของผู้ใช้'
            });
        }

        const connection = await pool.getConnection();

        // ตรวจสอบว่าผู้ใช้นี้มีอยู่หรือไม่
        const [users] = await connection.query(
            'SELECT * FROM Users WHERE UserID = ?',
            [id]
        );

        if (users.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'ไม่พบผู้ใช้ที่ต้องการลบ'
            });
        }

        await connection.query('DELETE FROM Users WHERE UserID = ?', [id]);
        connection.release();

        return res.status(200).json({
            success: true,
            message: 'ลบผู้ใช้สำเร็จ'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการลบผู้ใช้',
            error: error.message
        });
    }
};
