package com.towerSharing.backend.service;

import com.towerSharing.backend.dto.BuyTowerDto;
import com.towerSharing.backend.model.*;
import com.towerSharing.backend.repository.OperatorRepository;
import com.towerSharing.backend.repository.TowerRepository;
import com.towerSharing.backend.repository.TowerTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

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
                TransactionStatus.COMPLETED,
                dto.getNotes() != null ? dto.getNotes() : "Asset ownership transfer completed."
        );

        // Transfer ownership of tower
        tower.setOwnerOperator(buyer);
        tower.setSharingStatus(SharingStatus.NOT_AVAILABLE); // reset sharing status post purchase
        towerRepository.save(tower);

        return transactionRepository.save(tx);
    }
}
