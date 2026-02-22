# 📚 Novel Reading Web App

A web application for reading and creating novels. 
> **Note:** Personal student project.

## 🛠 Prerequisites

- [Node.js](https://nodejs.org/)
- MySQL Database

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/weerawat221/Novel_Reading_Wepapp.git
cd NovelReadingWeb
```

### 2. Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

**Configuration:**

Create a `.env` file in the `backend` folder and add the following:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=NovelDB
JWT_SECRET=myverysecretkey123
PORT=3000
```

> **Note:** Make sure you have created a database named `NovelDB` in MySQL. The SQL file is `noveldb.sql`.

### 3. Frontend Setup

Navigate to the frontend folder and install dependencies:

```bash
cd ../frontend
npm install
```

## 🏃‍♂️ Running the App

Run the backend and frontend in **separate terminals**.

**Terminal 1 — Backend:**

```bash
cd backend
npm start
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```
