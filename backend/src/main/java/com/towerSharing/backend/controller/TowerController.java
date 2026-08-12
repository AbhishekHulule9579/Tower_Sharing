package com.towerSharing.backend.controller;

import com.towerSharing.backend.model.Tower;
import com.towerSharing.backend.service.TowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/towers")
@CrossOrigin(origins = "*")
public class TowerController {

    private final TowerService towerService;

    @Autowired
    public TowerController(TowerService towerService) {
        this.towerService = towerService;
    }

    @GetMapping
    public ResponseEntity<List<Tower>> getAllTowers() {
        return ResponseEntity.ok(towerService.getAllTowers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tower> getTowerById(@PathVariable Long id) {
        return ResponseEntity.ok(towerService.getTowerById(id));
    }

    @PostMapping
    public ResponseEntity<Tower> createTower(@RequestBody Tower tower) {
        return ResponseEntity.ok(towerService.createTower(tower));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tower> updateTower(@PathVariable Long id, @RequestBody Tower tower) {
        return ResponseEntity.ok(towerService.updateTower(id, tower));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTower(@PathVariable Long id) {
        towerService.deleteTower(id);
        return ResponseEntity.ok("Tower deleted successfully");
    }

    @GetMapping("/operator/{operatorId}")
    public ResponseEntity<List<Tower>> getTowersByOperator(@PathVariable Long operatorId) {
        return ResponseEntity.ok(towerService.getTowersByOperator(operatorId));
    }

    @GetMapping("/available-lease")
    public ResponseEntity<List<Tower>> getAvailableForLease() {
        return ResponseEntity.ok(towerService.getAvailableForLease());
    }

    @GetMapping("/available-sale")
    public ResponseEntity<List<Tower>> getAvailableForSale() {
        return ResponseEntity.ok(towerService.getAvailableForSale());
    }
}
