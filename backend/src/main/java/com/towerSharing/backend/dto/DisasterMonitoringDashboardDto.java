package com.towerSharing.backend.dto;

import com.towerSharing.backend.model.DisasterIncident;
import com.towerSharing.backend.model.EmergencySharing;
import com.towerSharing.backend.model.Tower;

import java.util.List;

public class DisasterMonitoringDashboardDto {
    private long openIncidentsCount;
    private long totalAffectedTowersCount;
    private long activeEmergencySharingsCount;
    private List<DisasterIncident> activeIncidents;
    private List<Tower> affectedTowers;
    private List<EmergencySharing> emergencySharings;

    public DisasterMonitoringDashboardDto() {}

    public DisasterMonitoringDashboardDto(long openIncidentsCount, long totalAffectedTowersCount, 
                                          long activeEmergencySharingsCount, List<DisasterIncident> activeIncidents, 
                                          List<Tower> affectedTowers, List<EmergencySharing> emergencySharings) {
        this.openIncidentsCount = openIncidentsCount;
        this.totalAffectedTowersCount = totalAffectedTowersCount;
        this.activeEmergencySharingsCount = activeEmergencySharingsCount;
        this.activeIncidents = activeIncidents;
        this.affectedTowers = affectedTowers;
        this.emergencySharings = emergencySharings;
    }

    public long getOpenIncidentsCount() {
        return openIncidentsCount;
    }

    public void setOpenIncidentsCount(long openIncidentsCount) {
        this.openIncidentsCount = openIncidentsCount;
    }

    public long getTotalAffectedTowersCount() {
        return totalAffectedTowersCount;
    }

    public void setTotalAffectedTowersCount(long totalAffectedTowersCount) {
        this.totalAffectedTowersCount = totalAffectedTowersCount;
    }

    public long getActiveEmergencySharingsCount() {
        return activeEmergencySharingsCount;
    }

    public void setActiveEmergencySharingsCount(long activeEmergencySharingsCount) {
        this.activeEmergencySharingsCount = activeEmergencySharingsCount;
    }

    public List<DisasterIncident> getActiveIncidents() {
        return activeIncidents;
    }

    public void setActiveIncidents(List<DisasterIncident> activeIncidents) {
        this.activeIncidents = activeIncidents;
    }

    public List<Tower> getAffectedTowers() {
        return affectedTowers;
    }

    public void setAffectedTowers(List<Tower> affectedTowers) {
        this.affectedTowers = affectedTowers;
    }

    public List<EmergencySharing> getEmergencySharings() {
        return emergencySharings;
    }

    public void setEmergencySharings(List<EmergencySharing> emergencySharings) {
        this.emergencySharings = emergencySharings;
    }
}
