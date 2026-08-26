package com.towerSharing.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.towerSharing.backend.dto.AdminDashboardDto;
import com.towerSharing.backend.dto.DashboardSummaryDto;
import com.towerSharing.backend.dto.DisasterMonitoringDashboardDto;
import com.towerSharing.backend.dto.MaintenanceReportDashboardDto;
import com.towerSharing.backend.dto.RevenueLeaseDashboardDto;
import com.towerSharing.backend.dto.TowerUtilizationDashboardDto;
import com.towerSharing.backend.model.DisasterIncident;
import com.towerSharing.backend.model.EmergencySharing;
import com.towerSharing.backend.model.EmergencyStatus;
import com.towerSharing.backend.model.IncidentStatus;
import com.towerSharing.backend.model.InventoryItem;
import com.towerSharing.backend.model.LeaseStatus;
import com.towerSharing.backend.model.Operator;
import com.towerSharing.backend.model.RepairInventoryUsage;
import com.towerSharing.backend.model.RepairRequest;
import com.towerSharing.backend.model.RepairStatus;
import com.towerSharing.backend.model.SharingStatus;
import com.towerSharing.backend.model.SiteManagerRequest;
import com.towerSharing.backend.model.SiteManagerRequestStatus;
import com.towerSharing.backend.model.Tower;
import com.towerSharing.backend.model.TowerLease;
import com.towerSharing.backend.model.TowerStatus;
import com.towerSharing.backend.model.TowerTransaction;
import com.towerSharing.backend.model.TransactionStatus;
import com.towerSharing.backend.model.User;
import com.towerSharing.backend.model.UserRole;
import com.towerSharing.backend.repository.DisasterIncidentRepository;
import com.towerSharing.backend.repository.EmergencySharingRepository;
import com.towerSharing.backend.repository.InventoryItemRepository;
import com.towerSharing.backend.repository.OperatorRepository;
import com.towerSharing.backend.repository.RepairInventoryUsageRepository;
import com.towerSharing.backend.repository.RepairRequestRepository;
import com.towerSharing.backend.repository.SiteManagerRequestRepository;
import com.towerSharing.backend.repository.TowerLeaseRepository;
import com.towerSharing.backend.repository.TowerRepository;
import com.towerSharing.backend.repository.TowerTransactionRepository;
import com.towerSharing.backend.repository.UserRepository;

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
    private final UserRepository userRepository;

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
                            SiteManagerRequestRepository registrationRequestRepository,
                            UserRepository userRepository) {
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
        this.userRepository = userRepository;
    }

    public AdminDashboardDto getAdminDashboardSummary(User adminUser) {
        Operator operator = adminUser != null ? adminUser.getOperator() : null;
        if (operator == null) {
            return new AdminDashboardDto("General Admin", "GEN", null, 0, 0, 0, 0, 0, 0, List.of());
        }
        Long opId = operator.getId();
        List<Tower> towers = towerRepository.findByOwnerOperatorId(opId);
        long companyTowers = towers.size();
        long activeTowers = towers.stream().filter(t -> t.getStatus() == TowerStatus.ACTIVE).count();
        long maintenanceTowers = towers.stream().filter(t -> t.getStatus() == TowerStatus.UNDER_MAINTENANCE).count();
        long inactiveTowers = towers.stream().filter(t -> t.getStatus() == TowerStatus.DISASTER_AFFECTED || t.getStatus() == TowerStatus.INACTIVE_DAMAGED).count();

        long operatorManagers = userRepository.countByOperatorAndRole(operator, UserRole.OPERATOR_MANAGER);
        long pendingRequests =
        registrationRequestRepository
            .findByOperatorAndRequestedRoleAndStatus(
                operator,
                UserRole.OPERATOR_MANAGER,
                SiteManagerRequestStatus.PENDING
            )
            .size();

List<SiteManagerRequest> recentRequests =
    registrationRequestRepository
        .findByOperatorAndRequestedRoleAndStatus(
            operator,
            UserRole.OPERATOR_MANAGER,
            SiteManagerRequestStatus.PENDING
        );
        return new AdminDashboardDto(
                operator.getName(),
                operator.getCode(),
                operator.getId(),
                companyTowers,
                operatorManagers,
                pendingRequests,
                activeTowers,
                maintenanceTowers,
                inactiveTowers,
                recentRequests
        );
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
