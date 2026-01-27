# Novel Online System - API Documentation

## Base URL
```
http://localhost:3306/api
```

---

## 🔐 Authentication

### Login
**Endpoint:** `POST /users/login`
**Access:** Public

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "ล็อกอินสำเร็จ",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userID": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "Admin"
  }
}
```

**Headers for Protected Routes:**
```
Authorization: Bearer <token>
```

---

## 👥 Users API

### Register (สมัครสมาชิก)
**Endpoint:** `POST /users/register`
**Access:** Public

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "สมัครสมาชิกสำเร็จ",
  "userID": 1
}
```

### Get Profile (ดูข้อมูลส่วนตัว)
**Endpoint:** `GET /users/profile`
**Access:** Authenticated Users
**Headers:** Authorization Bearer token

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "userID": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "User",
    "createdAt": "2026-01-27T16:24:15.000Z"
  }
}
```

### Update Profile (แก้ไขข้อมูลส่วนตัว)
**Endpoint:** `PUT /users/profile`
**Access:** Authenticated Users
**Headers:** Authorization Bearer token

**Request Body:**
```json
{
  "fullName": "John Updated",
  "email": "john.new@example.com"
}
```

### Change Password (เปลี่ยนรหัสผ่าน)
**Endpoint:** `POST /users/change-password`
**Access:** Authenticated Users
**Headers:** Authorization Bearer token

**Request Body:**
```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword456",
  "confirmPassword": "newpassword456"
}
```

### Get All Users (ดึงผู้ใช้ทั้งหมด)
**Endpoint:** `GET /users`
**Access:** Admin Only
**Headers:** Authorization Bearer token

**Response (Success):**
```json
{
  "success": true,
  "total": 5,
  "users": [
    {
      "userID": 1,
      "username": "admin",
      "email": "admin@example.com",
      "fullName": "Admin User",
      "roleName": "Admin",
      "createdAt": "2026-01-27T16:24:15.000Z"
    }
  ]
}
```

### Get User by ID
**Endpoint:** `GET /users/:id`
**Access:** Admin Only
**Headers:** Authorization Bearer token

### Create User (สร้างผู้ใช้)
**Endpoint:** `POST /users`
**Access:** Admin Only
**Headers:** Authorization Bearer token

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "fullName": "New User",
  "roleID": 3
}
```

### Update User (แก้ไขผู้ใช้)
**Endpoint:** `PUT /users/:id`
**Access:** Admin Only
**Headers:** Authorization Bearer token

**Request Body:**
```json
{
  "fullName": "Updated Name",
  "email": "updated@example.com",
  "roleID": 2
}
```

### Delete User (ลบผู้ใช้)
**Endpoint:** `DELETE /users/:id`
**Access:** Admin Only
**Headers:** Authorization Bearer token

---

## 📚 Novels API

### Get All Novels (ดึงนิยายทั้งหมด)
**Endpoint:** `GET /novels`
**Access:** Public
**Query Parameters:**
- `categoryID` (optional): ตัวกรองตามประเภท
- `status` (optional): ตัวกรองตามสถานะ
- `search` (optional): ค้นหาตามชื่อ

**Response (Success):**
```json
{
  "success": true,
  "total": 10,
  "novels": [
    {
      "NovelID": 1,
      "Title": "The Great Adventure",
      "Description": "An epic tale...",
      "AuthorName": "john_doe",
      "CategoryName": "Fantasy",
      "Status": "กำลังเขียน",
      "ViewCount": 500,
      "CreatedAt": "2026-01-27T16:24:15.000Z"
    }
  ]
}
```

### Get Novel by ID (ดึงนิยายเดียว)
**Endpoint:** `GET /novels/:id`
**Access:** Public
**Response:** Single novel object (ViewCount จะ +1)

### Create Novel (สร้างนิยายใหม่)
**Endpoint:** `POST /novels`
**Access:** Author & Admin
**Headers:** Authorization Bearer token

**Request Body:**
```json
{
  "title": "My New Novel",
  "description": "A wonderful story",
  "categoryID": 1,
  "status": "กำลังเขียน",
  "coverImage": "image_url"
}
```

### Update Novel (แก้ไขนิยาย)
**Endpoint:** `PUT /novels/:id`
**Access:** Author (Own novels) & Admin
**Headers:** Authorization Bearer token

**Request Body:** (Same as Create)

### Delete Novel (ลบนิยาย)
**Endpoint:** `DELETE /novels/:id`
**Access:** Author (Own novels) & Admin
**Headers:** Authorization Bearer token

