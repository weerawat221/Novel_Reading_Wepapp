# Novel Reading Web App

Web application for reading novels.

## 🛠 Prerequisites
- Node.js
- MySQL Database

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone [https://github.com/weerawat221/Novel_Reading_Wepapp.git](https://github.com/weerawat221/Novel_Reading_Wepapp.git)
cd NovelReadingWeb

### 2. Backend Setup
Navigate to the backend folder and install dependencies:

Bash

cd backend
npm install
Configuration:
Create a .env file in the backend folder and add the following config:

ข้อมูลโค้ด

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=NovelDB
JWT_SECRET=myverysecretkey123
PORT=3000
Note: Make sure you have created a database named NovelDB in your MySQL. (sql file is noveldb.sql).

3. Frontend Setup
Navigate to the frontend folder and install dependencies:

Bash

cd ../frontend
npm install
🏃‍♂️ Running the App
You need to run the backend and frontend in separate terminals.

Terminal 1 (Backend):

Bash

cd backend
npm start
Terminal 2 (Frontend):

Bash

cd frontend
npm run dev