package com.towerSharing.backend.dto;

public record DashboardSummaryDto(
        long totalTowers,
        long activeIncidents,
        long pendingLeaseRequests,
        long pendingRegistrationRequests,
        long lowInventoryAlerts,
        long availableForLease,
        long availableForSale,
        long openRepairs,
        long completedTransactions) {}
