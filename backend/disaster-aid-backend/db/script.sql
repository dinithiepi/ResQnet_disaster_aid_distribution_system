-- Disable foreign key checks temporarily for clean setup
SET session_replication_role = replica;

-- 1. Create Tables

-- Table: admin (Screenshot 201552.png)
CREATE TABLE admin (
    adminid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    name CHARACTER VARYING(100) NOT NULL,
    email CHARACTER VARYING(100) UNIQUE NOT NULL,
    phoneno CHARACTER VARYING(20) NOT NULL,
    password CHARACTER VARYING(255),
    CONSTRAINT admin_pkey PRIMARY KEY (adminid)
);

-- Table: aidcenter (Screenshot 201552.png)
CREATE TABLE aidcenter (
    centerid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    district CHARACTER VARYING(100) NOT NULL,
    location CHARACTER VARYING(150),
    CONSTRAINT aidcenter_pkey PRIMARY KEY (centerid)
);

-- Table: inventory (Screenshot 201642.png)
CREATE TABLE inventory (
    itemid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    itemcategory CHARACTER VARYING(100) NOT NULL,
    quantity INTEGER NOT NULL,
    adminid INTEGER,
    CONSTRAINT inventory_pkey PRIMARY KEY (itemid),
    CONSTRAINT inventory_quantity_check CHECK (quantity >= 0)
);

-- Table: aidcentermanager (Screenshot 201605.png)
CREATE TABLE aidcentermanager (
    managerid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    fname CHARACTER VARYING(50),
    lname CHARACTER VARYING(50),
    name TEXT GENERATED ALWAYS AS (((fname::text || ' '::text) || lname::text)) STORED,
    email CHARACTER VARYING(100) NOT NULL UNIQUE,
    phoneno CHARACTER VARYING(20),
    district CHARACTER VARYING(100),
    adminid INTEGER,
    certificatepath CHARACTER VARYING(255),
    status CHARACTER VARYING(20) DEFAULT 'pending'::CHARACTER VARYING,
    createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approvedby INTEGER,
    approvedat TIMESTAMP WITHOUT TIME ZONE,
    centerid INTEGER,
    CONSTRAINT aidcentermanager_pkey PRIMARY KEY (managerid),
    CONSTRAINT aidcentermanager_status_check CHECK (status::text = ANY (ARRAY['pending'::CHARACTER VARYING, 'approved'::CHARACTER VARYING, 'rejected'::CHARACTER VARYING]::text[]))
);

-- Table: disasterarea (Screenshot 201623.png)
CREATE TABLE disasterarea (
    disasterno INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    district CHARACTER VARYING(100) NOT NULL,
    aidcenterid INTEGER,
    areaname CHARACTER VARYING(200),
    location CHARACTER VARYING(200),
    severity CHARACTER VARYING(20) DEFAULT 'moderate'::CHARACTER VARYING,
    affectedpopulation INTEGER DEFAULT 0,
    description TEXT,
    createddate TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updateddate TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT disasterarea_pkey PRIMARY KEY (disasterno)
);

-- Table: donation (Screenshot 201623.png)
CREATE TABLE donation (
    donationid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    itemid INTEGER,
    itemcategory CHARACTER VARYING(100),
    quantity INTEGER NOT NULL,
    volunteername CHARACTER VARYING(100),
    volunteerphoneno CHARACTER VARYING(20),
    adminid INTEGER,
    status CHARACTER VARYING(20) DEFAULT 'pending'::CHARACTER VARYING,
    volunteeremail CHARACTER VARYING(100),
    volunteeraddress TEXT,
    notes TEXT,
    submitteddate TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    receiveddate TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT donation_pkey PRIMARY KEY (donationid),
    CONSTRAINT donation_quantity_check CHECK (quantity >= 0)
);

