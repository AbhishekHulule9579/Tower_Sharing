package com.towerSharing.backend.service;

import com.towerSharing.backend.dto.EmergencySharingRequestDto;
import com.towerSharing.backend.dto.IncidentRequestDto;
import com.towerSharing.backend.model.*;
import com.towerSharing.backend.repository.DisasterIncidentRepository;
import com.towerSharing.backend.repository.EmergencySharingRepository;
import com.towerSharing.backend.repository.OperatorRepository;
import com.towerSharing.backend.repository.TowerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class DisasterService {

    private final DisasterIncidentRepository incidentRepository;
    private final EmergencySharingRepository emergencySharingRepository;
    private final TowerRepository towerRepository;
    private final OperatorRepository operatorRepository;

    @Autowired
    public DisasterService(DisasterIncidentRepository incidentRepository, 
                           EmergencySharingRepository emergencySharingRepository, 
                           TowerRepository towerRepository, 
                           OperatorRepository operatorRepository) {
        this.incidentRepository = incidentRepository;
        this.emergencySharingRepository = emergencySharingRepository;
        this.towerRepository = towerRepository;
        this.operatorRepository = operatorRepository;
    }

    public List<DisasterIncident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public List<EmergencySharing> getAllEmergencySharings() {
        return emergencySharingRepository.findAll();
    }

    @Transactional
    public DisasterIncident registerIncident(IncidentRequestDto dto) {
        String incidentCode = "INC-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();

        DisasterIncident incident = new DisasterIncident(
                incidentCode,
                dto.getTitle(),
                dto.getDisasterType(),
                dto.getDescription(),
                dto.getRegion(),
                LocalDate.now(),
                IncidentStatus.ACTIVE
        );

        DisasterIncident savedIncident = incidentRepository.save(incident);

        if (dto.getAffectedTowerIds() != null && !dto.getAffectedTowerIds().isEmpty()) {
            List<Tower> affectedTowers = towerRepository.findAllById(dto.getAffectedTowerIds());
            for (Tower tower : affectedTowers) {
                tower.setStatus(TowerStatus.DISASTER_AFFECTED);
                towerRepository.save(tower);
            }
        }

        return savedIncident;
    }

    @Transactional
    public EmergencySharing createEmergencySharing(EmergencySharingRequestDto dto) {
        DisasterIncident incident = incidentRepository.findById(dto.getIncidentId())
                .orElseThrow(() -> new RuntimeException("Disaster Incident not found with id: " + dto.getIncidentId()));

        Tower damagedTower = towerRepository.findById(dto.getDamagedTowerId())
                .orElseThrow(() -> new RuntimeException("Damaged Tower not found with id: " + dto.getDamagedTowerId()));

        Tower hostTower = towerRepository.findById(dto.getHostTowerId())
                .orElseThrow(() -> new RuntimeException("Host Tower not found with id: " + dto.getHostTowerId()));

        if (hostTower.getStatus() != TowerStatus.ACTIVE) {
            throw new RuntimeException("Host Tower is not in ACTIVE state.");
        }

        Operator affectedOp = operatorRepository.findById(dto.getAffectedOperatorId())
                .orElseThrow(() -> new RuntimeException("Affected Operator not found with id: " + dto.getAffectedOperatorId()));

        Operator hostOp = operatorRepository.findById(dto.getHostOperatorId())
                .orElseThrow(() -> new RuntimeException("Host Operator not found with id: " + dto.getHostOperatorId()));

        int days = (dto.getDays() != null && dto.getDays() > 0) ? dto.getDays() : 30;
        double dailyRate = dto.getDailyRate() != null ? dto.getDailyRate() : 2000.0;
        double totalPayment = dailyRate * days;

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(days);

        // Update host tower occupancy temporarily
        hostTower.setCurrentOccupancy(hostTower.getCurrentOccupancy() + dto.getSharedCapacity());
        towerRepository.save(hostTower);

        EmergencySharing sharing = new EmergencySharing(
                incident,
                damagedTower,
                hostTower,
                affectedOp,
                hostOp,
                dto.getSharedCapacity(),
                dailyRate,
                startDate,
                endDate,
                totalPayment,
                EmergencyStatus.ACTIVE
        );

        return emergencySharingRepository.save(sharing);
    }

    @Transactional
    public DisasterIncident resolveIncident(Long incidentId) {
        DisasterIncident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found with id: " + incidentId));

        incident.setStatus(IncidentStatus.RESOLVED);
        return incidentRepository.save(incident);
    }
}