---

## 📖 Chapters API

### Get All Chapters (ดึงตอนทั้งหมด)
**Endpoint:** `GET /chapters`
**Access:** Public
**Query Parameters:**
- `novelID` (optional): ตัวกรองตามนิยาย

**Response (Success):**
```json
{
  "success": true,
  "total": 5,
  "chapters": [
    {
      "ChapterID": 1,
      "NovelID": 1,
      "ChapterNumber": 1,
      "Title": "The Beginning",
      "Content": "Long chapter content...",
      "NovelTitle": "The Great Adventure",
      "CreatedAt": "2026-01-27T16:24:15.000Z"
    }
  ]
}
```

### Get Chapter by ID
**Endpoint:** `GET /chapters/:id`
**Access:** Public

### Create Chapter (สร้างตอนใหม่)
**Endpoint:** `POST /chapters`
**Access:** Author (Own novels) & Admin
**Headers:** Authorization Bearer token

**Request Body:**
```json
{
  "novelID": 1,
  "chapterNumber": 1,
  "title": "The Beginning",
  "content": "Long chapter content..."
}
```

### Update Chapter (แก้ไขตอน)
**Endpoint:** `PUT /chapters/:id`
**Access:** Author (Own novels) & Admin
**Headers:** Authorization Bearer token

### Delete Chapter (ลบตอน)
**Endpoint:** `DELETE /chapters/:id`
**Access:** Author (Own novels) & Admin
**Headers:** Authorization Bearer token

---

## 💬 Comments API

### Get All Comments (ดึงความเห็นทั้งหมด)
**Endpoint:** `GET /comments`
**Access:** Public
**Query Parameters:**
- `novelID` (optional): ตัวกรองตามนิยาย
- `chapterID` (optional): ตัวกรองตามตอน

**Response (Success):**
```json
{
  "success": true,
  "total": 3,
  "comments": [
    {
      "CommentID": 1,
      "UserID": 2,
      "NovelID": 1,
      "ChapterID": 1,
      "Message": "Great story!",
      "Username": "reader",
      "CommentedAt": "2026-01-27T16:24:15.000Z"
    }
  ]
}
```

### Get Comment by ID
**Endpoint:** `GET /comments/:id`
**Access:** Public

### Create Comment (สร้างความเห็น)
**Endpoint:** `POST /comments`
**Access:** Authenticated Users (User, Author, Admin)
**Headers:** Authorization Bearer token

**Request Body:**
```json
{
  "novelID": 1,
  "chapterID": 1,
  "message": "This is great!"
}
```

### Update Comment (แก้ไขความเห็น)
**Endpoint:** `PUT /comments/:id`
**Access:** Own comments or Admin
**Headers:** Authorization Bearer token

**Request Body:**
```json
{
  "message": "Updated comment"
}
```

### Delete Comment (ลบความเห็น)
**Endpoint:** `DELETE /comments/:id`
**Access:** Own comments or Admin
**Headers:** Authorization Bearer token

---

## 📂 Categories API

### Get All Categories (ดึงประเภททั้งหมด)
**Endpoint:** `GET /categories`
**Access:** Public

**Response (Success):**
```json
{
  "success": true,
  "total": 5,
  "categories": [
    {
      "CategoryID": 1,
      "CategoryName": "Fantasy",
      "Description": "Fantasy novels and stories"
    }
  ]
}
```

### Get Category by ID
**Endpoint:** `GET /categories/:id`
**Access:** Public

### Create Category (สร้างประเภท)
**Endpoint:** `POST /categories`
**Access:** Admin Only
**Headers:** Authorization Bearer token

**Request Body:**
```json
{
  "categoryName": "Science Fiction",
  "description": "Sci-fi novels"
}
```

### Update Category (แก้ไขประเภท)
**Endpoint:** `PUT /categories/:id`
**Access:** Admin Only
**Headers:** Authorization Bearer token

### Delete Category (ลบประเภท)
**Endpoint:** `DELETE /categories/:id`
**Access:** Admin Only
**Headers:** Authorization Bearer token

---

## 🔑 Roles API

### Get All Roles (ดึงสิทธิ์ทั้งหมด)
**Endpoint:** `GET /roles`
**Access:** Admin Only
**Headers:** Authorization Bearer token

