package com.towerSharing.backend.service;

import com.towerSharing.backend.dto.*;
import com.towerSharing.backend.model.*;
import com.towerSharing.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final TowerRepository towerRepository;
    private final OperatorRepository operatorRepository;
    private final TowerLeaseRepository leaseRepository;
    private final TowerTransactionRepository transactionRepository;
    private final DisasterIncidentRepository incidentRepository;
    private final EmergencySharingRepository emergencySharingRepository;
    private final InventoryItemRepository inventoryRepository;
    private final RepairRequestRepository repairRequestRepository;
    private final RepairInventoryUsageRepository usageRepository;
    private final SiteManagerRequestRepository registrationRequestRepository;

    @Autowired
    public DashboardService(TowerRepository towerRepository, 
                            OperatorRepository operatorRepository, 
                            TowerLeaseRepository leaseRepository, 
                            TowerTransactionRepository transactionRepository, 
                            DisasterIncidentRepository incidentRepository, 
                            EmergencySharingRepository emergencySharingRepository, 
                            InventoryItemRepository inventoryRepository, 
                            RepairRequestRepository repairRequestRepository, 
                            RepairInventoryUsageRepository usageRepository,
                            SiteManagerRequestRepository registrationRequestRepository) {
        this.towerRepository = towerRepository;
        this.operatorRepository = operatorRepository;
        this.leaseRepository = leaseRepository;
        this.transactionRepository = transactionRepository;
        this.incidentRepository = incidentRepository;
        this.emergencySharingRepository = emergencySharingRepository;
        this.inventoryRepository = inventoryRepository;
        this.repairRequestRepository = repairRequestRepository;
        this.usageRepository = usageRepository;
        this.registrationRequestRepository = registrationRequestRepository;
    }

    public DashboardSummaryDto getSummary() {
        return new DashboardSummaryDto(
                towerRepository.count(),
                incidentRepository.countByStatus(IncidentStatus.ACTIVE),
                leaseRepository.countByStatus(LeaseStatus.PENDING_APPROVAL),
                registrationRequestRepository.countByStatus(SiteManagerRequestStatus.PENDING),
                inventoryRepository.countLowStockItems(),
                towerRepository.countBySharingStatus(SharingStatus.AVAILABLE_FOR_LEASE),
                towerRepository.countBySharingStatus(SharingStatus.AVAILABLE_FOR_SALE),
                repairRequestRepository.countOpenRequests(),
                transactionRepository.countByStatus(TransactionStatus.COMPLETED));
    }

    public TowerUtilizationDashboardDto getTowerUtilizationDashboard() {
        List<Tower> towers = towerRepository.findAll();
        long totalTowers = towers.size();
        long activeTowers = towers.stream().filter(t -> t.getStatus() == TowerStatus.ACTIVE).count();
        long disasterTowers = towers.stream().filter(t -> t.getStatus() == TowerStatus.DISASTER_AFFECTED || t.getStatus() == TowerStatus.INACTIVE_DAMAGED).count();
        long maintenanceTowers = towers.stream().filter(t -> t.getStatus() == TowerStatus.UNDER_MAINTENANCE).count();

        int totalCap = towers.stream().mapToInt(t -> t.getTotalCapacity() != null ? t.getTotalCapacity() : 0).sum();
        int totalOcc = towers.stream().mapToInt(t -> t.getCurrentOccupancy() != null ? t.getCurrentOccupancy() : 0).sum();
        double overallRate = totalCap > 0 ? ((double) totalOcc / totalCap) * 100.0 : 0.0;
        int headroom = totalCap - totalOcc;

        Map<String, Double> operatorMap = new HashMap<>();
        List<Operator> operators = operatorRepository.findAll();
        for (Operator op : operators) {
            List<Tower> opTowers = towerRepository.findByOwnerOperatorId(op.getId());
            int opCap = opTowers.stream().mapToInt(t -> t.getTotalCapacity() != null ? t.getTotalCapacity() : 0).sum();
            int opOcc = opTowers.stream().mapToInt(t -> t.getCurrentOccupancy() != null ? t.getCurrentOccupancy() : 0).sum();
            double opRate = opCap > 0 ? ((double) opOcc / opCap) * 100.0 : 0.0;
            operatorMap.put(op.getName(), Math.round(opRate * 100.0) / 100.0);
        }

        return new TowerUtilizationDashboardDto(
                totalTowers, activeTowers, disasterTowers, maintenanceTowers,
                Math.round(overallRate * 100.0) / 100.0, headroom, towers, operatorMap
        );
    }

    public DisasterMonitoringDashboardDto getDisasterMonitoringDashboard() {
        List<DisasterIncident> incidents = incidentRepository.findByStatus(IncidentStatus.ACTIVE);
        List<Tower> affectedTowers = towerRepository.findByStatus(TowerStatus.DISASTER_AFFECTED);
        List<EmergencySharing> emergencySharings = emergencySharingRepository.findByStatus(EmergencyStatus.ACTIVE);

        return new DisasterMonitoringDashboardDto(
                incidents.size(),
                affectedTowers.size(),
                emergencySharings.size(),
                incidents,
                affectedTowers,
                emergencySharings
        );
    }

    public RevenueLeaseDashboardDto getRevenueLeaseDashboard() {
        List<TowerLease> activeLeases = leaseRepository.findByStatus(LeaseStatus.ACTIVE);
        double leaseRev = activeLeases.stream().mapToDouble(l -> l.getMonthlyRate() != null ? l.getMonthlyRate() : 0.0).sum();

        List<TowerTransaction> txs = transactionRepository.findByStatus(TransactionStatus.COMPLETED);
        double txVol = txs.stream().mapToDouble(t -> t.getAgreedPrice() != null ? t.getAgreedPrice() : 0.0).sum();

        List<EmergencySharing> emerg = emergencySharingRepository.findAll();
        double emergPayouts = emerg.stream().mapToDouble(e -> e.getTotalPayment() != null ? e.getTotalPayment() : 0.0).sum();

        return new RevenueLeaseDashboardDto(
                leaseRev,
                txVol,
                emergPayouts,
                activeLeases.size(),
                txs.size(),
                leaseRepository.findAll(),
                txs
        );
    }

    public MaintenanceReportDashboardDto getMaintenanceReportDashboard() {
        List<RepairRequest> allRequests = repairRequestRepository.findAll();
        long openRepairs = allRequests.stream().filter(r -> r.getStatus() != RepairStatus.COMPLETED).count();
        long completedRepairs = allRequests.stream().filter(r -> r.getStatus() == RepairStatus.COMPLETED).count();

        List<InventoryItem> items = inventoryRepository.findAll();
        long lowStock = items.stream().filter(i -> i.getQuantity() != null && i.getMinThreshold() != null && i.getQuantity() <= i.getMinThreshold()).count();

        List<RepairInventoryUsage> usages = usageRepository.findAll();

        return new MaintenanceReportDashboardDto(
                openRepairs,
                completedRepairs,
                lowStock,
                allRequests,
                items,
                usages
        );
    }
}
