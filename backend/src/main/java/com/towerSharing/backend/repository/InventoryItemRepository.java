package com.towerSharing.backend.repository;

import com.towerSharing.backend.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    Optional<InventoryItem> findByItemCode(String itemCode);
    @Query("select count(i) from InventoryItem i where i.quantity <= i.minThreshold")
    long countLowStockItems();
}
