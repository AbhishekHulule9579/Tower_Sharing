package com.towerSharing.backend.repository;

import com.towerSharing.backend.model.TowerTransaction;
import com.towerSharing.backend.model.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TowerTransactionRepository extends JpaRepository<TowerTransaction, Long> {
    List<TowerTransaction> findBySellerOperatorId(Long sellerId);
    List<TowerTransaction> findByBuyerOperatorId(Long buyerId);
    List<TowerTransaction> findByStatus(TransactionStatus status);
}
