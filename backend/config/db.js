const mysql = require('mysql2/promise');
require('dotenv').config(); // โหลดค่าจาก .env

// ตั้งค่าการเชื่อมต่อ
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'NovelDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

// สร้าง Pool สำหรับการเชื่อมต่อ
const pool = mysql.createPool(dbConfig);

// ตรวจสอบการเชื่อมต่อเบื้องต้น
pool.getConnection()
    .then(connection => {
        console.log('Connected to MySQL Database successfully!');
        connection.release(); // คืนการเชื่อมต่อกลับเข้า Pool
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
    });

module.exports = pool;