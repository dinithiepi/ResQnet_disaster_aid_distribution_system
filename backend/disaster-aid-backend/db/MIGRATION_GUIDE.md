# Database Migration Instructions

This document outlines how to apply database migrations for the Disaster Aid Management System.

## Prerequisites
- PostgreSQL installed and running
- Access to the database with appropriate permissions
- psql command-line tool or database management tool (pgAdmin, DBeaver, etc.)

## Migration Order

Apply migrations in the following order:

### 1. Initial Database Setup
```bash
psql -U postgres -f backend/disaster-aid-backend/db/script.sql
```

### 2. Manager System Migration
```bash
psql -U postgres -d disasteraiddb -f backend/disaster-aid-backend/db/migration_manager.sql
```

### 3. Admin Password Migration
```bash
psql -U postgres -d disasteraiddb -f backend/disaster-aid-backend/db/migration_add_admin_password.sql
```

### 4. Disaster Area Fields Migration
```bash
psql -U postgres -d disasteraiddb -f backend/disaster-aid-backend/db/migration_disaster_area_fields.sql
```

### 5. Donation Status Migration
```bash
psql -U postgres -d disasteraiddb -f backend/disaster-aid-backend/db/migration_donation_status.sql
```

### 6. Item Request System Migration (NEW)
```bash
psql -U postgres -d disasteraiddb -f backend/disaster-aid-backend/db/migration_item_requests.sql
```

## Verification

After running all migrations, verify the tables exist:

```sql
\c disasteraiddb
\dt

-- Should show these tables:
-- admin
-- aidcenter
-- aidcentermanager
-- aidcenterinventory
-- disasterarea
-- inventory
-- donation
-- itemrequest
```

## Important Notes

- **Backup your database** before running any migrations
- The `migration_item_requests.sql` drops the `ChatMessage` table as chat functionality has been removed
- Managers must be assigned an aid center ID when approved by admin
- Item requests are tracked through the complete lifecycle: pending → approved → received

## Sample Data for Testing

### Create Aid Centers
```sql
INSERT INTO aidcenter (district, location) VALUES
('Colombo', 'Colombo Central Distribution Center'),
('Gampaha', 'Gampaha Regional Center'),
('Kandy', 'Kandy Hill Country Center'),
('Galle', 'Galle Southern Center');
```

### Check Item Requests
```sql
-- View all item requests
SELECT * FROM itemrequest ORDER BY requestedat DESC;

-- View pending requests
SELECT * FROM itemrequest WHERE status = 'pending';

-- View manager's aid center assignment
SELECT m.name, m.email, m.centerid, a.location 
FROM aidcentermanager m 
LEFT JOIN aidcenter a ON m.centerid = a.centerid
WHERE m.status = 'approved';
```

## Rollback (if needed)

If you need to rollback the item request migration:

```sql
DROP TABLE IF EXISTS itemrequest;
-- Restore ChatMessage table if needed (not recommended as chat is deprecated)
```

## Support

For issues with migrations, check:
1. PostgreSQL logs for errors
2. Ensure all previous migrations were applied successfully
3. Verify database permissions
4. Check connection settings in `.env` files
