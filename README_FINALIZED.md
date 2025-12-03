# Disaster Resource Allocation & Tracking System (ResQNet)

A comprehensive disaster aid management system that enables efficient coordination between administrators and aid center managers for resource allocation and tracking.

## 🌟 Features

### Admin Portal
- **Dashboard Overview**: Real-time statistics and system insights
- **Disaster Area Management**: Track and manage affected areas
- **Inventory Management**: Monitor central inventory levels
- **Donation Management**: Review and process donation requests
- **Manager Approval**: Approve manager registrations and assign aid centers
- **Item Request Management**: Review and approve resource requests from managers

### Manager Portal
- **Item Request System**: Request resources from central inventory
- **Request Tracking**: Monitor status of submitted requests (pending/approved/rejected/received)
- **Received Confirmation**: Mark approved items as received
- **Aid Center Inventory**: View assigned aid center inventory
- **Profile Management**: Access aid center and manager details

### Public Portal
- **Home**: Overview of the system and disaster relief efforts
- **Inventory**: Public view of available resources
- **Donors**: Recognition of donors and contributions
- **Donate**: Donation form for volunteers
- **Map**: Interactive map of disaster areas and aid centers
- **About**: System information and contact details

## 🏗️ System Architecture

### Technology Stack

**Frontend:**
- React 18+ with Vite
- React Router for navigation
- Modern CSS3 with responsive design

**Backend:**
- Node.js microservices architecture
- Express.js framework
- PostgreSQL database
- JWT authentication
- Bcrypt for password hashing

**Services:**
1. **Gateway Service** (Port 4001): API gateway and routing
2. **Admin Service** (Port 4002): Admin operations and management
3. **Manager Service** (Port 4003): Manager operations and requests
4. **Inventory Service** (Port 4004): Inventory and disaster area management

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Database Setup

```bash
# Create and setup database
psql -U postgres -f backend/disaster-aid-backend/db/script.sql

# Apply migrations in order
psql -U postgres -d disasteraiddb -f backend/disaster-aid-backend/db/migration_manager.sql
psql -U postgres -d disasteraiddb -f backend/disaster-aid-backend/db/migration_add_admin_password.sql
psql -U postgres -d disasteraiddb -f backend/disaster-aid-backend/db/migration_disaster_area_fields.sql
psql -U postgres -d disasteraiddb -f backend/disaster-aid-backend/db/migration_donation_status.sql
psql -U postgres -d disasteraiddb -f backend/disaster-aid-backend/db/migration_item_requests.sql
```

### 2. Backend Services Setup

```bash
# Navigate to backend directory
cd backend/disaster-aid-backend

# Install dependencies for each service
cd gateway && npm install && cd ..
cd admin-service && npm install && cd ..
cd manager-service && npm install && cd ..
cd inventory-service && npm install && cd ..
```

Create `.env` file in each service directory:

```env
PORT=4001  # or respective port
DB_HOST=localhost
DB_PORT=5432
DB_NAME=disasteraiddb
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
```

### 3. Frontend Setup

```bash
cd disaster-aid-system
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:4001
```

## 🎯 Running the Application

### Start Backend Services

Open 4 separate terminals:

```bash
# Terminal 1 - Gateway
cd backend/disaster-aid-backend/gateway
npm start

# Terminal 2 - Admin Service
cd backend/disaster-aid-backend/admin-service
npm start

# Terminal 3 - Manager Service
cd backend/disaster-aid-backend/manager-service
npm start

# Terminal 4 - Inventory Service
cd backend/disaster-aid-backend/inventory-service
npm start
```

### Start Frontend

```bash
cd disaster-aid-system
npm run dev
```

Access the application at `http://localhost:5173`

## 📖 User Workflows

### Admin Workflow

1. **Register/Login**: Access admin portal at `/admin/login`
2. **Approve Managers**: 
   - Navigate to "Manager Approval"
   - Review manager applications
   - Assign an aid center to the manager
   - Approve or reject
3. **Manage Item Requests**:
   - Navigate to "Item Requests"
   - Review requests from managers
   - Set approved quantity (can be different from requested)
   - Add remarks if needed
   - Approve or reject requests
4. **Monitor System**:
   - Dashboard overview for statistics
   - Inventory management
   - Disaster area tracking
   - Donation management

