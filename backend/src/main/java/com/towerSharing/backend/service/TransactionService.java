package com.towerSharing.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.towerSharing.backend.dto.BuyTowerDto;
import com.towerSharing.backend.model.Operator;
import com.towerSharing.backend.model.SharingStatus;
import com.towerSharing.backend.model.Tower;
import com.towerSharing.backend.model.TowerTransaction;
import com.towerSharing.backend.model.TransactionStatus;
import com.towerSharing.backend.repository.OperatorRepository;
import com.towerSharing.backend.repository.TowerRepository;
import com.towerSharing.backend.repository.TowerTransactionRepository;

@Service
public class TransactionService {

    private final TowerTransactionRepository transactionRepository;
    private final TowerRepository towerRepository;
    private final OperatorRepository operatorRepository;

    @Autowired
    public TransactionService(TowerTransactionRepository transactionRepository, 
                               TowerRepository towerRepository, 
                               OperatorRepository operatorRepository) {
        this.transactionRepository = transactionRepository;
        this.towerRepository = towerRepository;
        this.operatorRepository = operatorRepository;
    }

    public List<TowerTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public List<TowerTransaction> getPendingApprovals(Long operatorId) {

        return transactionRepository
                .findBySellerOperatorIdAndStatus(
                        operatorId,
                        TransactionStatus.PROPOSED
                );
    }
    @Transactional
    public TowerTransaction buyTower(BuyTowerDto dto) {
        Tower tower = towerRepository.findById(dto.getTowerId())
                .orElseThrow(() -> new RuntimeException("Tower not found with id: " + dto.getTowerId()));

        if (tower.getSharingStatus() != SharingStatus.AVAILABLE_FOR_SALE) {
            throw new RuntimeException("Tower is not marked as AVAILABLE_FOR_SALE.");
        }

        Operator buyer = operatorRepository.findById(dto.getBuyerOperatorId())
                .orElseThrow(() -> new RuntimeException("Buyer operator not found with id: " + dto.getBuyerOperatorId()));

        Operator seller = tower.getOwnerOperator();

        if (seller.getId().equals(buyer.getId())) {
            throw new RuntimeException("Buyer and Seller cannot be the same operator.");
        }

        Double agreedPrice = dto.getAgreedPrice() != null ? dto.getAgreedPrice() : tower.getSalePrice();

        TowerTransaction tx = new TowerTransaction(
            tower,
            seller,
            buyer,
            agreedPrice,
            LocalDate.now(),
            TransactionStatus.PROPOSED,
            dto.getNotes() != null ? dto.getNotes() : "Awaiting seller approval."
    );
    
    return transactionRepository.save(tx);
    }
    @Transactional
    public TowerTransaction approveTransaction(Long id) {
        TowerTransaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (tx.getStatus() != TransactionStatus.PROPOSED) {
            throw new RuntimeException("Transaction has already been processed (" + tx.getStatus() + ").");
        }

        Tower tower = tx.getTower();
        tower.setOwnerOperator(tx.getBuyerOperator());
        tower.setSharingStatus(SharingStatus.NOT_AVAILABLE);
        towerRepository.save(tower);

        tx.setStatus(TransactionStatus.COMPLETED);
        String sellerName = tx.getSellerOperator() != null ? tx.getSellerOperator().getName() : "Seller";
        String buyerName = tx.getBuyerOperator() != null ? tx.getBuyerOperator().getName() : "Buyer";
        tx.setNotes("Approved by " + sellerName + " Operations Manager. Tower asset ownership transferred to " + buyerName + ".");

        return transactionRepository.save(tx);
    }

    @Transactional
    public TowerTransaction rejectTransaction(Long id) {
        TowerTransaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (tx.getStatus() != TransactionStatus.PROPOSED) {
            throw new RuntimeException("Transaction has already been processed (" + tx.getStatus() + ").");
        }

        tx.setStatus(TransactionStatus.CANCELLED);
        String sellerName = tx.getSellerOperator() != null ? tx.getSellerOperator().getName() : "Seller";
        tx.setNotes("Purchase request rejected by " + sellerName + " Operations Manager.");

        return transactionRepository.save(tx);
    }
}
