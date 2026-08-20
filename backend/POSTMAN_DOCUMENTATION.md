# Postman API Documentation & Testing Guide
## Telecom Tower Sharing & Disaster Recovery Management Platform

- **Server URL**: `http://localhost:8080`
- **Health Check**: `GET http://localhost:8080/api/health`
- **App Info**: `GET http://localhost:8080/`
- **H2 Web Console URL**: `http://localhost:8080/h2-console`
  - **JDBC URL**: `jdbc:h2:file:./data/towerdb`
  - **User Name**: `sa`
  - **Password**: *(leave blank)*

---

## 1. System Users & Operators (`/api`)

### Get All Telecom Operators
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/operators`

### Get All System Users
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/users`

### Get All Site Managers
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/users/site-managers`

---

## 2. Pillar 1: Tower Sharing Management (`/api/towers`, `/api/leases`, `/api/transactions`)

### Get All Towers
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/towers`

### Get Towers Available for Leasing
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/towers/available-lease`

### Request Tower Lease (Lessee Operator -> Lessor Operator)
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/leases/request`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "towerId": 6,
  "lesseeOperatorId": 4,
  "sharedCapacity": 15,
  "months": 12
}
```

### Approve or Reject Lease Request (Admin)
- **Method**: `PUT`
- **URL**: `http://localhost:8080/api/leases/2/approve`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "approved": true,
  "approvalNotes": "Approved lease allocation of 15 capacity slots for BSNL on Whitefield Node."
}
```

### Get Towers Available for Sale
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/towers/available-sale`

### Buy Tower Asset (Asset Transfer & Ownership Change)
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/transactions/buy`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "towerId": 5,
  "buyerOperatorId": 1,
  "agreedPrice": 7500000.0,
  "notes": "Reliance Jio purchasing BSNL tower asset for network expansion."
}
```

---

## 3. Pillar 2: Disaster Recovery & Emergency Network Sharing (`/api/disasters`)

### Get Active Disaster Incidents
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/disasters/incidents`

### Register a New Disaster Incident (Earthquake / Flood / Storm / Outage)
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/disasters/incidents`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "title": "Cyclone Vardah Coastal Network Damage",
  "disasterType": "STORM",
  "description": "High velocity wind damaged tower mast and antenna alignment.",
  "region": "Chennai Coast",
  "affectedTowerIds": [5]
}
```

### Initiate Emergency Network Traffic Sharing
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/disasters/emergency-sharing`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "incidentId": 1,
  "damagedTowerId": 3,
  "hostTowerId": 4,
  "affectedOperatorId": 3,
  "hostOperatorId": 1,
  "sharedCapacity": 30,
  "dailyRate": 2500.0,
  "days": 30
}
```

### Resolve Disaster Incident
- **Method**: `PUT`
- **URL**: `http://localhost:8080/api/disasters/incidents/1/resolve`

---

## 4. Pillar 3: Inventory & Maintenance Management (`/api/maintenance`)

### Get All Inventory & Spare Parts
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/maintenance/inventory`

### Add New Inventory Spare Part
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/maintenance/inventory`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "itemCode": "PART-PWR-SUPP",
  "itemName": "Dual Channel Power Supply Unit",
  "quantity": 15,
  "unitPrice": 18000.0,
  "location": "Mumbai Warehouse",
  "minThreshold": 5
}
```

### Create Repair Request / Work Order (Admin / Operator Manager)
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/maintenance/repair-requests`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "towerId": 3,
  "incidentId": 1,
  "priority": "HIGH",
  "description": "Replace damaged rectifier modules and realign panel antennas.",
  "assignedSiteManagerId": 7
}
```

### Get Repair Tasks Assigned to Site Manager
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/maintenance/repair-requests/site-manager/7`

### Log Consumed Inventory Parts (Site Manager Workflow - Auto Deducts Stock)
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/maintenance/repair-requests/1/consume-parts`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "inventoryItemId": 4,
  "quantityUsed": 2
}
```

### Complete Repair & Restore Tower Service (Site Manager -> Tower Status = ACTIVE)
- **Method**: `PUT`
- **URL**: `http://localhost:8080/api/maintenance/repair-requests/1/restore-tower`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "maintenanceNotes": "All damaged parts replaced, power restored, signal testing verified. Tower restored back to ACTIVE."
}
```

---

## 5. Analytics & Dashboard Endpoints (`/api/dashboards`)

### Tower Utilization Dashboard
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/dashboards/tower-utilization`

### Disaster Monitoring Dashboard
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/dashboards/disaster-monitoring`

### Revenue & Lease Management Dashboard
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/dashboards/revenue-lease`

### Maintenance & Cost Reports Dashboard
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/dashboards/maintenance-report`












SELECT * FROM USERS;
ID  	EMAIL  	PASSWORD  	ROLE  	USERNAME  	OPERATOR_ID  	FULL_NAME  	PHONE_NUMBER  
1	admin@platform.com	admin123	ADMIN	admin	null	null	null
2	manager@jio.com	pass123	OPERATOR_MANAGER	jio_mgr	1	null	null
3	manager@airtel.com	pass123	OPERATOR_MANAGER	airtel_mgr	2	null	null
4	manager@vi.com	pass123	OPERATOR_MANAGER	vi_mgr	3	null	null
5	manager@bsnl.com	pass123	OPERATOR_MANAGER	bsnl_mgr	4	null	null
6	mumbai.site@jio.com	site123	SITE_MANAGER	site_mgr_mumbai	1	null	null
7	delhi.site@airtel.com	site123	SITE_MANAGER	site_mgr_delhi	2	null	null
8	chennai.site@vi.com	site123	SITE_MANAGER	site_mgr_chennai	3	null	null