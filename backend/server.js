const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// 1. โหลดค่า Config จากไฟล์ .env
dotenv.config();

const app = express();

// 2. ตั้งค่า Middlewares พื้นฐาน
app.use(cors()); // อนุญาตให้ Frontend เชื่อมต่อได้
app.use(express.json()); // รับข้อมูลจาก Body เป็น JSON
app.use(express.urlencoded({ extended: true })); // รับข้อมูลจาก Form

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. เชื่อมต่อฐานข้อมูล (ดึงจากไฟล์ที่เราสร้างไว้ใน config/)
const pool = require('./config/db');

// 4. นำเข้าไฟล์ Routes (ดึงจากไฟล์ที่เราสร้างไว้ใน routes/)
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const novelRoutes = require('./routes/novelRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const commentRoutes = require('./routes/commentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const readingHistoryRoutes = require('./routes/readingHistoryRoutes');

// 5. ประกาศใช้งาน API Endpoints
// ทุกครั้งที่เรียกใช้ จะต้องขึ้นต้นด้วย /api
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/novels', novelRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reading-history', readingHistoryRoutes);

// 6. หน้าแรกของ Server (เอาไว้เช็คว่า Server รันติดไหม)
app.get('/', (req, res) => {
    res.send('Novel Online System Backend is Running...');
});

// 7. จัดการ Error สำหรับ Path ที่ไม่มีอยู่จริง (404 Not Found)
app.use((req, res, next) => {
    res.status(404).json({ message: "ไม่พบหน้าที่คุณต้องการ (Route not found)" });
});

// 8. สั่งให้ Server เริ่มทำงาน
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`-----------------------------------------`);
    console.log(`🚀 Server is running on port: ${PORT}`);
    console.log(`📅 Started at: ${new Date().toLocaleString()}`);
    console.log(`-----------------------------------------`);
});