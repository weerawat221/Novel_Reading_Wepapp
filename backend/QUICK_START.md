# Quick Start Guide - Novel Online System Backend

## 🎯 Quick Reference

### Server Status
✅ **Running on:** http://localhost:3306/api
✅ **Database:** Connected to MySQL
✅ **Status:** All systems operational

### Default Role IDs
```
1 = Admin          (ผู้ดูแลระบบ)
2 = Author         (ผู้แต่งนิยาย)
3 = User           (ผู้ใช้ทั่วไป)
```

### Test Login Credentials
After running the database schema, create test accounts:
```
Admin:
Email: admin@example.com
Password: admin123

Author:
Email: author@example.com
Password: author123

User:
Email: user@example.com
Password: user123
```

### Basic API Flow

1. **Register/Login**
   ```bash
   POST /api/users/register
   POST /api/users/login
   # Returns JWT token
   ```

2. **Add Token to Headers**
   ```
   Authorization: Bearer <token_here>
   ```

3. **Access Protected Endpoints**
   ```bash
   GET /api/users/profile
   GET /api/novels
   POST /api/novels
   # etc.
   ```

---

## 🔍 Quick Endpoint Reference

### Public Endpoints (No Auth Needed)
```
GET    /api/novels                    - List all novels
GET    /api/novels/:id                - Get novel details
GET    /api/chapters                  - List chapters
GET    /api/comments                  - List comments
GET    /api/categories                - List categories
GET    /api/reports/public/popular-novels - Popular novels report
POST   /api/users/register            - Register new user
POST   /api/users/login               - Login
```

### Authenticated User Endpoints
```
GET    /api/users/profile             - Your profile
PUT    /api/users/profile             - Update profile
POST   /api/users/change-password     - Change password
POST   /api/comments                  - Post comment
PUT    /api/comments/:id              - Edit own comment
DELETE /api/comments/:id              - Delete own comment
```

### Author Endpoints (Authenticated)
```
POST   /api/novels                    - Create novel
PUT    /api/novels/:id                - Edit your novel
DELETE /api/novels/:id                - Delete your novel
POST   /api/chapters                  - Add chapter
PUT    /api/chapters/:id              - Edit chapter
DELETE /api/chapters/:id              - Delete chapter
GET    /api/reports/author/my-views   - View report
GET    /api/reports/author/comments   - Comment report
```

### Admin Endpoints (Authenticated + Admin Role)
```
GET    /api/users                     - List all users
POST   /api/users                     - Create user
PUT    /api/users/:id                 - Edit user
DELETE /api/users/:id                 - Delete user
GET    /api/roles                     - List roles
POST   /api/roles                     - Create role
PUT    /api/roles/:id                 - Edit role
DELETE /api/roles/:id                 - Delete role
GET    /api/categories                - List categories (also public)
POST   /api/categories                - Create category
PUT    /api/categories/:id            - Edit category
DELETE /api/categories/:id            - Delete category
GET    /api/reports/admin/total-users - Total users
GET    /api/reports/admin/daily-users - Daily users
GET    /api/reports/admin/monthly-users - Monthly users
GET    /api/reports/admin/yearly-users - Yearly users
GET    /api/reports/admin/views-by-category - Views by category
GET    /api/reports/admin/views-by-author - Views by author
GET    /api/reports/admin/system-stats - System statistics
```

---

## 📊 Implemented Features

### User Management
- ✅ Register/Login with JWT
- ✅ Profile management
- ✅ Password change
- ✅ Role-based access control
- ✅ User CRUD (Admin)

### Novel Management
- ✅ Create/Edit/Delete novels
- ✅ Novel search and filtering
- ✅ View count tracking
- ✅ Category assignment
- ✅ Status management

### Content Management
- ✅ Chapters (Create/Edit/Delete)
- ✅ Comments (CRUD with ownership validation)
- ✅ Categories (CRUD by Admin)

### Reporting
- ✅ User statistics (Total, Daily, Monthly, Yearly)
- ✅ Views by category
- ✅ Views by author
- ✅ Author-specific reports
- ✅ System statistics
- ✅ Popular novels ranking

---

## 🛠️ Development Tips

### Testing Endpoints
Use Postman or Thunder Client:
1. Copy endpoint URL
2. Set method (GET/POST/PUT/DELETE)
3. Add Authorization header if needed: `Bearer <token>`
4. Send request
5. Check response

### Common Issues

**"Token not found"**
- Make sure to include `Authorization: Bearer <token>` header
- Check token hasn't expired (7 days)

**"Unauthorized"**
- Token is invalid or expired
- Login again to get new token

**"Forbidden"**
- Your role doesn't have permission
- Admin user required for admin endpoints
- Only authors can edit own novels

**"Not found"**
- Check the ID parameter is correct
- Verify resource exists in database

---

## 📝 Example Requests

### 1. Register New User
```bash
curl -X POST http://localhost:3306/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3306/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get User Profile (with token)
```bash
curl -X GET http://localhost:3306/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Create Novel (Author)
```bash
curl -X POST http://localhost:3306/api/novels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My Novel",
    "description": "A great story",
    "categoryID": 1,
    "status": "กำลังเขียน"
  }'
```

### 5. Add Chapter
```bash
curl -X POST http://localhost:3306/api/chapters \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "novelID": 1,
    "chapterNumber": 1,
    "title": "Chapter 1",
    "content": "Once upon a time..."
  }'
```

---

## 📚 Documentation Files

- **API_DOCUMENTATION.md** - Complete API reference
- **IMPLEMENTATION_SUMMARY.md** - Full implementation details
- **README.md** - Project overview (if exists)

---

## 🚀 Next Steps

1. ✅ Backend is running
2. 📦 Frontend can now call these APIs
3. 🔐 Use JWT tokens for authenticated requests
4. 📊 Monitor reports for analytics
5. 👥 Manage users and content through admin panel

---

## 🆘 Support

All endpoints include:
- Comprehensive error messages in Thai
- Proper HTTP status codes
- Detailed error information
- Input validation
- Authorization checks
- Database error handling

For issues, check:
1. Token validity
2. User role/permissions
3. Resource existence
4. Input validation
5. Server logs

Happy coding! 🎉

