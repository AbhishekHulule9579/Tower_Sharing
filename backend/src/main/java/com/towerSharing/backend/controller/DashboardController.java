package com.towerSharing.backend.controller;

import com.towerSharing.backend.dto.*;
import com.towerSharing.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboards")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
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
}
