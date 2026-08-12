package com.towerSharing.backend.dto;

public class ConsumePartsDto {
    private Long inventoryItemId;
    private Integer quantityUsed;

    public ConsumePartsDto() {}

    public ConsumePartsDto(Long inventoryItemId, Integer quantityUsed) {
        this.inventoryItemId = inventoryItemId;
        this.quantityUsed = quantityUsed;
    }

    public Long getInventoryItemId() {
        return inventoryItemId;
    }

    public void setInventoryItemId(Long inventoryItemId) {
        this.inventoryItemId = inventoryItemId;
    }

    public Integer getQuantityUsed() {
        return quantityUsed;
    }

    public void setQuantityUsed(Integer quantityUsed) {
        this.quantityUsed = quantityUsed;
    }
}