-- Table: aidcenterinventory (Screenshot 201605.png)
CREATE TABLE aidcenterinventory (
    inventoryid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    centerid INTEGER,
    itemcategory CHARACTER VARYING(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    lastupdated TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedby INTEGER,
    CONSTRAINT aidcenterinventory_pkey PRIMARY KEY (inventoryid),
    CONSTRAINT aidcenterinventory_quantity_check CHECK (quantity >= 0)
);

-- Table: itemrequest (Screenshot 201642.png)
CREATE TABLE itemrequest (
    requestid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    managerid INTEGER NOT NULL,
    centerid INTEGER NOT NULL,
    itemcategory CHARACTER VARYING(100) NOT NULL,
    requestedquantity INTEGER NOT NULL,
    approvedquantity INTEGER,
    status CHARACTER VARYING(20) DEFAULT 'pending'::CHARACTER VARYING,
    remarks TEXT,
    requestedat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewedby INTEGER,
    reviewedat TIMESTAMP WITHOUT TIME ZONE,
    receivedat TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT itemrequest_pkey PRIMARY KEY (requestid),
    CONSTRAINT itemrequest_approvedquantity_check CHECK (approvedquantity >= 0),
    CONSTRAINT itemrequest_requestedquantity_check CHECK (requestedquantity >= 0),
    CONSTRAINT itemrequest_status_check CHECK (status::text = ANY (ARRAY['pending'::CHARACTER VARYING, 'approved'::CHARACTER VARYING, 'rejected'::CHARACTER VARYING, 'received'::CHARACTER VARYING]::text[]))
);

-- Table: inventoryrequests (Screenshot 201654.png)
CREATE TABLE inventoryrequests (
    requestid INTEGER NOT NULL, -- NOTE: NOT generated by IDENTITY as it matches requestid in itemrequest
    managerid INTEGER NOT NULL,
    centerid INTEGER NOT NULL,
    itemcategory CHARACTER VARYING(100) NOT NULL,
    quantity INTEGER NOT NULL,
    priority CHARACTER VARYING(20) NOT NULL,
    reason TEXT,
    status CHARACTER VARYING(20) NOT NULL DEFAULT 'pending'::CHARACTER VARYING,
    adminresponse TEXT,
    createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP WITHOUT TIME ZONE,
    quantitysent INTEGER DEFAULT 0,
    CONSTRAINT inventoryrequests_pkey PRIMARY KEY (requestid),
    CONSTRAINT inventoryrequests_priority_check CHECK (priority::text = ANY (ARRAY['low'::CHARACTER VARYING, 'medium'::CHARACTER VARYING, 'high'::CHARACTER VARYING, 'urgent'::CHARACTER VARYING]::text[])),
    CONSTRAINT inventoryrequests_status_check CHECK (status::text = ANY (ARRAY['pending'::CHARACTER VARYING, 'approved'::CHARACTER VARYING, 'rejected'::CHARACTER VARYING, 'fulfilled'::CHARACTER VARYING]::text[]))
);

-- 2. Add Foreign Key Constraints

-- For inventory
ALTER TABLE inventory ADD CONSTRAINT "FK_inventory_admin" FOREIGN KEY (adminid) REFERENCES admin(adminid);

-- For disasterarea
ALTER TABLE disasterarea ADD CONSTRAINT "FK_disaster_aidcenter" FOREIGN KEY (aidcenterid) REFERENCES aidcenter(centerid);

-- For donation
ALTER TABLE donation ADD CONSTRAINT "FK_donation_admin" FOREIGN KEY (adminid) REFERENCES admin(adminid);
ALTER TABLE donation ADD CONSTRAINT "FK_donation_item" FOREIGN KEY (itemid) REFERENCES inventory(itemid) ON DELETE SET NULL;

-- For aidcentermanager
ALTER TABLE aidcentermanager ADD CONSTRAINT "FK_aidcenter_admin" FOREIGN KEY (adminid) REFERENCES admin(adminid);
ALTER TABLE aidcentermanager ADD CONSTRAINT "FK_manager_approved_by" FOREIGN KEY (approvedby) REFERENCES admin(adminid);
ALTER TABLE aidcentermanager ADD CONSTRAINT "FK_manager_center" FOREIGN KEY (centerid) REFERENCES aidcenter(centerid);

-- For aidcenterinventory
ALTER TABLE aidcenterinventory ADD CONSTRAINT "FK_center_inventory" FOREIGN KEY (centerid) REFERENCES aidcenter(centerid);
ALTER TABLE aidcenterinventory ADD CONSTRAINT "FK_inventory_manager" FOREIGN KEY (updatedby) REFERENCES aidcentermanager(managerid);

-- For itemrequest
ALTER TABLE itemrequest ADD CONSTRAINT "FK_request_center" FOREIGN KEY (centerid) REFERENCES aidcenter(centerid);
ALTER TABLE itemrequest ADD CONSTRAINT "FK_request_manager" FOREIGN KEY (managerid) REFERENCES aidcentermanager(managerid);
ALTER TABLE itemrequest ADD CONSTRAINT "FK_request_reviewer" FOREIGN KEY (reviewedby) REFERENCES admin(adminid);

-- For inventoryrequests
ALTER TABLE inventoryrequests ADD CONSTRAINT "FK_inventoryrequests_centerid_fkey" FOREIGN KEY (centerid) REFERENCES aidcenter(centerid) ON DELETE CASCADE;
ALTER TABLE inventoryrequests ADD CONSTRAINT "FK_inventoryrequests_managerid_fkey" FOREIGN KEY (managerid) REFERENCES aidcentermanager(managerid) ON DELETE CASCADE;

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- 3. Trigger (from Screenshot 201654.png)
-- Note: This requires defining the 'update_request_timestamp()' function first.
-- Since the function definition isn't provided, this is the trigger definition:
-- CREATE TRIGGER trigger_update_request_timestamp BEFORE UPDATE ON inventoryrequests FOR EACH ROW EXECUTE FUNCTION update_request_timestamp();