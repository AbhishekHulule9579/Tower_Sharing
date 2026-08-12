package com.towerSharing.backend.controller;

import com.towerSharing.backend.dto.EmergencySharingRequestDto;
import com.towerSharing.backend.dto.IncidentRequestDto;
import com.towerSharing.backend.model.DisasterIncident;
import com.towerSharing.backend.model.EmergencySharing;
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

    @Autowired
    public DisasterController(DisasterService disasterService) {
        this.disasterService = disasterService;
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
    public ResponseEntity<EmergencySharing> createEmergencySharing(@RequestBody EmergencySharingRequestDto dto) {
        return ResponseEntity.ok(disasterService.createEmergencySharing(dto));
    }
}
