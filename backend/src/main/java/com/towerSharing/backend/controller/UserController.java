package com.towerSharing.backend.controller;

import com.towerSharing.backend.config.JwtUtil;
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
    private final JwtUtil jwtUtil;

    @Autowired
    public UserController(OperatorRepository operatorRepository,
                          UserRepository userRepository,
                          JwtUtil jwtUtil) {
        this.operatorRepository = operatorRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/operators")
    public ResponseEntity<List<Operator>> getAllOperators(@RequestHeader(name = "Authorization", required = false) String authorization) {
        User actor = getUserFromToken(authorization);
        if (actor != null && actor.getRole() == UserRole.ADMIN && actor.getOperator() != null) {
            return ResponseEntity.ok(List.of(actor.getOperator()));
        }
        return ResponseEntity.ok(operatorRepository.findAll());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader(name = "Authorization", required = false) String authorization) {
        User actor = getUserFromToken(authorization);
        if (actor != null && actor.getRole() == UserRole.ADMIN && actor.getOperator() != null) {
            return ResponseEntity.ok(userRepository.findByOperator(actor.getOperator()));
        }
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/users/site-managers")
    public ResponseEntity<List<User>> getSiteManagers(@RequestHeader(name = "Authorization", required = false) String authorization) {
        User actor = getUserFromToken(authorization);
        if (actor != null && actor.getRole() == UserRole.ADMIN && actor.getOperator() != null) {
            return ResponseEntity.ok(userRepository.findByOperatorAndRole(actor.getOperator(), UserRole.SITE_MANAGER));
        }
        return ResponseEntity.ok(userRepository.findByRole(UserRole.SITE_MANAGER));
    }

    private User getUserFromToken(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            return null;
        }
        String token = authorizationHeader.startsWith("Bearer ")
                ? authorizationHeader.substring(7)
                : authorizationHeader;
        String username = jwtUtil.extractUsername(token);
        if (username == null || username.isBlank()) {
            return null;
        }
        return userRepository.findByUsername(username).orElse(null);
    }
}

