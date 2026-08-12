package com.towerSharing.backend.dto;

public class RestoreTowerDto {
    private String maintenanceNotes;

    public RestoreTowerDto() {}

    public RestoreTowerDto(String maintenanceNotes) {
        this.maintenanceNotes = maintenanceNotes;
    }

    public String getMaintenanceNotes() {
        return maintenanceNotes;
    }

    public void setMaintenanceNotes(String maintenanceNotes) {
        this.maintenanceNotes = maintenanceNotes;
    }
}
