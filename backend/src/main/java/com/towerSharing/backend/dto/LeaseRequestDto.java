package com.towerSharing.backend.dto;

public class LeaseRequestDto {
    private Long towerId;
    private Long lesseeOperatorId;
    private Integer sharedCapacity;
    private Integer months;

    public LeaseRequestDto() {}

    public LeaseRequestDto(Long towerId, Long lesseeOperatorId, Integer sharedCapacity, Integer months) {
        this.towerId = towerId;
        this.lesseeOperatorId = lesseeOperatorId;
        this.sharedCapacity = sharedCapacity;
        this.months = months;
    }

    public Long getTowerId() {
        return towerId;
    }

    public void setTowerId(Long towerId) {
        this.towerId = towerId;
    }

    public Long getLesseeOperatorId() {
        return lesseeOperatorId;
    }

    public void setLesseeOperatorId(Long lesseeOperatorId) {
        this.lesseeOperatorId = lesseeOperatorId;
    }

    public Integer getSharedCapacity() {
        return sharedCapacity;
    }

    public void setSharedCapacity(Integer sharedCapacity) {
        this.sharedCapacity = sharedCapacity;
    }

    public Integer getMonths() {
        return months;
    }

    public void setMonths(Integer months) {
        this.months = months;
    }
}
