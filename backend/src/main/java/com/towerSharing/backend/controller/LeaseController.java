package com.towerSharing.backend.controller;

import com.towerSharing.backend.dto.LeaseApprovalDto;
import com.towerSharing.backend.dto.LeaseRequestDto;
import com.towerSharing.backend.model.TowerLease;
import com.towerSharing.backend.service.LeaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leases")
@CrossOrigin(origins = "*")
public class LeaseController {

    private final LeaseService leaseService;

    @Autowired
    public LeaseController(LeaseService leaseService) {
        this.leaseService = leaseService;
    }

    @GetMapping
    public ResponseEntity<List<TowerLease>> getAllLeases() {
        return ResponseEntity.ok(leaseService.getAllLeases());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TowerLease> getLeaseById(@PathVariable Long id) {
        return ResponseEntity.ok(leaseService.getLeaseById(id));
    }

    @PostMapping("/request")
    public ResponseEntity<TowerLease> requestLease(@RequestBody LeaseRequestDto dto) {
        return ResponseEntity.ok(leaseService.requestLease(dto));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<TowerLease> approveOrRejectLease(@PathVariable Long id, @RequestBody LeaseApprovalDto dto) {
        return ResponseEntity.ok(leaseService.approveOrRejectLease(id, dto));
    }

    @PutMapping("/{id}/terminate")
    public ResponseEntity<TowerLease> terminateLease(@PathVariable Long id) {
        return ResponseEntity.ok(leaseService.terminateLease(id));
    }
}
