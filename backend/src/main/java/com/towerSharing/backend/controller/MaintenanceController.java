package com.towerSharing.backend.controller;

import com.towerSharing.backend.config.JwtUtil;
import com.towerSharing.backend.dto.ConsumePartsDto;
import com.towerSharing.backend.dto.RepairRequestCreateDto;
import com.towerSharing.backend.dto.RestoreTowerDto;
import com.towerSharing.backend.model.InventoryItem;
import com.towerSharing.backend.model.RepairInventoryUsage;
import com.towerSharing.backend.model.RepairRequest;
import com.towerSharing.backend.model.Tower;
import com.towerSharing.backend.model.User;
import com.towerSharing.backend.model.UserRole;
import com.towerSharing.backend.repository.TowerRepository;
import com.towerSharing.backend.repository.UserRepository;
import com.towerSharing.backend.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "*")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;
    private final TowerRepository towerRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public MaintenanceController(MaintenanceService maintenanceService,
                                 TowerRepository towerRepository,
                                 UserRepository userRepository,
                                 JwtUtil jwtUtil) {
        this.maintenanceService = maintenanceService;
        this.towerRepository = towerRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
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
    public ResponseEntity<?> createRepairRequest(@RequestBody RepairRequestCreateDto dto,
                                                 @RequestHeader(name = "Authorization", required = false) String authorization) {
        User actor = getUserFromToken(authorization);
        if (actor != null && (actor.getRole() == UserRole.OPERATOR_MANAGER || actor.getRole() == UserRole.SITE_MANAGER)) {
            Tower tower = towerRepository.findById(dto.getTowerId()).orElse(null);
            if (tower != null && (tower.getOwnerOperator() == null || actor.getOperator() == null ||
                    !tower.getOwnerOperator().getId().equals(actor.getOperator().getId()))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You can only create repair requests for towers belonging to your operator company.");
            }
        }
        return ResponseEntity.ok(maintenanceService.createRepairRequest(dto));
    }

    @GetMapping("/repair-requests/site-manager/{siteManagerId}")
    public ResponseEntity<List<RepairRequest>> getRepairRequestsForSiteManager(@PathVariable Long siteManagerId) {
        return ResponseEntity.ok(maintenanceService.getRepairRequestsForSiteManager(siteManagerId));
    }

    @PostMapping("/repair-requests/{id}/consume-parts")
    public ResponseEntity<?> consumeParts(@PathVariable Long id, 
                                          @RequestBody ConsumePartsDto dto,
                                          @RequestHeader(name = "Authorization", required = false) String authorization) {
        User actor = getUserFromToken(authorization);
        if (actor != null && (actor.getRole() == UserRole.OPERATOR_MANAGER || actor.getRole() == UserRole.SITE_MANAGER)) {
            RepairRequest req = maintenanceService.getRepairRequestById(id);
            if (req.getTower() == null || req.getTower().getOwnerOperator() == null || actor.getOperator() == null ||
                    !req.getTower().getOwnerOperator().getId().equals(actor.getOperator().getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You can only consume parts for towers belonging to your operator company.");
            }
        }
        return ResponseEntity.ok(maintenanceService.consumeInventoryParts(id, dto));
    }

    @PutMapping("/repair-requests/{id}/restore-tower")
    public ResponseEntity<?> restoreTower(@PathVariable Long id, 
                                          @RequestBody RestoreTowerDto dto,
                                          @RequestHeader(name = "Authorization", required = false) String authorization) {
        User actor = getUserFromToken(authorization);
        if (actor != null && (actor.getRole() == UserRole.OPERATOR_MANAGER || actor.getRole() == UserRole.SITE_MANAGER)) {
            RepairRequest req = maintenanceService.getRepairRequestById(id);
            if (req.getTower() == null || req.getTower().getOwnerOperator() == null || actor.getOperator() == null ||
                    !req.getTower().getOwnerOperator().getId().equals(actor.getOperator().getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You can only restore towers belonging to your operator company.");
            }
        }
        return ResponseEntity.ok(maintenanceService.restoreTowerService(id, dto));
    }

    private User getUserFromToken(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            return null;
        }
        String token = authorizationHeader.startsWith("Bearer ")
                ? authorizationHeader.substring(7)
                : authorizationHeader;
        String username = jwtUtil.extractUsername(token);
        if (username == null || username.isBlank()) {
            return null;
        }
        return userRepository.findByUsername(username).orElse(null);
    }
}

