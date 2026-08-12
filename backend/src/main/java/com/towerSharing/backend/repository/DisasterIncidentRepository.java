package com.towerSharing.backend.repository;

import com.towerSharing.backend.model.DisasterIncident;
import com.towerSharing.backend.model.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DisasterIncidentRepository extends JpaRepository<DisasterIncident, Long> {
    Optional<DisasterIncident> findByIncidentCode(String incidentCode);
    List<DisasterIncident> findByStatus(IncidentStatus status);
}
