package com.towerSharing.backend.dto;

public class BuyTowerDto {
    private Long towerId;
    private Long buyerOperatorId;
    private Double agreedPrice;
    private String notes;

    public BuyTowerDto() {}

    public BuyTowerDto(Long towerId, Long buyerOperatorId, Double agreedPrice, String notes) {
        this.towerId = towerId;
        this.buyerOperatorId = buyerOperatorId;
        this.agreedPrice = agreedPrice;
        this.notes = notes;
    }

    public Long getTowerId() {
        return towerId;
    }

    public void setTowerId(Long towerId) {
        this.towerId = towerId;
    }

    public Long getBuyerOperatorId() {
        return buyerOperatorId;
    }

    public void setBuyerOperatorId(Long buyerOperatorId) {
        this.buyerOperatorId = buyerOperatorId;
    }

    public Double getAgreedPrice() {
        return agreedPrice;
    }

    public void setAgreedPrice(Double agreedPrice) {
        this.agreedPrice = agreedPrice;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
