package com.towerSharing.backend.service;

import com.towerSharing.backend.model.SharingStatus;
import com.towerSharing.backend.model.Tower;
import com.towerSharing.backend.model.TowerStatus;
import com.towerSharing.backend.repository.TowerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TowerService {

    private final TowerRepository towerRepository;

    @Autowired
    public TowerService(TowerRepository towerRepository) {
        this.towerRepository = towerRepository;
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

    public void deleteTower(Long id) {
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
