package com.towerSharing.backend.repository;

import com.towerSharing.backend.model.RepairPriority;
import com.towerSharing.backend.model.RepairRequest;
import com.towerSharing.backend.model.RepairStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepairRequestRepository extends JpaRepository<RepairRequest, Long> {
    Optional<RepairRequest> findByRequestTicketCode(String ticketCode);
    List<RepairRequest> findByTowerId(Long towerId);
    List<RepairRequest> findByAssignedSiteManagerId(Long siteManagerId);
    List<RepairRequest> findByStatus(RepairStatus status);
    List<RepairRequest> findByPriority(RepairPriority priority);
    @Query("select count(r) from RepairRequest r where r.status <> com.towerSharing.backend.model.RepairStatus.COMPLETED")
    long countOpenRequests();
}
