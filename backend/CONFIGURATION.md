# Environment Configuration Guide

## Current .env Configuration

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=NovelDB
JWT_SECRET=myverysecretkey123
PORT=3306
```

## ⚠️ Important Notes

### 1. Database Configuration
**Current Settings:**
- Host: `localhost` (Local machine)
- User: `root` (MySQL root user)
- Password: Empty (no password set)
- Database: `NovelDB`

**To change database location:**
Edit `.env` file and update:
```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_password
DB_NAME=your_database_name
```

### 2. JWT Secret Key
**Current:** `myverysecretkey123`

⚠️ **IMPORTANT:** For production, change this to a strong, random string:
```bash
# Generate a strong secret key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then update `.env`:
```env
JWT_SECRET=<your_generated_strong_key>
```

### 3. Server Port
**Current:** `3306` (MySQL default port - WARNING: This is unusual!)

**Note:** The server runs on port 3306, but you might want to use a standard port for APIs like 3000, 5000, or 8000:
```env
PORT=3000
```

Then access API at: `http://localhost:3000/api`

### 4. Database Setup

Before running the backend, create the database with the schema provided:

```sql
-- Copy the schema from the requirements and run in MySQL
CREATE DATABASE NovelDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE NovelDB;

-- Create all tables (from requirements)
-- ... (run all CREATE TABLE statements)

-- Create default roles
INSERT INTO Roles (RoleName) VALUES ('Admin'), ('Author'), ('User');
```

### 5. Creating Test Users

After database is ready, create initial users:

```bash
# Use Postman or curl to test registration

# 1. Register Admin User
POST /api/users/register
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "fullName": "Administrator"
}

# 2. Manually update role to Admin (RoleID = 1)
# Or create directly using Admin endpoint with proper authorization

# 3. Register Author User
POST /api/users/register
{
  "username": "author",
  "email": "author@example.com",
  "password": "author123",
  "fullName": "Novel Author"
}

# 4. Manually update role to Author (RoleID = 2)

# 5. Register Regular User
POST /api/users/register
{
  "username": "user",
  "email": "user@example.com",
  "password": "user123",
  "fullName": "Regular User"
}
# This will be RoleID = 3 by default
```

### 6. Production Recommendations

**For Production Deployment:**

```env
# Secure JWT secret
JWT_SECRET=<generate_strong_random_key>

# Use appropriate server port
PORT=3000

# Database security
DB_HOST=your_production_database_host
DB_USER=dedicated_app_user
DB_PASSWORD=<strong_password>
DB_NAME=novel_production

# Connection pooling settings (already configured in db.js)
# Keep default values:
# - waitForConnections: true
# - connectionLimit: 10
# - queueLimit: 0
# - enableKeepAlive: true
```

### 7. Environment Variables Checklist

✅ DB_HOST - Database host address
✅ DB_USER - Database username
✅ DB_PASSWORD - Database password
✅ DB_NAME - Database name
✅ JWT_SECRET - Secret key for JWT tokens
✅ PORT - Server port number

---

## 🚀 Quick Setup Instructions

1. **Edit .env file** with your database details:
   ```bash
   nano .env  # or use your text editor
   ```

2. **Create MySQL database:**
   ```bash
   mysql -u root -p < schema.sql
   # (Replace with your actual schema file)
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start server:**
   ```bash
   npm start
   ```

5. **Verify server is running:**
   ```bash
   curl http://localhost:3306/
   # Should return: "Novel Online System Backend is Running..."
   ```

---

## 🔍 Troubleshooting

### "Cannot connect to database"
1. Check MySQL is running
2. Verify DB_HOST is correct
3. Check DB_USER and DB_PASSWORD
4. Ensure database exists: `SHOW DATABASES;`

### "Port already in use"
1. Change PORT in .env to another number (e.g., 3000)
2. Or kill the process using that port
3. Restart server

### "JWT errors"
1. Regenerate JWT_SECRET
2. Clear old tokens
3. Users must login again

### "Permission denied"
1. Check user role assignments
2. Verify RoleID in database
3. Check middleware authorization

---

## 📋 Database Schema Summary

The following tables should exist in your database:

1. **Roles** (RoleID, RoleName)
2. **Users** (UserID, Username, Password, FullName, Email, RoleID, CreatedAt)
3. **Categories** (CategoryID, CategoryName, Description)
4. **Novels** (NovelID, Title, Description, CoverImage, AuthorID, CategoryID, Status, ViewCount, CreatedAt)
5. **Chapters** (ChapterID, NovelID, ChapterNumber, Title, Content, CreatedAt)
6. **Comments** (CommentID, UserID, NovelID, ChapterID, Message, CommentedAt)

---

## 💡 Best Practices

1. **Never commit .env to version control** - Add to .gitignore
2. **Use strong passwords in production**
3. **Rotate JWT secret periodically**
4. **Monitor database connections**
5. **Keep MySQL updated**
6. **Use environment-specific settings**
7. **Backup database regularly**

---

## 🔐 Security Checklist

- ✅ Change JWT_SECRET before production
- ✅ Set strong DB_PASSWORD
- ✅ Use dedicated DB_USER (not root)
- ✅ Enable SSL/TLS for database connection
- ✅ Restrict database access to app server only
- ✅ Set appropriate file permissions on .env
- ✅ Use HTTPS for API in production
- ✅ Implement rate limiting
- ✅ Add request logging
- ✅ Monitor for suspicious activity

---

## 📞 Configuration Support

If you need to change configuration:

1. **Stop server** - Ctrl+C
2. **Edit .env** - Update values
3. **Restart server** - `npm start`
4. **Verify** - Test endpoints

Changes take effect immediately after restart.