**Response (Success):**
```json
{
  "success": true,
  "total": 3,
  "roles": [
    {
      "RoleID": 1,
      "RoleName": "Admin"
    },
    {
      "RoleID": 2,
      "RoleName": "Author"
    },
    {
      "RoleID": 3,
      "RoleName": "User"
    }
  ]
}
```

### Get Role by ID
**Endpoint:** `GET /roles/:id`
**Access:** Admin Only
**Headers:** Authorization Bearer token

### Create Role (สร้างสิทธิ์)
**Endpoint:** `POST /roles`
**Access:** Admin Only
**Headers:** Authorization Bearer token

**Request Body:**
```json
{
  "roleName": "Moderator"
}
```

### Update Role (แก้ไขสิทธิ์)
**Endpoint:** `PUT /roles/:id`
**Access:** Admin Only
**Headers:** Authorization Bearer token

### Delete Role (ลบสิทธิ์)
**Endpoint:** `DELETE /roles/:id`
**Access:** Admin Only
**Headers:** Authorization Bearer token

---

## 📊 Reports API

### Admin Reports

#### Get Total Users (รวมผู้ใช้ทั้งหมด)
**Endpoint:** `GET /reports/admin/total-users`
**Access:** Admin Only
**Headers:** Authorization Bearer token

#### Get Daily Users (ผู้ใช้รายวัน)
**Endpoint:** `GET /reports/admin/daily-users`
**Access:** Admin Only
**Headers:** Authorization Bearer token

#### Get Monthly Users (ผู้ใช้รายเดือน)
**Endpoint:** `GET /reports/admin/monthly-users`
**Access:** Admin Only
**Headers:** Authorization Bearer token

#### Get Yearly Users (ผู้ใช้รายปี)
**Endpoint:** `GET /reports/admin/yearly-users`
**Access:** Admin Only
**Headers:** Authorization Bearer token

#### Get Views by Category (ยอดผู้เข้าชมตามประเภท)
**Endpoint:** `GET /reports/admin/views-by-category`
**Access:** Admin Only
**Headers:** Authorization Bearer token

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "CategoryID": 1,
      "CategoryName": "Fantasy",
      "novelCount": 10,
      "totalViews": 5000
    }
  ]
}
```

#### Get Views by Author (ยอดผู้เข้าชมตามผู้แต่ง)
**Endpoint:** `GET /reports/admin/views-by-author`
**Access:** Admin Only
**Headers:** Authorization Bearer token

#### Get System Stats (สถิติระบบ)
**Endpoint:** `GET /reports/admin/system-stats`
**Access:** Admin Only
**Headers:** Authorization Bearer token

**Response (Success):**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 100,
    "totalNovels": 50,
    "totalChapters": 500,
    "totalComments": 1000,
    "totalViews": 50000,
    "totalAuthors": 20
  }
}
```

### Author Reports

#### Get Author View Report (ยอดผู้เข้าชมของแต่ละเรื่อง)
**Endpoint:** `GET /reports/author/my-views`
**Access:** Author & Admin
**Headers:** Authorization Bearer token

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "NovelID": 1,
      "Title": "The Great Adventure",
      "ViewCount": 500,
      "commentCount": 20,
      "CreatedAt": "2026-01-27T16:24:15.000Z"
    }
  ]
}
```

#### Get Author Comment Report (ยอดความเห็นของแต่ละตอน)
**Endpoint:** `GET /reports/author/comments`
**Access:** Author & Admin
**Headers:** Authorization Bearer token

### Public Reports

#### Get Popular Novels (นิยายยอดนิยม)
**Endpoint:** `GET /reports/public/popular-novels`
**Access:** Public

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "NovelID": 1,
      "Title": "The Great Adventure",
      "AuthorName": "john_doe",
      "CategoryName": "Fantasy",
      "ViewCount": 5000,
      "chapterCount": 50,
      "commentCount": 100
    }
  ]
}
```

---

## 🔑 Role IDs Reference

```
1 = Admin (ผู้ดูแลระบบ)
2 = Author (ผู้แต่งนิยาย)
3 = User (ผู้ใช้ทั่วไป)
```

---

## ⚠️ Error Responses

All endpoints return error responses in this format:

```json
{
  "success": false,
  "message": "Error message in Thai",
  "error": "Detailed error information"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - No permission to access
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

---

## 📝 Notes

1. All timestamps are in ISO 8601 format
2. Use Bearer token format: `Authorization: Bearer <token>`
3. Tokens expire after 7 days
4. All responses are in JSON format
5. All text content supports Thai language

