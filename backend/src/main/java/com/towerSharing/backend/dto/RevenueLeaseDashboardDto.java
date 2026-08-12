package com.towerSharing.backend.dto;

import com.towerSharing.backend.model.TowerLease;
import com.towerSharing.backend.model.TowerTransaction;

import java.util.List;

public class RevenueLeaseDashboardDto {
    private double totalMonthlyLeaseRevenue;
    private double totalTransactionVolume;
    private double totalDisasterSharingPayouts;
    private long activeLeasesCount;
    private long completedTransactionsCount;
    private List<TowerLease> leases;
    private List<TowerTransaction> transactions;

    public RevenueLeaseDashboardDto() {}

    public RevenueLeaseDashboardDto(double totalMonthlyLeaseRevenue, double totalTransactionVolume, 
                                   double totalDisasterSharingPayouts, long activeLeasesCount, 
                                   long completedTransactionsCount, List<TowerLease> leases, 
                                   List<TowerTransaction> transactions) {
        this.totalMonthlyLeaseRevenue = totalMonthlyLeaseRevenue;
        this.totalTransactionVolume = totalTransactionVolume;
        this.totalDisasterSharingPayouts = totalDisasterSharingPayouts;
        this.activeLeasesCount = activeLeasesCount;
        this.completedTransactionsCount = completedTransactionsCount;
        this.leases = leases;
        this.transactions = transactions;
    }

    public double getTotalMonthlyLeaseRevenue() {
        return totalMonthlyLeaseRevenue;
    }

    public void setTotalMonthlyLeaseRevenue(double totalMonthlyLeaseRevenue) {
        this.totalMonthlyLeaseRevenue = totalMonthlyLeaseRevenue;
    }

    public double getTotalTransactionVolume() {
        return totalTransactionVolume;
    }

    public void setTotalTransactionVolume(double totalTransactionVolume) {
        this.totalTransactionVolume = totalTransactionVolume;
    }

    public double getTotalDisasterSharingPayouts() {
        return totalDisasterSharingPayouts;
    }

    public void setTotalDisasterSharingPayouts(double totalDisasterSharingPayouts) {
        this.totalDisasterSharingPayouts = totalDisasterSharingPayouts;
    }

    public long getActiveLeasesCount() {
        return activeLeasesCount;
    }

    public void setActiveLeasesCount(long activeLeasesCount) {
        this.activeLeasesCount = activeLeasesCount;
    }

    public long getCompletedTransactionsCount() {
        return completedTransactionsCount;
    }

    public void setCompletedTransactionsCount(long completedTransactionsCount) {
        this.completedTransactionsCount = completedTransactionsCount;
    }

    public List<TowerLease> getLeases() {
        return leases;
    }

    public void setLeases(List<TowerLease> leases) {
        this.leases = leases;
    }

    public List<TowerTransaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<TowerTransaction> transactions) {
        this.transactions = transactions;
    }
}
