package com.towerSharing.backend.dto;

import com.towerSharing.backend.model.DisasterType;
import java.util.List;

public class IncidentRequestDto {
    private String title;
    private DisasterType disasterType;
    private String description;
    private String region;
    private List<Long> affectedTowerIds;

    public IncidentRequestDto() {}

    public IncidentRequestDto(String title, DisasterType disasterType, String description, String region, List<Long> affectedTowerIds) {
        this.title = title;
        this.disasterType = disasterType;
        this.description = description;
        this.region = region;
        this.affectedTowerIds = affectedTowerIds;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public DisasterType getDisasterType() {
        return disasterType;
    }

    public void setDisasterType(DisasterType disasterType) {
        this.disasterType = disasterType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public List<Long> getAffectedTowerIds() {
        return affectedTowerIds;
    }

    public void setAffectedTowerIds(List<Long> affectedTowerIds) {
        this.affectedTowerIds = affectedTowerIds;
    }
}
