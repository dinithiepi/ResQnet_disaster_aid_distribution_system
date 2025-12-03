# ResQNet System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT BROWSER                                  │
│                     http://localhost:5173                                │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   React Frontend App    │
                    │   (Vite + React Router) │
                    │                         │
                    │  - Public Pages         │
                    │  - Admin Portal         │
                    │  - Manager Portal       │
                    └────────────┬────────────┘
                                 │
                                 │ HTTP Requests
                                 │
                    ┌────────────▼────────────┐
                    │   API Gateway Service   │
                    │   Port: 4001            │
                    │   (Express.js)          │
                    │                         │
                    │  Routes requests to     │
                    │  appropriate services   │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
    ┌────────────▼────┐ ┌───────▼────────┐ ┌───▼──────────┐
    │  Admin Service  │ │ Manager Service│ │  Inventory   │
    │  Port: 4002     │ │  Port: 4003    │ │  Service     │
    │                 │ │                │ │  Port: 4004  │
    │ • Register/Login│ │ • Register/Login│ │              │
    │ • Approve Mgrs  │ │ • Item Requests│ │ • Get Items  │
    │ • Manage Reqs   │ │ • View Profile │ │ • Disasters  │
    │ • Aid Centers   │ │ • Mark Received│ │ • Centers    │
    └────────┬────────┘ └────────┬───────┘ └──────┬───────┘
             │                   │                 │
             └───────────────────┼─────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   PostgreSQL Database   │
                    │   Port: 5432            │
                    │   Database: disasteraiddb│
                    │                         │
                    │  Tables:                │
                    │  • admin                │
                    │  • aidcenter            │
                    │  • aidcentermanager     │
                    │  • itemrequest          │
                    │  • inventory            │
                    │  • donation             │
                    │  • disasterarea         │
                    │  • aidcenterinventory   │
                    └─────────────────────────┘
```

## Data Flow Examples

### Manager Item Request Flow
```
Manager Browser
    │
    ├─→ POST /manager/item-requests
    │   (itemcategory, requestedquantity)
    │
    ▼
Gateway Service (4001)
    │
    ├─→ Route to Manager Service
    │
    ▼
Manager Service (4003)
    │
    ├─→ Verify JWT token
    ├─→ Get manager's centerid
    ├─→ INSERT INTO itemrequest
    │
    ▼
Database
    │
    └─→ Return request record
    │
    ▼
Response to Browser
```

### Admin Approval Flow
```
Admin Browser
    │
    ├─→ POST /api/admin/item-requests/approve
    │   (requestId, approvedQuantity, remarks)
    │
    ▼
Gateway Service (4001)
    │
    ├─→ Route to Admin Service
    │
    ▼
Admin Service (4002)
    │
    ├─→ Verify JWT token
    ├─→ UPDATE itemrequest
    │   SET status='approved',
    │       approvedquantity=X,
    │       reviewedby=adminId,
    │       reviewedat=NOW()
    │
    ▼
Database
    │
    └─→ Return updated record
    │
    ▼
Response to Browser
```

## Technology Stack

### Frontend
```
React 18.x
├── React Router 6.x (Navigation)
├── Vite (Build tool)
└── CSS3 (Styling)
```

### Backend
```
Node.js
├── Express.js (Web framework)
├── PostgreSQL (Database)
├── JWT (Authentication)
├── Bcrypt (Password hashing)
└── Multer (File uploads)
```

## Security Layers

```
┌────────────────────────────────────┐
│   Client-Side Validation           │
├────────────────────────────────────┤
│   JWT Token Authentication         │
├────────────────────────────────────┤
│   Role-Based Access Control        │
├────────────────────────────────────┤
│   Password Hashing (Bcrypt)        │
├────────────────────────────────────┤
│   Parameterized SQL Queries        │
├────────────────────────────────────┤
│   File Upload Validation           │
└────────────────────────────────────┘
```

## System States

### Manager States
```
Registration
    │
    ▼
Pending ──────┐
    │         │
    │         ▼
    │     Rejected
    │
    ▼
Approved ────→ Can Request Items
```

### Item Request States
```
Created
    │
    ▼
Pending ──────┬──────┐
    │         │      │
    │         ▼      ▼
    │    Approved  Rejected
    │         │
    │         ▼
    │    Received
    │
    └────→ End
```

## Port Configuration

| Service   | Port | Purpose                          |
|-----------|------|----------------------------------|
| Frontend  | 5173 | React application (Vite)         |
| Gateway   | 4001 | API Gateway & routing            |
| Admin     | 4002 | Admin operations                 |
| Manager   | 4003 | Manager operations & file upload |
| Inventory | 4004 | Inventory & disaster areas       |
| Database  | 5432 | PostgreSQL                       |

## File Structure

```
Disaster-Resource-Allocation-Tracking-System/
│
├── backend/
│   └── disaster-aid-backend/
│       ├── gateway/              (Port 4001)
│       ├── admin-service/        (Port 4002)
│       ├── manager-service/      (Port 4003)
│       ├── inventory-service/    (Port 4004)
│       └── db/                   (SQL files)
│
├── disaster-aid-system/          (Frontend - Port 5173)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   └── manager/
│   │   └── components/
│   └── public/
│
└── Documentation files (.md)
```

## Deployment Architecture (Production)

```
                    Internet
                       │
                       ▼
              ┌────────────────┐
              │  Load Balancer │
              │   (nginx)      │
              └────────┬───────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   Frontend       Gateway       Backend Services
    (CDN)        (Docker)         (Docker)
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
               ┌───────────────┐
               │  PostgreSQL   │
               │  (Managed DB) │
               └───────────────┘
```

## Scaling Considerations

### Horizontal Scaling
- Multiple instances of each service
- Load balancer for distribution
- Shared database or read replicas

### Vertical Scaling
- Increase service resources (CPU/RAM)
- Database optimization
- Caching layer (Redis)

### Database Optimization
- Indexed columns for fast queries
- Connection pooling
- Query optimization
- Regular maintenance

---

**Version:** 1.0.0  
**Last Updated:** December 2025  
**Architecture Type:** Microservices
