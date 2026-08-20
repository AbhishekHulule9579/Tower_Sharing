package com.towerSharing.backend.service;

import com.towerSharing.backend.model.RepairInventoryUsage;
import com.towerSharing.backend.model.RepairRequest;
import com.towerSharing.backend.model.SharingStatus;
import com.towerSharing.backend.model.Tower;
import com.towerSharing.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TowerService {

    private final TowerRepository towerRepository;
    private final EmergencySharingRepository emergencySharingRepository;
    private final RepairRequestRepository repairRequestRepository;
    private final RepairInventoryUsageRepository usageRepository;
    private final TowerLeaseRepository leaseRepository;
    private final TowerTransactionRepository transactionRepository;

    @Autowired
    public TowerService(TowerRepository towerRepository,
                        EmergencySharingRepository emergencySharingRepository,
                        RepairRequestRepository repairRequestRepository,
                        RepairInventoryUsageRepository usageRepository,
                        TowerLeaseRepository leaseRepository,
                        TowerTransactionRepository transactionRepository) {
        this.towerRepository = towerRepository;
        this.emergencySharingRepository = emergencySharingRepository;
        this.repairRequestRepository = repairRequestRepository;
        this.usageRepository = usageRepository;
        this.leaseRepository = leaseRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<Tower> getAllTowers() {
        return towerRepository.findAll();
    }

    public Tower getTowerById(Long id) {
        return towerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tower not found with id: " + id));
    }

    public Tower createTower(Tower tower) {
        if (tower.getCurrentOccupancy() == null) {
            tower.setCurrentOccupancy(0);
        }
        return towerRepository.save(tower);
    }

    public Tower updateTower(Long id, Tower towerDetails) {
        Tower existingTower = getTowerById(id);
        existingTower.setName(towerDetails.getName());
        existingTower.setLocation(towerDetails.getLocation());
        existingTower.setCity(towerDetails.getCity());
        existingTower.setState(towerDetails.getState());
        existingTower.setLatitude(towerDetails.getLatitude());
        existingTower.setLongitude(towerDetails.getLongitude());
        existingTower.setTotalCapacity(towerDetails.getTotalCapacity());
        existingTower.setCurrentOccupancy(towerDetails.getCurrentOccupancy());
        existingTower.setStatus(towerDetails.getStatus());
        existingTower.setSharingStatus(towerDetails.getSharingStatus());
        existingTower.setMonthlyLeaseRate(towerDetails.getMonthlyLeaseRate());
        existingTower.setSalePrice(towerDetails.getSalePrice());
        return towerRepository.save(existingTower);
    }

    @Transactional
    public void deleteTower(Long id) {
        // 1. Clean up emergency sharings where tower is damaged or host
        var sharings = emergencySharingRepository.findByDamagedTowerIdOrHostTowerId(id, id);
        if (!sharings.isEmpty()) {
            emergencySharingRepository.deleteAll(sharings);
        }

        // 2. Clean up repair requests and associated inventory usages
        List<RepairRequest> repairs = repairRequestRepository.findByTowerId(id);
        for (RepairRequest rep : repairs) {
            List<RepairInventoryUsage> usages = usageRepository.findByRepairRequestId(rep.getId());
            if (!usages.isEmpty()) {
                usageRepository.deleteAll(usages);
            }
            repairRequestRepository.delete(rep);
        }

        // 3. Clean up leases
        var leases = leaseRepository.findByTowerId(id);
        if (!leases.isEmpty()) {
            leaseRepository.deleteAll(leases);
        }

        // 4. Clean up transactions
        var transactions = transactionRepository.findByTowerId(id);
        if (!transactions.isEmpty()) {
            transactionRepository.deleteAll(transactions);
        }

        // 5. Delete the tower
        towerRepository.deleteById(id);
    }

    public List<Tower> getTowersByOperator(Long operatorId) {
        return towerRepository.findByOwnerOperatorId(operatorId);
    }

    public List<Tower> getAvailableForLease() {
        return towerRepository.findBySharingStatus(SharingStatus.AVAILABLE_FOR_LEASE);
    }

    public List<Tower> getAvailableForSale() {
        return towerRepository.findBySharingStatus(SharingStatus.AVAILABLE_FOR_SALE);
    }
}

