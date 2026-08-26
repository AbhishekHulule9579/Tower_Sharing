package com.towerSharing.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.towerSharing.backend.model.TowerTransaction;
import com.towerSharing.backend.model.TransactionStatus;

@Repository
public interface TowerTransactionRepository extends JpaRepository<TowerTransaction, Long> {
    List<TowerTransaction> findBySellerOperatorId(Long sellerId);
    List<TowerTransaction> findByBuyerOperatorId(Long buyerId);
    List<TowerTransaction> findByStatus(TransactionStatus status);
    long countByStatus(TransactionStatus status);
    List<TowerTransaction> findByTowerId(Long towerId);
    List<TowerTransaction> findBySellerOperatorIdAndStatus(
        Long sellerId,
        TransactionStatus status
);
}

