# Inventory Management Flow

## Overview
The system automatically manages inventory across three levels:
1. **Admin Inventory** (Central warehouse)
2. **Aid Center Inventory** (Each manager's center)
3. **Donation System** (Public donations)

---

## 📥 Donation Flow (Adds to Admin Inventory)

### Step 1: Donor Submits Donation
- Donor fills form on website
- Donation saved with status: `pending`

### Step 2: Admin Reviews Donation
- Admin sees donation in "Donation Management" page
- Admin can update status:
  - `contacted` - Admin contacted donor
  - `scheduled` - Pickup scheduled
  - **`received`** - ✅ **Donation physically received**
  - `rejected` - Cannot accept donation

### Step 3: Auto-Update Admin Inventory
**When admin marks donation as `received`:**
```
✅ Admin Inventory += Donation Quantity
✅ Donation linked to inventory item
✅ ReceivedDate recorded
```

**Example:**
- Donor donates: 100 Food items
- Admin marks: `received`
- **Result:** Admin Inventory Food += 100

---

## 📤 Item Request Flow (Moves from Admin → Aid Center)

### Step 1: Manager Requests Items
- Manager submits item request from dashboard
- Request saved with status: `pending`

### Step 2: Admin Approves Request
- Admin reviews request in "Item Requests" page
- Admin sets approved quantity (can adjust)
- Adds optional remarks

### Step 3: Auto-Update Both Inventories
**When admin approves request:**
```
✅ Admin Inventory -= Approved Quantity
✅ Aid Center Inventory += Approved Quantity
✅ Request status = 'approved'
```

**Example:**
- Manager requests: 50 Food items
- Admin approves: 40 items (adjusted)
- **Result:**
  - Admin Inventory Food -= 40
  - Aid Center Inventory Food += 40

### Step 4: Manager Confirms Receipt
- Manager sees approved items in dashboard
- Manager clicks "Mark Received"
- **Result:** Request status = `received`

---

## 🔄 Complete Flow Example

### Scenario: Food Donation to Manager Request

**Initial State:**
- Admin Inventory: 0 Food
- Center #1 Inventory: 0 Food

**Step 1:** Donor donates 200 Food items
```
Admin marks donation as 'received'
→ Admin Inventory: 200 Food ✅
```

**Step 2:** Manager #1 requests 50 Food items
```
Manager submits request (status: pending)
```

**Step 3:** Admin approves 50 Food items
```
Admin Inventory: 200 - 50 = 150 Food ✅
Center #1 Inventory: 0 + 50 = 50 Food ✅
Request status: approved
```

**Step 4:** Manager confirms receipt
```
Request status: received ✅
```

**Final State:**
- Admin Inventory: 150 Food
- Center #1 Inventory: 50 Food

---

## 🎯 Key Features

### ✅ Automatic Inventory Updates
- **Donations:** Auto-add to admin inventory when marked 'received'
- **Approvals:** Auto-transfer from admin to center when approved
- **No manual adjustments needed**

### ✅ Inventory Validation
- System checks admin inventory before approval
- Cannot approve more than available stock
- Error message shows available quantity

### ✅ Transaction Safety
- Uses database transactions (BEGIN/COMMIT/ROLLBACK)
- If any step fails, entire operation rolls back
- Prevents data inconsistency

### ✅ Real-time Dashboard Updates
- Admin sees: Total inventory, pending donations, pending requests
- Manager sees: Center inventory, own requests
- Both update after refresh/re-login

---

## 📊 Database Tables

### Inventory (Admin Central)
```sql
ItemID, ItemCategory, Quantity, AdminID
```

### AidCenterInventory (Each Center)
```sql
InventoryID, CenterID, ItemCategory, Quantity, LastUpdated
```

### Donation (Public Donations)
```sql
DonationID, ItemCategory, Quantity, Status, ItemID (when received)
```

### ItemRequest (Manager Requests)
```sql
RequestID, ManagerID, CenterID, ItemCategory, 
RequestedQuantity, ApprovedQuantity, Status
```

---

## 🔐 Status Workflow

### Donation Statuses:
1. `pending` → Awaiting admin action
2. `contacted` → Admin contacted donor
3. `scheduled` → Pickup scheduled
4. **`received`** → **✅ Added to admin inventory**
5. `rejected` → Cannot accept

### Item Request Statuses:
1. `pending` → Awaiting admin approval
2. **`approved`** → **✅ Inventory transferred**
3. `received` → Manager confirmed receipt
4. `rejected` → Request denied

---

## 🎉 Result
- **Fully automated inventory tracking**
- **No manual data entry**
- **Real-time accuracy**
- **Complete audit trail**
