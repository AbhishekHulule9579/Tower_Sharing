package com.towerSharing.backend.dto;

public class EmergencySharingRequestDto {
    private Long incidentId;
    private Long damagedTowerId;
    private Long hostTowerId;
    private Long affectedOperatorId;
    private Long hostOperatorId;
    private Integer sharedCapacity;
    private Double dailyRate;
    private Integer days;

    public EmergencySharingRequestDto() {}

    public EmergencySharingRequestDto(Long incidentId, Long damagedTowerId, Long hostTowerId, 
                                      Long affectedOperatorId, Long hostOperatorId, Integer sharedCapacity, 
                                      Double dailyRate, Integer days) {
        this.incidentId = incidentId;
        this.damagedTowerId = damagedTowerId;
        this.hostTowerId = hostTowerId;
        this.affectedOperatorId = affectedOperatorId;
        this.hostOperatorId = hostOperatorId;
        this.sharedCapacity = sharedCapacity;
        this.dailyRate = dailyRate;
        this.days = days;
    }

    public Long getIncidentId() {
        return incidentId;
    }

    public void setIncidentId(Long incidentId) {
        this.incidentId = incidentId;
    }

    public Long getDamagedTowerId() {
        return damagedTowerId;
    }

    public void setDamagedTowerId(Long damagedTowerId) {
        this.damagedTowerId = damagedTowerId;
    }

    public Long getHostTowerId() {
        return hostTowerId;
    }

    public void setHostTowerId(Long hostTowerId) {
        this.hostTowerId = hostTowerId;
    }

    public Long getAffectedOperatorId() {
        return affectedOperatorId;
    }

    public void setAffectedOperatorId(Long affectedOperatorId) {
        this.affectedOperatorId = affectedOperatorId;
    }

    public Long getHostOperatorId() {
        return hostOperatorId;
    }

    public void setHostOperatorId(Long hostOperatorId) {
        this.hostOperatorId = hostOperatorId;
    }

    public Integer getSharedCapacity() {
        return sharedCapacity;
    }

    public void setSharedCapacity(Integer sharedCapacity) {
        this.sharedCapacity = sharedCapacity;
    }

    public Double getDailyRate() {
        return dailyRate;
    }

    public void setDailyRate(Double dailyRate) {
        this.dailyRate = dailyRate;
    }

    public Integer getDays() {
        return days;
    }

    public void setDays(Integer days) {
        this.days = days;
    }
}
