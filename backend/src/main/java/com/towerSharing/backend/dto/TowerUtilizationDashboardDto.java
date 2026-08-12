package com.towerSharing.backend.dto;

import com.towerSharing.backend.model.Tower;
import java.util.List;
import java.util.Map;

public class TowerUtilizationDashboardDto {
    private long totalTowers;
    private long activeTowers;
    private long disasterAffectedTowers;
    private long underMaintenanceTowers;
    private double overallOccupancyRate;
    private int totalCapacityHeadroom;
    private List<Tower> towers;
    private Map<String, Double> operatorUtilizationMap;

    public TowerUtilizationDashboardDto() {}

    public TowerUtilizationDashboardDto(long totalTowers, long activeTowers, long disasterAffectedTowers, 
                                         long underMaintenanceTowers, double overallOccupancyRate, 
                                         int totalCapacityHeadroom, List<Tower> towers, 
                                         Map<String, Double> operatorUtilizationMap) {
        this.totalTowers = totalTowers;
        this.activeTowers = activeTowers;
        this.disasterAffectedTowers = disasterAffectedTowers;
        this.underMaintenanceTowers = underMaintenanceTowers;
        this.overallOccupancyRate = overallOccupancyRate;
        this.totalCapacityHeadroom = totalCapacityHeadroom;
        this.towers = towers;
        this.operatorUtilizationMap = operatorUtilizationMap;
    }

    public long getTotalTowers() {
        return totalTowers;
    }

    public void setTotalTowers(long totalTowers) {
        this.totalTowers = totalTowers;
    }

    public long getActiveTowers() {
        return activeTowers;
    }

    public void setActiveTowers(long activeTowers) {
        this.activeTowers = activeTowers;
    }

    public long getDisasterAffectedTowers() {
        return disasterAffectedTowers;
    }

    public void setDisasterAffectedTowers(long disasterAffectedTowers) {
        this.disasterAffectedTowers = disasterAffectedTowers;
    }

    public long getUnderMaintenanceTowers() {
        return underMaintenanceTowers;
    }

    public void setUnderMaintenanceTowers(long underMaintenanceTowers) {
        this.underMaintenanceTowers = underMaintenanceTowers;
    }

    public double getOverallOccupancyRate() {
        return overallOccupancyRate;
    }

    public void setOverallOccupancyRate(double overallOccupancyRate) {
        this.overallOccupancyRate = overallOccupancyRate;
    }

    public int getTotalCapacityHeadroom() {
        return totalCapacityHeadroom;
    }

    public void setTotalCapacityHeadroom(int totalCapacityHeadroom) {
        this.totalCapacityHeadroom = totalCapacityHeadroom;
    }

    public List<Tower> getTowers() {
        return towers;
    }

    public void setTowers(List<Tower> towers) {
        this.towers = towers;
    }

    public Map<String, Double> getOperatorUtilizationMap() {
        return operatorUtilizationMap;
    }

    public void setOperatorUtilizationMap(Map<String, Double> operatorUtilizationMap) {
        this.operatorUtilizationMap = operatorUtilizationMap;
    }
}
