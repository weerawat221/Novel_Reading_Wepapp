const jwt = require('jsonwebtoken');

// ตรวจสอบ JWT Token
exports.authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'ไม่พบ Token กรุณาล็อกอินก่อน'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Token ไม่ถูกต้องหรือหมดอายุ'
                });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการตรวจสอบ Token',
            error: error.message
        });
    }
};

// ตรวจสอบสิทธิ์ของผู้ใช้
exports.authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'ไม่พบข้อมูลผู้ใช้ กรุณาล็อกอินใหม่'
                });
            }

            if (!allowedRoles.includes(req.user.roleID)) {
                return res.status(403).json({
                    success: false,
                    message: 'คุณไม่มีสิทธิ์เข้าถึงทรัพยากรนี้'
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์',
                error: error.message
            });
        }
    };
};
