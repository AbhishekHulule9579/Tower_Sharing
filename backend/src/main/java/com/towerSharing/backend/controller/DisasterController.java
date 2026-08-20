package com.towerSharing.backend.controller;

import com.towerSharing.backend.config.JwtUtil;
import com.towerSharing.backend.dto.EmergencySharingRequestDto;
import com.towerSharing.backend.dto.IncidentRequestDto;
import com.towerSharing.backend.model.DisasterIncident;
import com.towerSharing.backend.model.EmergencySharing;
import com.towerSharing.backend.model.User;
import com.towerSharing.backend.model.UserRole;
import com.towerSharing.backend.repository.UserRepository;
import com.towerSharing.backend.service.DisasterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disasters")
@CrossOrigin(origins = "*")
public class DisasterController {

    private final DisasterService disasterService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public DisasterController(DisasterService disasterService,
                              UserRepository userRepository,
                              JwtUtil jwtUtil) {
        this.disasterService = disasterService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/incidents")
    public ResponseEntity<List<DisasterIncident>> getAllIncidents() {
        return ResponseEntity.ok(disasterService.getAllIncidents());
    }

    @PostMapping("/incidents")
    public ResponseEntity<DisasterIncident> registerIncident(@RequestBody IncidentRequestDto dto) {
        return ResponseEntity.ok(disasterService.registerIncident(dto));
    }

    @PutMapping("/incidents/{id}/resolve")
    public ResponseEntity<DisasterIncident> resolveIncident(@PathVariable Long id) {
        return ResponseEntity.ok(disasterService.resolveIncident(id));
    }

    @GetMapping("/emergency-sharing")
    public ResponseEntity<List<EmergencySharing>> getAllEmergencySharings() {
        return ResponseEntity.ok(disasterService.getAllEmergencySharings());
    }

    @PostMapping("/emergency-sharing")
    public ResponseEntity<?> createEmergencySharing(@RequestBody EmergencySharingRequestDto dto,
                                                    @RequestHeader(name = "Authorization", required = false) String authorization) {
        User actor = getUserFromToken(authorization);
        if (actor != null && (actor.getRole() == UserRole.OPERATOR_MANAGER || actor.getRole() == UserRole.SITE_MANAGER)) {
            if (actor.getOperator() != null) {
                dto.setAffectedOperatorId(actor.getOperator().getId());
            }
        }
        return ResponseEntity.ok(disasterService.createEmergencySharing(dto));
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

