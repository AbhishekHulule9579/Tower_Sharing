# Data Entry Guide — Postman + H2 Console

This guide shows how to add data to the running backend using Postman (preferred) and using the H2 console (SQL) for tables/controllers that don't expose POST endpoints.

Run app first (from project root):

```powershell
cd d:\Tower_Sharing\backend
.\mvnw.cmd spring-boot:run
```

H2 Console:
- URL: http://localhost:8080/h2-console/
- JDBC URL: `jdbc:h2:file:./data/towerdb`
- User: `sa` (password blank)

POSTMAN Basics:
- For JSON POST/PUT, set header: `Content-Type: application/json`.
- Many endpoints accept references by ID (e.g. `"ownerOperator": { "id": 1 }`). If you need operator/user IDs, use GET `/api/operators` or insert via SQL.

-------------------------

## Quick list of endpoints (create / write operations)

- Create Tower: POST `http://localhost:8080/api/towers`
- Create Inventory Item: POST `http://localhost:8080/api/maintenance/inventory`
- Create Repair Request: POST `http://localhost:8080/api/maintenance/repair-requests`
- Consume Parts (log usage): POST `http://localhost:8080/api/maintenance/repair-requests/{id}/consume-parts`
- Restore Tower (complete repair): PUT `http://localhost:8080/api/maintenance/repair-requests/{id}/restore-tower`
- Request Lease: POST `http://localhost:8080/api/leases/request`
- Approve/Reject Lease: PUT `http://localhost:8080/api/leases/{id}/approve`
- Buy Tower (transaction): POST `http://localhost:8080/api/transactions/buy`
- Register Disaster Incident: POST `http://localhost:8080/api/disasters/incidents`
- Create Emergency Sharing: POST `http://localhost:8080/api/disasters/emergency-sharing`

Read-only verification endpoints (use after inserts):
- GET `/api/towers`
- GET `/api/maintenance/inventory`
- GET `/api/maintenance/repair-requests`
- GET `/api/leases`
- GET `/api/transactions`
- GET `/api/disasters/incidents`
- GET `/api/disasters/emergency-sharing`

-------------------------

## Sample Postman requests (JSON bodies)

1) Create Tower
POST http://localhost:8080/api/towers

Body:
```json
{
  "towerCode": "TOW-NEW-01",
  "name": "New Site Node",
  "location": "Main Road, Area",
  "city": "Mumbai",
  "state": "Maharashtra",
  "latitude": 19.07,
  "longitude": 72.88,
  "totalCapacity": 120,
  "currentOccupancy": 5,
  "ownerOperator": { "id": 1 },
  "status": "ACTIVE",
  "sharingStatus": "AVAILABLE_FOR_LEASE",
  "monthlyLeaseRate": 60000.0,
  "salePrice": 12000000.0
}
```

2) Create Inventory Item
POST http://localhost:8080/api/maintenance/inventory

Body:
```json
{
  "itemCode": "PART-ANT-TEST",
  "itemName": "Test Panel Antenna",
  "quantity": 10,
  "unitPrice": 25000.0,
  "location": "Mumbai Depot",
  "minThreshold": 2
}
```

3) Create Repair Request (work order)
POST http://localhost:8080/api/maintenance/repair-requests

Body:
```json
{
  "towerId": 1,
  "incidentId": 1,
  "priority": "HIGH",
  "description": "Replace rectifier modules and test power backup",
  "assignedSiteManagerId": 7
}
```

4) Consume Inventory Parts for a Repair
POST http://localhost:8080/api/maintenance/repair-requests/{repairRequestId}/consume-parts

Body:
```json
{
  "inventoryItemId": 4,
  "quantityUsed": 2
}
```

5) Restore Tower (complete repair)
PUT http://localhost:8080/api/maintenance/repair-requests/{repairRequestId}/restore-tower

Body:
```json
{ "maintenanceNotes": "Replaced parts, tested power and signal. Restored to ACTIVE." }
```

6) Request a Lease
POST http://localhost:8080/api/leases/request

Body:
```json
{
  "towerId": 6,
  "lesseeOperatorId": 4,
  "sharedCapacity": 15,
  "months": 12
}
```

7) Approve Lease (Admin)
PUT http://localhost:8080/api/leases/{leaseId}/approve

Body:
```json
{ "approved": true, "approvalNotes": "Approve 15 slots for test operator" }
```

8) Buy Tower (Transaction)
POST http://localhost:8080/api/transactions/buy

Body:
```json
{
  "towerId": 5,
  "buyerOperatorId": 1,
  "agreedPrice": 7500000.0,
  "notes": "Test purchase"
}
```

9) Register Disaster Incident
POST http://localhost:8080/api/disasters/incidents

Body:
```json
{
  "title": "Test Flood",
  "disasterType": "FLOOD",
  "description": "Test flood event",
  "region": "Mumbai",
  "affectedTowerIds": [3]
}
```

10) Create Emergency Sharing
POST http://localhost:8080/api/disasters/emergency-sharing

Body:
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

-------------------------

## When Postman cannot create an entity
Some entities (for example `telecom_operators` and `users`) may not have POST endpoints in the controllers. For those you can either:

- Use SQL via the H2 console (examples below), or
- Add a small controller method to expose POST for the entity (if you prefer a REST method).

### SQL examples for `telecom_operators` and `users` (H2 console)

Open H2 Console -> Run these statements in the SQL tab:

```sql
INSERT INTO telecom_operators (active, code, contact_email, contact_phone, name)
VALUES (TRUE, 'NEWOP', 'op@example.com', '+919000000000', 'New Operator');

INSERT INTO users (email, operator_id, password, role, username)
VALUES ('admin@newop.com', (SELECT id FROM telecom_operators WHERE code='NEWOP'), 'admin123', 'ADMIN', 'newop_admin');
```

Then verify operator id:
```sql
SELECT id, name, code FROM telecom_operators WHERE code='NEWOP';
```
Use that `id` in Postman JSON (for `ownerOperator` or `lesseeOperatorId` etc.).

-------------------------

## Sample dataset to practice with (Postman-ready bodies)

- Create operator via SQL (H2) as above.
- Create one tower (Postman body from "Create Tower").
- Create inventory items (use the "Create Inventory Item" bodies).
- Create a repair request for the tower.
- In a second POST, consume parts for the repair request.
- Complete the repair with the restore API.
- Simulate a disaster and create emergency-sharing.
- Request a lease for an available tower and then `PUT` to approve it.

-------------------------

## Verify data after creation
- Use GET requests to confirm created resources:
  - GET `http://localhost:8080/api/towers`
  - GET `http://localhost:8080/api/maintenance/inventory`
  - GET `http://localhost:8080/api/maintenance/repair-requests`
  - GET `http://localhost:8080/api/leases`
  - GET `http://localhost:8080/api/disasters/incidents`

- Or query directly in H2 console:
  - `SELECT * FROM towers;`
  - `SELECT * FROM inventory_items;`
  - `SELECT * FROM repair_requests;`

-------------------------

## Troubleshooting
- If you get 4xx/5xx, open server logs in the terminal to see the exception and missing IDs.
- Make sure referenced IDs exist (operators, towers, users).
- If a POST fails because controller doesn't accept that entity, use the H2 SQL insert.

-------------------------

If you want, I can also:
- Generate a Postman collection JSON with all requests and sample bodies you can import.
- Add POST endpoints for `telecom_operators` and `users` (so everything can be created via REST without SQL).

File created: `DATA_ENTRY_POSTMAN_GUIDE.md` in the project root.
