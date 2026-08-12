package com.towerSharing.backend.dto;

import com.towerSharing.backend.model.RepairPriority;

public class RepairRequestCreateDto {
    private Long towerId;
    private Long incidentId;
    private RepairPriority priority;
    private String description;
    private Long assignedSiteManagerId;

    public RepairRequestCreateDto() {}

    public RepairRequestCreateDto(Long towerId, Long incidentId, RepairPriority priority, String description, Long assignedSiteManagerId) {
        this.towerId = towerId;
        this.incidentId = incidentId;
        this.priority = priority;
        this.description = description;
        this.assignedSiteManagerId = assignedSiteManagerId;
    }

    public Long getTowerId() {
        return towerId;
    }

    public void setTowerId(Long towerId) {
        this.towerId = towerId;
    }

    public Long getIncidentId() {
        return incidentId;
    }

    public void setIncidentId(Long incidentId) {
        this.incidentId = incidentId;
    }

    public RepairPriority getPriority() {
        return priority;
    }

    public void setPriority(RepairPriority priority) {
        this.priority = priority;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getAssignedSiteManagerId() {
        return assignedSiteManagerId;
    }

    public void setAssignedSiteManagerId(Long assignedSiteManagerId) {
        this.assignedSiteManagerId = assignedSiteManagerId;
    }
}
