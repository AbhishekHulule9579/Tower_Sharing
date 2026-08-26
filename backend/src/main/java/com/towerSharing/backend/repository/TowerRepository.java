package com.towerSharing.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.towerSharing.backend.model.SharingStatus;
import com.towerSharing.backend.model.Tower;
import com.towerSharing.backend.model.TowerStatus;

@Repository
public interface TowerRepository extends JpaRepository<Tower, Long> {
    Optional<Tower> findByTowerCode(String towerCode);
    List<Tower> findByOwnerOperatorId(Long operatorId);
    long countByOwnerOperatorId(Long operatorId);
    List<Tower> findByStatus(TowerStatus status);
    List<Tower> findBySharingStatus(SharingStatus sharingStatus);
    long countBySharingStatus(SharingStatus sharingStatus);
    List<Tower> findByCity(String city);
    List<Tower> findByState(String state);
    List<Tower> findBySharingStatusAndState(
        SharingStatus sharingStatus,
        String state
);
    List<Tower> findBySharingStatusAndOwnerOperatorIdNot(
    SharingStatus sharingStatus,
    Long operatorId
);
}
