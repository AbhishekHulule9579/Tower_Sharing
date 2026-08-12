package com.towerSharing.backend.repository;

import com.towerSharing.backend.model.LeaseStatus;
import com.towerSharing.backend.model.TowerLease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TowerLeaseRepository extends JpaRepository<TowerLease, Long> {
    List<TowerLease> findByLessorOperatorId(Long operatorId);
    List<TowerLease> findByLesseeOperatorId(Long operatorId);
    List<TowerLease> findByStatus(LeaseStatus status);
    List<TowerLease> findByTowerId(Long towerId);
}
