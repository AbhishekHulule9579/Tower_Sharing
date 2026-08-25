package com.towerSharing.backend.controller;

import com.towerSharing.backend.config.JwtUtil;
import com.towerSharing.backend.model.Operator;
import com.towerSharing.backend.model.SiteManagerRequest;
import com.towerSharing.backend.model.SiteManagerRequestStatus;
import com.towerSharing.backend.model.User;
import com.towerSharing.backend.model.UserRole;
import com.towerSharing.backend.repository.OperatorRepository;
import com.towerSharing.backend.repository.SiteManagerRequestRepository;
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

    private final SiteManagerRequestRepository siteManagerRequestRepository;

    @Autowired
    public UserController(OperatorRepository operatorRepository,
                          UserRepository userRepository,
                          SiteManagerRequestRepository siteManagerRequestRepository,
                          JwtUtil jwtUtil) {
        this.operatorRepository = operatorRepository;
        this.userRepository = userRepository;
        this.siteManagerRequestRepository = siteManagerRequestRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/operators/{operatorId}/operating-states")
    public ResponseEntity<List<String>> getOperatingStates(@PathVariable Long operatorId) {
        Operator operator = operatorRepository.findById(operatorId).orElse(null);
        if (operator == null) {
            return ResponseEntity.ok(List.of());
        }
        List<User> managers = userRepository.findByOperatorAndRole(operator, UserRole.OPERATOR_MANAGER);
        List<String> states = managers.stream()
                .map(User::getState)
                .filter(s -> s != null && !s.isBlank())
                .distinct()
                .sorted()
                .toList();
        return ResponseEntity.ok(states);
    }

    @GetMapping("/operators/{operatorId}/assigned-states")
    public ResponseEntity<List<String>> getAssignedStates(@PathVariable Long operatorId) {
        Operator operator = operatorRepository.findById(operatorId).orElse(null);
        if (operator == null) {
            return ResponseEntity.ok(List.of());
        }
        List<User> activeManagers = userRepository.findByOperatorAndRole(operator, UserRole.OPERATOR_MANAGER);
        List<SiteManagerRequest> pendingRequests = siteManagerRequestRepository.findByOperatorAndRequestedRoleAndStatus(operator, UserRole.OPERATOR_MANAGER, SiteManagerRequestStatus.PENDING);

        java.util.Set<String> set = new java.util.TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        activeManagers.stream().map(User::getState).filter(s -> s != null && !s.isBlank()).forEach(set::add);
        pendingRequests.stream().map(SiteManagerRequest::getState).filter(s -> s != null && !s.isBlank()).forEach(set::add);

        return ResponseEntity.ok(new java.util.ArrayList<>(set));
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

