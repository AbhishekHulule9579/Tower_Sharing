package com.towerSharing.backend.service;

import com.towerSharing.backend.dto.ConsumePartsDto;
import com.towerSharing.backend.dto.RepairRequestCreateDto;
import com.towerSharing.backend.dto.RestoreTowerDto;
import com.towerSharing.backend.model.*;
import com.towerSharing.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class MaintenanceService {

    private final InventoryItemRepository inventoryRepository;
    private final RepairRequestRepository repairRequestRepository;
    private final RepairInventoryUsageRepository usageRepository;
    private final TowerRepository towerRepository;
    private final UserRepository userRepository;
    private final DisasterIncidentRepository incidentRepository;

    @Autowired
    public MaintenanceService(InventoryItemRepository inventoryRepository, 
                              RepairRequestRepository repairRequestRepository, 
                              RepairInventoryUsageRepository usageRepository, 
                              TowerRepository towerRepository, 
                              UserRepository userRepository, 
                              DisasterIncidentRepository incidentRepository) {
        this.inventoryRepository = inventoryRepository;
        this.repairRequestRepository = repairRequestRepository;
        this.usageRepository = usageRepository;
        this.towerRepository = towerRepository;
        this.userRepository = userRepository;
        this.incidentRepository = incidentRepository;
    }

    public List<InventoryItem> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public InventoryItem createInventoryItem(InventoryItem item) {
        return inventoryRepository.save(item);
    }

    public List<RepairRequest> getAllRepairRequests() {
        return repairRequestRepository.findAll();
    }

    public List<RepairRequest> getRepairRequestsForSiteManager(Long siteManagerId) {
        return repairRequestRepository.findByAssignedSiteManagerId(siteManagerId);
    }

    public RepairRequest getRepairRequestById(Long id) {
        return repairRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Repair Request not found with id: " + id));
    }

    @Transactional
    public RepairRequest createRepairRequest(RepairRequestCreateDto dto) {
        Tower tower = towerRepository.findById(dto.getTowerId())
                .orElseThrow(() -> new RuntimeException("Tower not found with id: " + dto.getTowerId()));

        DisasterIncident incident = null;
        if (dto.getIncidentId() != null) {
            incident = incidentRepository.findById(dto.getIncidentId()).orElse(null);
        }

        User siteManager = null;
        if (dto.getAssignedSiteManagerId() != null) {
            siteManager = userRepository.findById(dto.getAssignedSiteManagerId())
                    .orElseThrow(() -> new RuntimeException("Site Manager user not found with id: " + dto.getAssignedSiteManagerId()));
        }

        // Set tower status to UNDER_MAINTENANCE if it's currently active
        if (tower.getStatus() == TowerStatus.ACTIVE) {
            tower.setStatus(TowerStatus.UNDER_MAINTENANCE);
            towerRepository.save(tower);
        }

        String ticketCode = "REP-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        RepairRequest request = new RepairRequest(
                ticketCode,
                tower,
                incident,
                dto.getPriority() != null ? dto.getPriority() : RepairPriority.HIGH,
                RepairStatus.PENDING,
                dto.getDescription(),
                siteManager,
                LocalDate.now(),
                null,
                "Assigned to site manager for on-site inspection & repair"
        );

        return repairRequestRepository.save(request);
    }

    @Transactional
    public RepairInventoryUsage consumeInventoryParts(Long repairRequestId, ConsumePartsDto dto) {
        RepairRequest repairRequest = getRepairRequestById(repairRequestId);
        InventoryItem item = inventoryRepository.findById(dto.getInventoryItemId())
                .orElseThrow(() -> new RuntimeException("Inventory Item not found with id: " + dto.getInventoryItemId()));

        if (item.getQuantity() < dto.getQuantityUsed()) {
            throw new RuntimeException("Insufficient stock available for " + item.getItemName() 
                    + ". In Stock: " + item.getQuantity() + ", Required: " + dto.getQuantityUsed());
        }

        // Deduct inventory stock
        item.setQuantity(item.getQuantity() - dto.getQuantityUsed());
        inventoryRepository.save(item);

        // Update repair request status to IN_PROGRESS if pending
        if (repairRequest.getStatus() == RepairStatus.PENDING) {
            repairRequest.setStatus(RepairStatus.IN_PROGRESS);
            repairRequestRepository.save(repairRequest);
        }

        RepairInventoryUsage usage = new RepairInventoryUsage(repairRequest, item, dto.getQuantityUsed());
        return usageRepository.save(usage);
    }

    @Transactional
    public RepairRequest restoreTowerService(Long repairRequestId, RestoreTowerDto dto) {
        RepairRequest repairRequest = getRepairRequestById(repairRequestId);
        Tower tower = repairRequest.getTower();

        // Mark repair request COMPLETED
        repairRequest.setStatus(RepairStatus.COMPLETED);
        repairRequest.setResolvedDate(LocalDate.now());
        if (dto.getMaintenanceNotes() != null) {
            repairRequest.setMaintenanceNotes(dto.getMaintenanceNotes());
        }
        repairRequestRepository.save(repairRequest);

        // Restore Tower status to ACTIVE!
        tower.setStatus(TowerStatus.ACTIVE);
        towerRepository.save(tower);

        return repairRequest;
    }
}
