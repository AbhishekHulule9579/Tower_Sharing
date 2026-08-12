package com.towerSharing.backend.dto;

import com.towerSharing.backend.model.InventoryItem;
import com.towerSharing.backend.model.RepairInventoryUsage;
import com.towerSharing.backend.model.RepairRequest;

import java.util.List;

public class MaintenanceReportDashboardDto {
    private long openRepairsCount;
    private long completedRepairsCount;
    private long lowStockInventoryCount;
    private List<RepairRequest> repairRequests;
    private List<InventoryItem> inventoryItems;
    private List<RepairInventoryUsage> inventoryUsages;

    public MaintenanceReportDashboardDto() {}

    public MaintenanceReportDashboardDto(long openRepairsCount, long completedRepairsCount, 
                                         long lowStockInventoryCount, List<RepairRequest> repairRequests, 
                                         List<InventoryItem> inventoryItems, 
                                         List<RepairInventoryUsage> inventoryUsages) {
        this.openRepairsCount = openRepairsCount;
        this.completedRepairsCount = completedRepairsCount;
        this.lowStockInventoryCount = lowStockInventoryCount;
        this.repairRequests = repairRequests;
        this.inventoryItems = inventoryItems;
        this.inventoryUsages = inventoryUsages;
    }

    public long getOpenRepairsCount() {
        return openRepairsCount;
    }

    public void setOpenRepairsCount(long openRepairsCount) {
        this.openRepairsCount = openRepairsCount;
    }

    public long getCompletedRepairsCount() {
        return completedRepairsCount;
    }

    public void setCompletedRepairsCount(long completedRepairsCount) {
        this.completedRepairsCount = completedRepairsCount;
    }

    public long getLowStockInventoryCount() {
        return lowStockInventoryCount;
    }

    public void setLowStockInventoryCount(long lowStockInventoryCount) {
        this.lowStockInventoryCount = lowStockInventoryCount;
    }

    public List<RepairRequest> getRepairRequests() {
        return repairRequests;
    }

    public void setRepairRequests(List<RepairRequest> repairRequests) {
        this.repairRequests = repairRequests;
    }

    public List<InventoryItem> getInventoryItems() {
        return inventoryItems;
    }

    public void setInventoryItems(List<InventoryItem> inventoryItems) {
        this.inventoryItems = inventoryItems;
    }

    public List<RepairInventoryUsage> getInventoryUsages() {
        return inventoryUsages;
    }

    public void setInventoryUsages(List<RepairInventoryUsage> inventoryUsages) {
        this.inventoryUsages = inventoryUsages;
    }
}
