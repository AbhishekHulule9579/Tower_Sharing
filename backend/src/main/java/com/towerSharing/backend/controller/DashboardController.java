package com.towerSharing.backend.controller;

import com.towerSharing.backend.config.JwtUtil;
import com.towerSharing.backend.dto.*;
import com.towerSharing.backend.model.User;
import com.towerSharing.backend.repository.UserRepository;
import com.towerSharing.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboards")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public DashboardController(DashboardService dashboardService,
                               UserRepository userRepository,
                               JwtUtil jwtUtil) {
        this.dashboardService = dashboardService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/admin-summary")
    public ResponseEntity<?> getAdminSummary(@RequestHeader(name = "Authorization", required = false) String authorization) {
        User user = getUserFromToken(authorization);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid authorization token.");
        }
        return ResponseEntity.ok(dashboardService.getAdminDashboardSummary(user));
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDto> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/tower-utilization")
    public ResponseEntity<TowerUtilizationDashboardDto> getTowerUtilizationDashboard() {
        return ResponseEntity.ok(dashboardService.getTowerUtilizationDashboard());
    }

    @GetMapping("/disaster-monitoring")
    public ResponseEntity<DisasterMonitoringDashboardDto> getDisasterMonitoringDashboard() {
        return ResponseEntity.ok(dashboardService.getDisasterMonitoringDashboard());
    }

    @GetMapping("/revenue-lease")
    public ResponseEntity<RevenueLeaseDashboardDto> getRevenueLeaseDashboard() {
        return ResponseEntity.ok(dashboardService.getRevenueLeaseDashboard());
    }

    @GetMapping("/maintenance-report")
    public ResponseEntity<MaintenanceReportDashboardDto> getMaintenanceReportDashboard() {
        return ResponseEntity.ok(dashboardService.getMaintenanceReportDashboard());
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

