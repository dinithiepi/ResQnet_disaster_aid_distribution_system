# Database Migration Instructions

## Required Migrations

Before testing the admin dashboard features, you need to run these database migrations to update your schema.

### 1. Donation Status Migration
Adds status tracking fields to the Donation table for the admin approval workflow.

**File**: `migration_donation_status.sql`

**What it does**:
- Adds `Status` field (pending, contacted, scheduled, received, rejected)
- Adds `VolunteerEmail`, `VolunteerAddress`, `VolunteerPhoneNo` fields
- Adds `Notes` field for admin comments
- Adds `SubmittedDate` and `ReceivedDate` timestamp fields

### 2. Disaster Area Fields Migration
Adds detailed tracking fields to the DisasterArea table for the admin disaster area management.

**File**: `migration_disaster_area_fields.sql`

**What it does**:
- Adds `AreaName`, `Location`, `Severity` fields
- Adds `AffectedPopulation` field (default 0)
- Adds `Description` field for detailed information
- Adds `CreatedDate` and `UpdatedDate` timestamp fields
- Creates index on Severity for query optimization

---

## How to Run Migrations

### Option 1: Using psql command line

```bash
# Navigate to the db directory
cd backend/disaster-aid-backend/db

# Run donation status migration
psql -U postgres -d disasteraiddb -f migration_donation_status.sql

# Run disaster area fields migration
psql -U postgres -d disasteraiddb -f migration_disaster_area_fields.sql
```

### Option 2: Using pgAdmin
1. Open pgAdmin and connect to your database
2. Right-click on `disasteraiddb` database
3. Select **Query Tool**
4. Open `migration_donation_status.sql` and execute
5. Open `migration_disaster_area_fields.sql` and execute

### Option 3: Using VS Code PostgreSQL extension
1. Open the migration file in VS Code
2. Press `Ctrl+Shift+P` and search "PostgreSQL: Run Query"
3. Select your database connection
4. Repeat for both migration files

---

## Verification

After running migrations, verify the changes:

```sql
-- Check Donation table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'donation';

-- Check DisasterArea table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'disasterarea';
```

Expected new columns in **Donation**:
- status
- volunteeremail
- volunteeraddress
- volunteerphoneno
- notes
- submitteddate
- receiveddate

Expected new columns in **DisasterArea**:
- areaname
- location
- severity
- affectedpopulation
- description
- createddate
- updateddate

---

## Troubleshooting

### "column already exists" error
If you see this error, the migration was already run. You can skip it.

### "relation does not exist" error
Make sure you're connected to the correct database (`disasteraiddb`).

### Permission denied
Make sure your PostgreSQL user has ALTER TABLE permissions:
```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
```

---

## After Migration

Once migrations are complete:
1. Restart the inventory-service: `node backend/disaster-aid-backend/inventory-service/src/index.js`
2. Test the admin dashboard features:
   - Login as admin at http://localhost:5174/admin
   - Navigate to "Disaster Areas" - test create/update/delete
   - Navigate to "Inventory Management" - test create/update/delete
   - Navigate to "Donation Requests" - test approval workflow
