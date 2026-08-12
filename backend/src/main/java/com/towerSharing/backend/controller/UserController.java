package com.towerSharing.backend.controller;

import com.towerSharing.backend.model.Operator;
import com.towerSharing.backend.model.User;
import com.towerSharing.backend.model.UserRole;
import com.towerSharing.backend.repository.OperatorRepository;
import com.towerSharing.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {

    private final OperatorRepository operatorRepository;
    private final UserRepository userRepository;

    @Autowired
    public UserController(OperatorRepository operatorRepository, UserRepository userRepository) {
        this.operatorRepository = operatorRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/operators")
    public ResponseEntity<List<Operator>> getAllOperators() {
        return ResponseEntity.ok(operatorRepository.findAll());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/users/site-managers")
    public ResponseEntity<List<User>> getSiteManagers() {
        return ResponseEntity.ok(userRepository.findByRole(UserRole.SITE_MANAGER));
    }
}
