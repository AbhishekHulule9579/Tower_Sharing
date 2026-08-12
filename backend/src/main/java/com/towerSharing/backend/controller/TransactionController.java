package com.towerSharing.backend.controller;

import com.towerSharing.backend.dto.BuyTowerDto;
import com.towerSharing.backend.model.TowerTransaction;
import com.towerSharing.backend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