### Manager Workflow

1. **Register**: Upload village officer certificate at `/manager/register`
2. **Wait for Approval**: Admin will review and approve
3. **Login**: Access manager portal at `/manager/login`
4. **Request Items**:
   - Select item category (Food, Water, Medicine, etc.)
   - Enter requested quantity
   - Submit request
5. **Track Requests**: Monitor status in "My Requests" table
6. **Confirm Receipt**: Mark approved items as "Received"
7. **View Inventory**: Check aid center inventory levels

### Donor Workflow

1. **Visit Public Portal**: Browse available resources
2. **Submit Donation**: Fill donation form with item details
3. **Track Status**: Donation appears in admin dashboard for processing

## 🗄️ Database Schema

### Key Tables

- `admin`: System administrators
- `aidcenter`: Aid center locations
- `aidcentermanager`: Manager accounts with aid center assignments
- `itemrequest`: Item requests from managers
- `inventory`: Central inventory
- `aidcenterinventory`: Inventory at each aid center
- `disasterarea`: Affected areas
- `donation`: Donation requests

### Item Request Lifecycle

```
pending → (admin review) → approved → (manager confirms) → received
                       ↓
                    rejected
```

## 🔒 Security Features

- JWT-based authentication
- Bcrypt password hashing (10 salt rounds)
- Protected routes with middleware
- Role-based access control
- Certificate verification for managers
- Secure file upload handling

## 📱 Responsive Design

- Mobile-first approach
- Responsive tables and grids
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🎨 UI/UX Features

- Modern, clean design
- Intuitive navigation
- Status badges for easy tracking
- Real-time updates
- Loading states
- Empty state messages
- Confirmation dialogs
- Toast notifications
- Modal dialogs for forms

## 🧪 Testing

### Sample Test Data

```sql
-- Create aid centers
INSERT INTO aidcenter (district, location) VALUES
('Colombo', 'Colombo Central Distribution Center'),
('Gampaha', 'Gampaha Regional Center');

-- Create admin
INSERT INTO admin (name, email, password, phoneno) VALUES
('Admin User', 'admin@resqnet.com', '$2b$10$...', '0771234567');
```

## 📊 API Endpoints

### Admin Endpoints
- POST `/api/admin/register` - Register admin
- POST `/api/admin/login` - Admin login
- GET `/api/admin/managers/pending` - Get pending managers
- POST `/api/admin/managers/approve` - Approve manager with center assignment
- POST `/api/admin/managers/reject` - Reject manager
- GET `/api/admin/aidcenters` - Get all aid centers
- GET `/api/admin/item-requests` - Get all item requests
- POST `/api/admin/item-requests/approve` - Approve item request
- POST `/api/admin/item-requests/reject` - Reject item request

### Manager Endpoints
- POST `/manager/register` - Register manager (with certificate)
- POST `/manager/login` - Manager login
- GET `/manager/profile` - Get manager profile
- POST `/manager/item-requests` - Create item request
- GET `/manager/item-requests` - Get manager's requests
- POST `/manager/item-requests/received` - Mark item as received

## 🔧 Troubleshooting

### Common Issues

**Database Connection Errors:**
- Verify PostgreSQL is running
- Check credentials in `.env` files
- Ensure database exists and migrations are applied

**Port Already in Use:**
- Change port in service `.env` file
- Update gateway routing if needed

**Authentication Failures:**
- Clear browser localStorage
- Verify JWT_SECRET matches across services
- Check token expiration settings

## 📝 Environment Variables

### Backend Services

```env
PORT=4002
DB_HOST=localhost
DB_PORT=5432
DB_NAME=disasteraiddb
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend

```env
VITE_API_URL=http://localhost:4001
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is developed for disaster management and humanitarian purposes.

## 👥 Authors

- ResQNet Development Team

## 🆘 Support

For support, please contact the system administrator or create an issue in the repository.

## 🎯 Future Enhancements

- Real-time notifications
- SMS alerts for managers
- Mobile application
- Analytics dashboard
- Reporting system
- Multi-language support
- Barcode/QR code scanning
- Integration with external logistics systems

---

**Version:** 1.0.0  
**Last Updated:** December 2025  
**Status:** Production Ready
