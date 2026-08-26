package com.towerSharing.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.towerSharing.backend.dto.BuyTowerDto;
import com.towerSharing.backend.model.TowerTransaction;
import com.towerSharing.backend.service.TransactionService;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<TowerTransaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @PostMapping("/buy")
    public ResponseEntity<TowerTransaction> buyTower(@RequestBody BuyTowerDto dto) {
        return ResponseEntity.ok(transactionService.buyTower(dto));
    }
    @PutMapping("/{id}/approve")
public ResponseEntity<TowerTransaction> approveTransaction(
        @PathVariable Long id) {

    return ResponseEntity.ok(
            transactionService.approveTransaction(id)
    );
}

@PutMapping("/{id}/reject")
public ResponseEntity<TowerTransaction> rejectTransaction(
        @PathVariable Long id) {

    return ResponseEntity.ok(
            transactionService.rejectTransaction(id)
    );
}
}
