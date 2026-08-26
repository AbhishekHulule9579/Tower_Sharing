package com.towerSharing.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.towerSharing.backend.config.JwtUtil;
import com.towerSharing.backend.model.Tower;
import com.towerSharing.backend.model.User;
import com.towerSharing.backend.model.UserRole;
import com.towerSharing.backend.repository.UserRepository;
import com.towerSharing.backend.service.TowerService;

@RestController
@RequestMapping("/api/towers")
@CrossOrigin(origins = "*")
public class TowerController {

    private final TowerService towerService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public TowerController(TowerService towerService,
                           UserRepository userRepository,
                           JwtUtil jwtUtil) {
        this.towerService = towerService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<List<Tower>> getAllTowers(@RequestHeader(name = "Authorization", required = false) String authorization) {
        User actor = getUserFromToken(authorization);
        if (actor != null && actor.getRole() == UserRole.ADMIN && actor.getOperator() != null) {
            return ResponseEntity.ok(towerService.getTowersByOperator(actor.getOperator().getId()));
        }
        return ResponseEntity.ok(towerService.getAllTowers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tower> getTowerById(@PathVariable Long id) {
        return ResponseEntity.ok(towerService.getTowerById(id));
    }

    @PostMapping
    public ResponseEntity<?> createTower(@RequestBody Tower tower,
                                         @RequestHeader(name = "Authorization", required = false) String authorization) {
        User actor = getUserFromToken(authorization);
        if (actor != null) {
            if (actor.getRole() == UserRole.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Administrator role is governance read-only for tower creation.");
            }
            if (actor.getRole() == UserRole.OPERATOR_MANAGER || actor.getRole() == UserRole.SITE_MANAGER) {
                if (actor.getOperator() == null) {
                    return ResponseEntity.badRequest().body("User has no associated operator company.");
                }
                tower.setOwnerOperator(actor.getOperator());
            }
        }
        return ResponseEntity.ok(towerService.createTower(tower));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTower(@PathVariable Long id, 
                                         @RequestBody Tower tower,
                                         @RequestHeader(name = "Authorization", required = false) String authorization) {
        User actor = getUserFromToken(authorization);
        if (actor != null) {
            Tower existing = towerService.getTowerById(id);
            if (actor.getRole() == UserRole.OPERATOR_MANAGER || actor.getRole() == UserRole.SITE_MANAGER) {
                if (existing.getOwnerOperator() == null || actor.getOperator() == null ||
                        !existing.getOwnerOperator().getId().equals(actor.getOperator().getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("You are only allowed to modify towers belonging to your operator company.");
                }
                tower.setOwnerOperator(actor.getOperator());
            }
        }
        return ResponseEntity.ok(towerService.updateTower(id, tower));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTower(@PathVariable Long id,
                                         @RequestHeader(name = "Authorization", required = false) String authorization) {
        User actor = getUserFromToken(authorization);
        if (actor != null) {
            Tower existing = towerService.getTowerById(id);
            if (actor.getRole() == UserRole.OPERATOR_MANAGER || actor.getRole() == UserRole.SITE_MANAGER) {
                if (existing.getOwnerOperator() == null || actor.getOperator() == null ||
                        !existing.getOwnerOperator().getId().equals(actor.getOperator().getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("You are only allowed to delete towers belonging to your operator company.");
                }
            }
        }
        towerService.deleteTower(id);
        return ResponseEntity.ok("Tower deleted successfully");
    }

    @GetMapping("/operator/{operatorId}")
    public ResponseEntity<List<Tower>> getTowersByOperator(@PathVariable Long operatorId) {
        return ResponseEntity.ok(towerService.getTowersByOperator(operatorId));
    }


    @GetMapping("/available-sale")
    public ResponseEntity<List<Tower>> getAvailableForSale() {
        return ResponseEntity.ok(towerService.getAvailableForSale());
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

    @GetMapping("/available-lease")
    public ResponseEntity<List<Tower>> getAvailableForLease(
            @RequestHeader(name = "Authorization", required = false)
            String authorization) {
    
        User actor = getUserFromToken(authorization);
    
        if (actor != null && actor.getOperator() != null) {
    
            return ResponseEntity.ok(
                    towerService.getAvailableForLeaseExcludingOperator(
                            actor.getOperator().getId()
                    )
            );
        }
    
        return ResponseEntity.ok(
                towerService.getAvailableForLease()
        );
    }
}
