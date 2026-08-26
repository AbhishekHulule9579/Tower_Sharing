package com.towerSharing.backend.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.towerSharing.backend.dto.LeaseApprovalDto;
import com.towerSharing.backend.dto.LeaseRequestDto;
import com.towerSharing.backend.model.LeaseStatus;
import com.towerSharing.backend.model.Operator;
import com.towerSharing.backend.model.SharingStatus;
import com.towerSharing.backend.model.Tower;
import com.towerSharing.backend.model.TowerLease;
import com.towerSharing.backend.repository.OperatorRepository;
import com.towerSharing.backend.repository.TowerLeaseRepository;
import com.towerSharing.backend.repository.TowerRepository;

@Service
public class LeaseService {

    private final TowerLeaseRepository leaseRepository;
    private final TowerRepository towerRepository;
    private final OperatorRepository operatorRepository;

    @Autowired
    public LeaseService(TowerLeaseRepository leaseRepository, 
                        TowerRepository towerRepository, 
                        OperatorRepository operatorRepository) {
        this.leaseRepository = leaseRepository;
        this.towerRepository = towerRepository;
        this.operatorRepository = operatorRepository;
    }

    public List<TowerLease> getAllLeases() {
        return leaseRepository.findAll();
    }

    public TowerLease getLeaseById(Long id) {
        return leaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lease not found with id: " + id));
    }
    public List<TowerLease> getLeasesForOperator(Long operatorId) {
        List<TowerLease> leases = new ArrayList<>();
        List<TowerLease> lesseeLeases = leaseRepository.findByLesseeOperatorId(operatorId);
        List<TowerLease> lessorLeases = leaseRepository.findByLessorOperatorId(operatorId);

        java.util.Set<Long> seen = new java.util.HashSet<>();
        if (lesseeLeases != null) {
            for (TowerLease l : lesseeLeases) {
                if (l != null && l.getId() != null && seen.add(l.getId())) {
                    leases.add(l);
                }
            }
        }
        if (lessorLeases != null) {
            for (TowerLease l : lessorLeases) {
                if (l != null && l.getId() != null && seen.add(l.getId())) {
                    leases.add(l);
                }
            }
        }
        return leases;
    }

    @Transactional
    public TowerLease requestLease(LeaseRequestDto dto) {
        Tower tower = towerRepository.findById(dto.getTowerId())
                .orElseThrow(() -> new RuntimeException("Tower not found with id: " + dto.getTowerId()));

        if (tower.getSharingStatus() != SharingStatus.AVAILABLE_FOR_LEASE) {
            throw new RuntimeException("Tower is not available for leasing.");
        }

        if (tower.getAvailableHeadroom() < dto.getSharedCapacity()) {
            throw new RuntimeException("Insufficient tower capacity headroom available. Requested: " 
                    + dto.getSharedCapacity() + ", Available: " + tower.getAvailableHeadroom());
        }

        Operator lessee = operatorRepository.findById(dto.getLesseeOperatorId())
                .orElseThrow(() -> new RuntimeException("Lessee Operator not found with id: " + dto.getLesseeOperatorId()));

        if (tower.getOwnerOperator().getId().equals(lessee.getId())) {
            throw new RuntimeException("Operator cannot lease their own tower.");
        }

        int months = (dto.getMonths() != null && dto.getMonths() > 0) ? dto.getMonths() : 12;
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusMonths(months);

        double rate = tower.getMonthlyLeaseRate() != null ? tower.getMonthlyLeaseRate() : 50000.0;

        TowerLease lease = new TowerLease(
                tower,
                tower.getOwnerOperator(),
                lessee,
                dto.getSharedCapacity(),
                rate,
                startDate,
                endDate,
                LeaseStatus.PENDING_APPROVAL,
                "Awaiting Admin approval"
        );

        return leaseRepository.save(lease);
    }

    @Transactional
    public TowerLease approveOrRejectLease(Long leaseId, LeaseApprovalDto dto) {
        TowerLease lease = getLeaseById(leaseId);

        if (lease.getStatus() != LeaseStatus.PENDING_APPROVAL) {
            throw new RuntimeException("Lease request is not in PENDING_APPROVAL status.");
        }

        if (dto.isApproved()) {
            Tower tower = lease.getTower();
            if (tower.getAvailableHeadroom() < lease.getSharedCapacity()) {
                throw new RuntimeException("Cannot approve: Insufficient capacity headroom on tower.");
            }

            tower.setCurrentOccupancy(tower.getCurrentOccupancy() + lease.getSharedCapacity());
            towerRepository.save(tower);

            lease.setStatus(LeaseStatus.ACTIVE);
            lease.setApprovalNotes(dto.getApprovalNotes() != null ? dto.getApprovalNotes() : "Approved by Admin");
        } else {
            lease.setStatus(LeaseStatus.REJECTED);
            lease.setApprovalNotes(dto.getApprovalNotes() != null ? dto.getApprovalNotes() : "Rejected by Admin");
        }

        return leaseRepository.save(lease);
    }

    @Transactional
    public TowerLease terminateLease(Long leaseId) {
        TowerLease lease = getLeaseById(leaseId);
        if (lease.getStatus() == LeaseStatus.ACTIVE) {
            Tower tower = lease.getTower();
            int newOccupancy = Math.max(0, tower.getCurrentOccupancy() - lease.getSharedCapacity());
            tower.setCurrentOccupancy(newOccupancy);
            towerRepository.save(tower);

            lease.setStatus(LeaseStatus.TERMINATED);
            return leaseRepository.save(lease);
        }
        throw new RuntimeException("Only ACTIVE leases can be terminated.");
    }
}
