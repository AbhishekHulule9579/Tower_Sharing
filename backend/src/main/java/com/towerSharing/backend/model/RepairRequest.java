package com.towerSharing.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "repair_requests")
public class RepairRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String requestTicketCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tower_id", nullable = false)
    private Tower tower;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "incident_id")
    private DisasterIncident incident;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RepairPriority priority = RepairPriority.HIGH;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RepairStatus status = RepairStatus.PENDING;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_site_manager_id")
    private User assignedSiteManager;

    private LocalDate createdDate;
    private LocalDate resolvedDate;

    @Column(length = 1000)
    private String maintenanceNotes;

    public RepairRequest() {}

    public RepairRequest(String requestTicketCode, Tower tower, DisasterIncident incident, 
                         RepairPriority priority, RepairStatus status, String description, 
                         User assignedSiteManager, LocalDate createdDate, LocalDate resolvedDate, 
                         String maintenanceNotes) {
        this.requestTicketCode = requestTicketCode;
        this.tower = tower;
        this.incident = incident;
        this.priority = priority;
        this.status = status;
        this.description = description;
        this.assignedSiteManager = assignedSiteManager;
        this.createdDate = createdDate;
        this.resolvedDate = resolvedDate;
        this.maintenanceNotes = maintenanceNotes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRequestTicketCode() {
        return requestTicketCode;
    }

    public void setRequestTicketCode(String requestTicketCode) {
        this.requestTicketCode = requestTicketCode;
    }

    public Tower getTower() {
        return tower;
    }

    public void setTower(Tower tower) {
        this.tower = tower;
    }

    public DisasterIncident getIncident() {
        return incident;
    }

    public void setIncident(DisasterIncident incident) {
        this.incident = incident;
    }

    public RepairPriority getPriority() {
        return priority;
    }

    public void setPriority(RepairPriority priority) {
        this.priority = priority;
    }

    public RepairStatus getStatus() {
        return status;
    }

    public void setStatus(RepairStatus status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getAssignedSiteManager() {
        return assignedSiteManager;
    }

    public void setAssignedSiteManager(User assignedSiteManager) {
        this.assignedSiteManager = assignedSiteManager;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDate getResolvedDate() {
        return resolvedDate;
    }

    public void setResolvedDate(LocalDate resolvedDate) {
        this.resolvedDate = resolvedDate;
    }

    public String getMaintenanceNotes() {
        return maintenanceNotes;
    }

    public void setMaintenanceNotes(String maintenanceNotes) {
        this.maintenanceNotes = maintenanceNotes;
    }
}
