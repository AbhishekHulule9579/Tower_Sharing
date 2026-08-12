package com.towerSharing.backend.controller;

import com.towerSharing.backend.dto.ConsumePartsDto;
import com.towerSharing.backend.dto.RepairRequestCreateDto;
import com.towerSharing.backend.dto.RestoreTowerDto;
import com.towerSharing.backend.model.InventoryItem;
import com.towerSharing.backend.model.RepairInventoryUsage;
import com.towerSharing.backend.model.RepairRequest;
import com.towerSharing.backend.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "*")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @Autowired
    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping("/inventory")
    public ResponseEntity<List<InventoryItem>> getAllInventory() {
        return ResponseEntity.ok(maintenanceService.getAllInventory());
    }

    @PostMapping("/inventory")
    public ResponseEntity<InventoryItem> createInventoryItem(@RequestBody InventoryItem item) {
        return ResponseEntity.ok(maintenanceService.createInventoryItem(item));
    }

    @GetMapping("/repair-requests")
    public ResponseEntity<List<RepairRequest>> getAllRepairRequests() {
        return ResponseEntity.ok(maintenanceService.getAllRepairRequests());
    }

    @PostMapping("/repair-requests")
    public ResponseEntity<RepairRequest> createRepairRequest(@RequestBody RepairRequestCreateDto dto) {
        return ResponseEntity.ok(maintenanceService.createRepairRequest(dto));
    }

    @GetMapping("/repair-requests/site-manager/{siteManagerId}")
    public ResponseEntity<List<RepairRequest>> getRepairRequestsForSiteManager(@PathVariable Long siteManagerId) {
        return ResponseEntity.ok(maintenanceService.getRepairRequestsForSiteManager(siteManagerId));
    }

    @PostMapping("/repair-requests/{id}/consume-parts")
    public ResponseEntity<RepairInventoryUsage> consumeParts(@PathVariable Long id, @RequestBody ConsumePartsDto dto) {
        return ResponseEntity.ok(maintenanceService.consumeInventoryParts(id, dto));
    }

    @PutMapping("/repair-requests/{id}/restore-tower")
    public ResponseEntity<RepairRequest> restoreTower(@PathVariable Long id, @RequestBody RestoreTowerDto dto) {
        return ResponseEntity.ok(maintenanceService.restoreTowerService(id, dto));
    }
}
