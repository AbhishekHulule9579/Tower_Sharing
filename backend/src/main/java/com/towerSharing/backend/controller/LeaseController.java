package com.towerSharing.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.towerSharing.backend.config.JwtUtil;
import com.towerSharing.backend.dto.LeaseApprovalDto;
import com.towerSharing.backend.dto.LeaseRequestDto;
import com.towerSharing.backend.model.TowerLease;
import com.towerSharing.backend.model.User;
import com.towerSharing.backend.model.UserRole;
import com.towerSharing.backend.repository.UserRepository;
import com.towerSharing.backend.service.LeaseService;

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
    public ResponseEntity<List<TowerLease>> getLeases(
            @RequestHeader("Authorization") String authorization) {
    
        User actor = getUserFromToken(authorization);
    
        if (actor != null
                && actor.getOperator() != null
                && (actor.getRole() == UserRole.OPERATOR_MANAGER
                    || actor.getRole() == UserRole.ADMIN
                    || actor.getRole() == UserRole.SITE_MANAGER)) {
    
            return ResponseEntity.ok(
                    leaseService.getLeasesForOperator(
                            actor.getOperator().getId()
                    )
            );
        }
    
        return ResponseEntity.ok(
                leaseService.getAllLeases()
        );
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

