package com.towerSharing.backend.controller;

import com.towerSharing.backend.config.JwtUtil;
import com.towerSharing.backend.dto.LeaseApprovalDto;
import com.towerSharing.backend.dto.LeaseRequestDto;
import com.towerSharing.backend.model.TowerLease;
import com.towerSharing.backend.model.User;
import com.towerSharing.backend.model.UserRole;
import com.towerSharing.backend.repository.UserRepository;
import com.towerSharing.backend.service.LeaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leases")
@CrossOrigin(origins = "*")
public class LeaseController {

    private final LeaseService leaseService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public LeaseController(LeaseService leaseService,
                           UserRepository userRepository,
                           JwtUtil jwtUtil) {
        this.leaseService = leaseService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
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
    public ResponseEntity<?> requestLease(@RequestBody LeaseRequestDto dto,
                                          @RequestHeader(name = "Authorization", required = false) String authorization) {
        User actor = getUserFromToken(authorization);
        if (actor != null && (actor.getRole() == UserRole.OPERATOR_MANAGER || actor.getRole() == UserRole.SITE_MANAGER)) {
            if (actor.getOperator() != null) {
                dto.setLesseeOperatorId(actor.getOperator().getId());
            }
        }
        return ResponseEntity.ok(leaseService.requestLease(dto));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveOrRejectLease(@PathVariable Long id, 
                                                  @RequestBody LeaseApprovalDto dto,
                                                  @RequestHeader(name = "Authorization", required = false) String authorization) {
        User actor = getUserFromToken(authorization);
        if (actor != null) {
            TowerLease lease = leaseService.getLeaseById(id);
            if (actor.getRole() == UserRole.OPERATOR_MANAGER || actor.getRole() == UserRole.SITE_MANAGER) {
                if (lease.getTower() == null || lease.getTower().getOwnerOperator() == null ||
                        actor.getOperator() == null ||
                        !lease.getTower().getOwnerOperator().getId().equals(actor.getOperator().getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Only the tower's owner operator manager or site manager can approve or reject this lease request.");
                }
            }
        }
        return ResponseEntity.ok(leaseService.approveOrRejectLease(id, dto));
    }

    @PutMapping("/{id}/terminate")
    public ResponseEntity<TowerLease> terminateLease(@PathVariable Long id) {
        return ResponseEntity.ok(leaseService.terminateLease(id));
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

