package com.towerSharing.backend.repository;

import com.towerSharing.backend.model.SharingStatus;
import com.towerSharing.backend.model.Tower;
import com.towerSharing.backend.model.TowerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TowerRepository extends JpaRepository<Tower, Long> {
    Optional<Tower> findByTowerCode(String towerCode);
    List<Tower> findByOwnerOperatorId(Long operatorId);
    List<Tower> findByStatus(TowerStatus status);
    List<Tower> findBySharingStatus(SharingStatus sharingStatus);
    List<Tower> findByCity(String city);
}
