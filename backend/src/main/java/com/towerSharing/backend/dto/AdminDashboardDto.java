package com.towerSharing.backend.dto;

import com.towerSharing.backend.model.SiteManagerRequest;
import java.util.List;

public class AdminDashboardDto {
    private String operatorName;
    private String operatorCode;
    private Long operatorId;
    private long companyTowers;
    private long operatorManagers;
    private long pendingRequests;
    private long activeTowers;
    private long maintenanceTowers;
    private long inactiveTowers;
    private List<SiteManagerRequest> recentRequests;

    public AdminDashboardDto() {}

    public AdminDashboardDto(String operatorName, String operatorCode, Long operatorId,
                             long companyTowers, long operatorManagers, long pendingRequests,
                             long activeTowers, long maintenanceTowers, long inactiveTowers,
                             List<SiteManagerRequest> recentRequests) {
        this.operatorName = operatorName;
        this.operatorCode = operatorCode;
        this.operatorId = operatorId;
        this.companyTowers = companyTowers;
        this.operatorManagers = operatorManagers;
        this.pendingRequests = pendingRequests;
        this.activeTowers = activeTowers;
        this.maintenanceTowers = maintenanceTowers;
        this.inactiveTowers = inactiveTowers;
        this.recentRequests = recentRequests;
    }

    public String getOperatorName() {
        return operatorName;
    }

    public void setOperatorName(String operatorName) {
        this.operatorName = operatorName;
    }

    public String getOperatorCode() {
        return operatorCode;
    }

    public void setOperatorCode(String operatorCode) {
        this.operatorCode = operatorCode;
    }

    public Long getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(Long operatorId) {
        this.operatorId = operatorId;
    }

    public long getCompanyTowers() {
        return companyTowers;
    }

    public void setCompanyTowers(long companyTowers) {
        this.companyTowers = companyTowers;
    }

    public long getOperatorManagers() {
        return operatorManagers;
    }

    public void setOperatorManagers(long operatorManagers) {
        this.operatorManagers = operatorManagers;
    }

    public long getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(long pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public long getActiveTowers() {
        return activeTowers;
    }

    public void setActiveTowers(long activeTowers) {
        this.activeTowers = activeTowers;
    }

    public long getMaintenanceTowers() {
        return maintenanceTowers;
    }

    public void setMaintenanceTowers(long maintenanceTowers) {
        this.maintenanceTowers = maintenanceTowers;
    }

    public long getInactiveTowers() {
        return inactiveTowers;
    }

    public void setInactiveTowers(long inactiveTowers) {
        this.inactiveTowers = inactiveTowers;
    }

    public List<SiteManagerRequest> getRecentRequests() {
        return recentRequests;
    }

    public void setRecentRequests(List<SiteManagerRequest> recentRequests) {
        this.recentRequests = recentRequests;
    }
}
