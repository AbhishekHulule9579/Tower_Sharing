package com.towerSharing.backend.repository;

import com.towerSharing.backend.model.EmergencySharing;
import com.towerSharing.backend.model.EmergencyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencySharingRepository extends JpaRepository<EmergencySharing, Long> {
    List<EmergencySharing> findByIncidentId(Long incidentId);
    List<EmergencySharing> findByAffectedOperatorId(Long operatorId);
    List<EmergencySharing> findByHostOperatorId(Long operatorId);
    List<EmergencySharing> findByStatus(EmergencyStatus status);
}
