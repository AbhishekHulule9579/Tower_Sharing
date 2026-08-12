package com.towerSharing.backend.repository;

import com.towerSharing.backend.model.RepairInventoryUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepairInventoryUsageRepository extends JpaRepository<RepairInventoryUsage, Long> {
    List<RepairInventoryUsage> findByRepairRequestId(Long repairRequestId);
}
