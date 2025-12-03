# Quick Start Guide - ResQNet Disaster Aid System

This guide will help you get the system up and running in minutes.

## Step 1: Database Setup (5 minutes)

```bash
# 1. Start PostgreSQL
# Windows: Start from Services or pgAdmin
# Linux/Mac: sudo service postgresql start

# 2. Run the main script
psql -U postgres -f backend/disaster-aid-backend/db/script.sql

# 3. Apply all migrations
cd backend/disaster-aid-backend/db
psql -U postgres -d disasteraiddb -f migration_manager.sql
psql -U postgres -d disasteraiddb -f migration_add_admin_password.sql
psql -U postgres -d disasteraiddb -f migration_disaster_area_fields.sql
psql -U postgres -d disasteraiddb -f migration_donation_status.sql
psql -U postgres -d disasteraiddb -f migration_item_requests.sql
```

## Step 2: Configure Environment (2 minutes)

Create `.env` files in each service directory:

**backend/disaster-aid-backend/gateway/.env**
```env
PORT=4001
JWT_SECRET=your_secret_key_here
```

**backend/disaster-aid-backend/admin-service/.env**
```env
PORT=4002
DB_HOST=localhost
DB_PORT=5432
DB_NAME=disasteraiddb
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secret_key_here
```

**backend/disaster-aid-backend/manager-service/.env**
```env
PORT=4003
DB_HOST=localhost
DB_PORT=5432
DB_NAME=disasteraiddb
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secret_key_here
```

**backend/disaster-aid-backend/inventory-service/.env**
```env
PORT=4004
DB_HOST=localhost
DB_PORT=5432
DB_NAME=disasteraiddb
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

## Step 3: Install Dependencies (3 minutes)

```bash
# Backend services
cd backend/disaster-aid-backend

# Gateway
cd gateway && npm install && cd ..

# Admin service
cd admin-service && npm install && cd ..

# Manager service
cd manager-service && npm install && cd ..

# Inventory service
cd inventory-service && npm install && cd ..

# Frontend
cd ../../disaster-aid-system
npm install
```

## Step 4: Start All Services (1 minute)

Open 5 terminal windows:

**Terminal 1 - Gateway:**
```bash
cd backend/disaster-aid-backend/gateway
npm start
```

**Terminal 2 - Admin Service:**
```bash
cd backend/disaster-aid-backend/admin-service
npm start
```

**Terminal 3 - Manager Service:**
```bash
cd backend/disaster-aid-backend/manager-service
npm start
```

**Terminal 4 - Inventory Service:**
```bash
cd backend/disaster-aid-backend/inventory-service
npm start
```

**Terminal 5 - Frontend:**
```bash
cd disaster-aid-system
npm run dev
```

## Step 5: Create Test Data (2 minutes)

```bash
# Connect to database
psql -U postgres -d disasteraiddb

# Create aid centers
INSERT INTO aidcenter (district, location) VALUES
('Colombo', 'Colombo Central Distribution Center'),
('Gampaha', 'Gampaha Regional Center'),
('Kandy', 'Kandy Hill Country Center'),
('Galle', 'Galle Southern Center');

# Exit
\q
```

## Step 6: Access the Application

Open your browser and navigate to: **http://localhost:5173**

## Test the System

### Test Admin Flow

1. Go to http://localhost:5173/admin/register
2. Register as admin:
   - Name: Admin Test
   - Email: admin@test.com
   - Password: admin123
   - Phone: 0771234567

3. Login at http://localhost:5173/admin/login

### Test Manager Flow

1. Go to http://localhost:5173/manager/register
2. Register as manager:
   - First Name: John
   - Last Name: Doe
   - Email: manager@test.com
   - Password: manager123
   - Phone: 0771234568
   - District: Colombo
   - Upload a test certificate (any image/PDF)

3. As admin, go to "Manager Approval"
4. Select an aid center (e.g., Colombo Central Distribution Center)
5. Approve the manager

6. As manager, login at http://localhost:5173/manager/login

### Test Item Request Flow

1. As manager, click "Item Requests"
2. Submit a new request:
   - Item Category: Food
   - Quantity: 100
   - Click "Submit Request"

3. As admin, go to "Item Requests"
4. Find the pending request
5. Click ✓ to approve
6. Enter approved quantity: 100
7. Add remarks (optional)
8. Click "Approve Request"

9. As manager, refresh the page
10. See the approved status
11. Click "Mark Received"

## Verify Everything Works

✅ Admin can register and login  
✅ Manager can register and login  
✅ Admin can approve managers with aid center assignment  
✅ Manager can submit item requests  
✅ Admin can approve/reject requests  
✅ Manager can mark items as received  
✅ All pages load without errors  
✅ Navigation works smoothly  

## Common Issues & Solutions

**Issue: "Port already in use"**
```bash
# Windows - Kill process on port
netstat -ano | findstr :4001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4001 | xargs kill -9
```

**Issue: "Database connection failed"**
- Check PostgreSQL is running
- Verify credentials in .env files
- Ensure database "disasteraiddb" exists

**Issue: "Cannot find module"**
- Run `npm install` in the affected service directory

**Issue: "Token invalid"**
- Clear browser localStorage (F12 > Application > Local Storage > Clear)
- Ensure JWT_SECRET is the same in all .env files

## What's Next?

- Explore the admin dashboard
- Add inventory items
- Create disaster areas
- Test the donation system
- Review the Map page
- Customize the system for your needs

## Need Help?

Check the full README_FINALIZED.md for detailed documentation.

---

**Total Setup Time: ~15 minutes**  
**Difficulty: Beginner-Friendly**  

Enjoy using ResQNet! 🎉
