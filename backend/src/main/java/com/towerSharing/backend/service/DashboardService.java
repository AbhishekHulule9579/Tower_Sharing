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
            List<Tower> towers = towerRepository.findAll();
            long companyTowers = towers.size();
            long activeTowers = towers.stream().filter(t -> t.getStatus() == TowerStatus.ACTIVE).count();
            long maintenanceTowers = towers.stream().filter(t -> t.getStatus() == TowerStatus.UNDER_MAINTENANCE).count();
            long inactiveTowers = towers.stream().filter(t -> t.getStatus() == TowerStatus.DISASTER_AFFECTED || t.getStatus() == TowerStatus.INACTIVE_DAMAGED).count();

            long operatorManagers = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == UserRole.OPERATOR_MANAGER || u.getRole() == UserRole.SITE_MANAGER)
                    .count();
            List<SiteManagerRequest> pendingRequestsList = registrationRequestRepository.findByStatus(SiteManagerRequestStatus.PENDING);

            return new AdminDashboardDto(
                    "Platform Telecom",
                    "ADMIN",
                    null,
                    companyTowers,
                    operatorManagers,
                    pendingRequestsList.size(),
                    activeTowers,
                    maintenanceTowers,
                    inactiveTowers,
                    pendingRequestsList
            );
        }
        Long opId = operator.getId();
        List<Tower> towers = towerRepository.findByOwnerOperatorId(opId);
        long companyTowers = towers.size();
        long activeTowers = towers.stream().filter(t -> t.getStatus() == TowerStatus.ACTIVE).count();
        long maintenanceTowers = towers.stream().filter(t -> t.getStatus() == TowerStatus.UNDER_MAINTENANCE).count();
        long inactiveTowers = towers.stream().filter(t -> t.getStatus() == TowerStatus.DISASTER_AFFECTED || t.getStatus() == TowerStatus.INACTIVE_DAMAGED).count();

        long operatorManagers = userRepository.countByOperatorAndRole(operator, UserRole.OPERATOR_MANAGER);
        List<SiteManagerRequest> recentRequests = registrationRequestRepository
                .findByOperatorAndRequestedRoleAndStatus(
                        operator,
                        UserRole.OPERATOR_MANAGER,
                        SiteManagerRequestStatus.PENDING
                );
        long pendingRequests = recentRequests.size();

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
        return getSummary(null);
    }

    public DashboardSummaryDto getSummary(User user) {
        if (user == null || user.getRole() == UserRole.ADMIN) {
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

        Operator operator = user.getOperator();
        Long opId = operator != null ? operator.getId() : null;
        String userState = user.getState() != null ? user.getState().trim().toLowerCase() : "";

        List<Tower> allTowers = towerRepository.findAll();
        List<Tower> myTowers = allTowers.stream().filter(t -> {
            boolean matchesOp = opId != null && t.getOwnerOperator() != null && t.getOwnerOperator().getId().equals(opId);
            boolean matchesState = userState.isEmpty() || (t.getState() != null && t.getState().trim().toLowerCase().equals(userState));
            return matchesOp && matchesState;
        }).toList();

        long totalTowers = myTowers.size();
        long availableForLease = myTowers.stream().filter(t -> t.getSharingStatus() == SharingStatus.AVAILABLE_FOR_LEASE).count();
        long availableForSale = myTowers.stream().filter(t -> t.getSharingStatus() == SharingStatus.AVAILABLE_FOR_SALE).count();

        List<DisasterIncident> allIncidents = incidentRepository.findByStatus(IncidentStatus.ACTIVE);
        long activeIncidents = allIncidents.stream().filter(inc -> {
            if (userState.isEmpty()) return true;
            String reg = inc.getRegion() != null ? inc.getRegion().trim().toLowerCase() : "";
            return reg.contains(userState) || userState.contains(reg);
        }).count();

        List<TowerLease> allLeases = leaseRepository.findAll();
        long pendingLeaseRequests = allLeases.stream().filter(l -> {
            if (l.getStatus() != LeaseStatus.PENDING_APPROVAL) return false;
            boolean matchesOp = opId != null && (
                (l.getLessorOperator() != null && l.getLessorOperator().getId().equals(opId)) ||
                (l.getLesseeOperator() != null && l.getLesseeOperator().getId().equals(opId)) ||
                (l.getTower() != null && l.getTower().getOwnerOperator() != null && l.getTower().getOwnerOperator().getId().equals(opId))
            );
            boolean matchesState = userState.isEmpty() || (l.getTower() != null && l.getTower().getState() != null && l.getTower().getState().trim().toLowerCase().equals(userState));
            return matchesOp && matchesState;
        }).count();

        long pendingRegistrationRequests = 0;
        if (operator != null && !userState.isEmpty()) {
            pendingRegistrationRequests = registrationRequestRepository
                .findByOperatorAndRequestedRoleAndStatusAndStateIgnoreCase(operator, UserRole.SITE_MANAGER, SiteManagerRequestStatus.PENDING, user.getState())
                .size();
        } else if (operator != null) {
            pendingRegistrationRequests = registrationRequestRepository
                .findByOperatorAndRequestedRoleAndStatus(operator, UserRole.SITE_MANAGER, SiteManagerRequestStatus.PENDING)
                .size();
        }

        List<TowerTransaction> allTransactions = transactionRepository.findAll();
        long completedTransactions = allTransactions.stream().filter(tx -> {
            if (tx.getStatus() != TransactionStatus.COMPLETED) return false;
            boolean matchesOp = opId != null && (
                (tx.getSellerOperator() != null && tx.getSellerOperator().getId().equals(opId)) ||
                (tx.getBuyerOperator() != null && tx.getBuyerOperator().getId().equals(opId)) ||
                (tx.getTower() != null && tx.getTower().getOwnerOperator() != null && tx.getTower().getOwnerOperator().getId().equals(opId))
            );
            boolean matchesState = userState.isEmpty() || (tx.getTower() != null && tx.getTower().getState() != null && tx.getTower().getState().trim().toLowerCase().equals(userState));
            return matchesOp && matchesState;
        }).count();

        long lowInventoryAlerts = inventoryRepository.countLowStockItems();
        long openRepairs = repairRequestRepository.countOpenRequests();

        return new DashboardSummaryDto(
                totalTowers,
                activeIncidents,
                pendingLeaseRequests,
                pendingRegistrationRequests,
                lowInventoryAlerts,
                availableForLease,
                availableForSale,
                openRepairs,
                completedTransactions
        );
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
        return getDisasterMonitoringDashboard(null);
    }

    public DisasterMonitoringDashboardDto getDisasterMonitoringDashboard(User user) {
        if (user == null || user.getRole() == UserRole.ADMIN) {
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

        Operator operator = user.getOperator();
        Long opId = operator != null ? operator.getId() : null;
        String userState = user.getState() != null ? user.getState().trim().toLowerCase() : "";

        List<DisasterIncident> incidents = incidentRepository.findByStatus(IncidentStatus.ACTIVE).stream()
            .filter(inc -> {
                if (userState.isEmpty()) return true;
                String reg = inc.getRegion() != null ? inc.getRegion().trim().toLowerCase() : "";
                return reg.contains(userState) || userState.contains(reg);
            }).toList();

        List<Tower> affectedTowers = towerRepository.findByStatus(TowerStatus.DISASTER_AFFECTED).stream()
            .filter(t -> {
                boolean matchesOp = opId != null && t.getOwnerOperator() != null && t.getOwnerOperator().getId().equals(opId);
                boolean matchesState = userState.isEmpty() || (t.getState() != null && t.getState().trim().toLowerCase().equals(userState));
                return matchesOp && matchesState;
            }).toList();

        List<EmergencySharing> emergencySharings = emergencySharingRepository.findByStatus(EmergencyStatus.ACTIVE).stream()
            .filter(s -> {
                boolean matchesOp = opId != null && (
                    (s.getAffectedOperator() != null && s.getAffectedOperator().getId().equals(opId)) ||
                    (s.getHostOperator() != null && s.getHostOperator().getId().equals(opId))
                );
                String tState = s.getDamagedTower() != null && s.getDamagedTower().getState() != null
                    ? s.getDamagedTower().getState().trim().toLowerCase()
                    : (s.getHostTower() != null && s.getHostTower().getState() != null ? s.getHostTower().getState().trim().toLowerCase() : "");
                boolean matchesState = userState.isEmpty() || tState.equals(userState);
                return matchesOp && matchesState;
            }).toList();

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
        return getRevenueLeaseDashboard(null);
    }

    public RevenueLeaseDashboardDto getRevenueLeaseDashboard(User user) {
        if (user == null || user.getRole() == UserRole.ADMIN) {
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

        Operator operator = user.getOperator();
        Long opId = operator != null ? operator.getId() : null;
        String userState = user.getState() != null ? user.getState().trim().toLowerCase() : "";

        List<TowerLease> activeLeases = leaseRepository.findByStatus(LeaseStatus.ACTIVE).stream()
            .filter(l -> {
                boolean matchesOp = opId != null && (
                    (l.getLessorOperator() != null && l.getLessorOperator().getId().equals(opId)) ||
                    (l.getLesseeOperator() != null && l.getLesseeOperator().getId().equals(opId))
                );
                boolean matchesState = userState.isEmpty() || (l.getTower() != null && l.getTower().getState() != null && l.getTower().getState().trim().toLowerCase().equals(userState));
                return matchesOp && matchesState;
            }).toList();

        double leaseRev = activeLeases.stream()
            .filter(l -> l.getLessorOperator() != null && l.getLessorOperator().getId().equals(opId))
            .mapToDouble(l -> l.getMonthlyRate() != null ? l.getMonthlyRate() : 0.0)
            .sum();

        List<TowerTransaction> txs = transactionRepository.findByStatus(TransactionStatus.COMPLETED).stream()
            .filter(t -> {
                boolean matchesOp = opId != null && (
                    (t.getSellerOperator() != null && t.getSellerOperator().getId().equals(opId)) ||
                    (t.getBuyerOperator() != null && t.getBuyerOperator().getId().equals(opId))
                );
                boolean matchesState = userState.isEmpty() || (t.getTower() != null && t.getTower().getState() != null && t.getTower().getState().trim().toLowerCase().equals(userState));
                return matchesOp && matchesState;
            }).toList();

        double txVol = txs.stream().mapToDouble(t -> t.getAgreedPrice() != null ? t.getAgreedPrice() : 0.0).sum();

        List<EmergencySharing> emerg = emergencySharingRepository.findAll().stream()
            .filter(s -> {
                boolean matchesOp = opId != null && (
                    (s.getAffectedOperator() != null && s.getAffectedOperator().getId().equals(opId)) ||
                    (s.getHostOperator() != null && s.getHostOperator().getId().equals(opId))
                );
                return matchesOp;
            }).toList();

        double emergPayouts = emerg.stream().mapToDouble(e -> e.getTotalPayment() != null ? e.getTotalPayment() : 0.0).sum();

        return new RevenueLeaseDashboardDto(
                leaseRev,
                txVol,
                emergPayouts,
                activeLeases.size(),
                txs.size(),
                activeLeases,
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
