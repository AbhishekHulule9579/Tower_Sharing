package com.towerSharing.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.towerSharing.backend.dto.LoginRequestDto;
import com.towerSharing.backend.dto.LoginResponseDto;
import com.towerSharing.backend.dto.SiteManagerRequestCreateDto;
import com.towerSharing.backend.model.Operator;
import com.towerSharing.backend.model.SiteManagerRequest;
import com.towerSharing.backend.model.SiteManagerRequestStatus;
import com.towerSharing.backend.model.User;
import com.towerSharing.backend.model.UserRole;
import com.towerSharing.backend.repository.OperatorRepository;
import com.towerSharing.backend.repository.SiteManagerRequestRepository;
import com.towerSharing.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final OperatorRepository operatorRepository;
    private final SiteManagerRequestRepository siteManagerRequestRepository;

    @Autowired
    public AuthController(UserRepository userRepository,
                          OperatorRepository operatorRepository,
                          SiteManagerRequestRepository siteManagerRequestRepository) {
        this.userRepository = userRepository;
        this.operatorRepository = operatorRepository;
        this.siteManagerRequestRepository = siteManagerRequestRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElse(null);
        if (user == null || !user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid username or password.");
        }

        if (request.getRole() != null && !request.getRole().isBlank()) {
            if (!user.getRole().name().equalsIgnoreCase(request.getRole())) {
                return ResponseEntity.badRequest().body("Selected login role does not match your assigned role.");
            }
        }

        String token = "demo-token-" + user.getUsername();
        return ResponseEntity.ok(new LoginResponseDto(user, token));
    }

    @PostMapping("/site-manager-requests")
    public ResponseEntity<?> createSiteManagerRequest(@RequestBody SiteManagerRequestCreateDto request) {
        if (siteManagerRequestRepository.existsByUsername(request.getUsername()) || userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists.");
        }
        if (request.getFullName() == null || request.getFullName().isBlank()) {
            return ResponseEntity.badRequest().body("Full name is required.");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email is required.");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Password is required.");
        }
        if (request.getOperatorId() == null) {
            return ResponseEntity.badRequest().body("Operator selection is required.");
        }

        Operator operator = operatorRepository.findById(request.getOperatorId())
                .orElseThrow(() -> new RuntimeException("Operator not found."));

        UserRole requestedRole;
        try {
            requestedRole = UserRole.valueOf(request.getRequestedRole() == null ? "SITE_MANAGER" : request.getRequestedRole());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body("Choose either Site Manager or Operations Manager.");
        }
        if (requestedRole == UserRole.ADMIN) {
            return ResponseEntity.badRequest().body("Administrator registration is not available.");
        }

        SiteManagerRequest newRequest = new SiteManagerRequest(
                request.getUsername(),
                request.getPassword(),
                request.getEmail(),
                request.getFullName(),
                request.getPhoneNumber(),
                operator,
                requestedRole
        );
        return ResponseEntity.ok(siteManagerRequestRepository.save(newRequest));
    }

    @GetMapping("/site-manager-requests")
    public ResponseEntity<?> getPendingRequests(@RequestHeader(name = "Authorization", required = false) String authorization) {
        User actor = getUserFromToken(authorization);
        if (actor == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid authorization token.");
        }

        if (actor.getRole() == UserRole.OPERATOR_MANAGER) {
            return ResponseEntity.ok(siteManagerRequestRepository.findByOperatorAndRequestedRoleAndStatus(actor.getOperator(), UserRole.SITE_MANAGER, SiteManagerRequestStatus.PENDING));
        }
        if (actor.getRole() == UserRole.ADMIN) {
            return ResponseEntity.ok(siteManagerRequestRepository.findByRequestedRoleAndStatus(UserRole.OPERATOR_MANAGER, SiteManagerRequestStatus.PENDING));
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins or operator managers can view pending site manager requests.");
    }

    @PostMapping("/site-manager-requests/{id}/approve")
    public ResponseEntity<?> approveSiteManagerRequest(@PathVariable Long id,
                                                       @RequestHeader(name = "Authorization", required = false) String authorization) {
        User actor = getUserFromToken(authorization);
        if (actor == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid authorization token.");
        }

        SiteManagerRequest request = siteManagerRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found."));

        if (request.getStatus() != SiteManagerRequestStatus.PENDING) {
            return ResponseEntity.badRequest().body("Request has already been processed.");
        }
        boolean canApprove = (actor.getRole() == UserRole.ADMIN && request.getRequestedRole() == UserRole.OPERATOR_MANAGER)
                || (actor.getRole() == UserRole.OPERATOR_MANAGER && request.getRequestedRole() == UserRole.SITE_MANAGER
                    && actor.getOperator() != null && actor.getOperator().getId().equals(request.getOperator().getId()));
        if (!canApprove) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to approve this registration request.");
        }

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("User with this username already exists.");
        }

        User siteManager = new User(
                request.getUsername(),
                request.getPassword(),
                request.getEmail(),
                request.getFullName(),
                request.getPhoneNumber(),
                request.getRequestedRole(),
                request.getOperator()
        );
        userRepository.save(siteManager);

        request.setStatus(SiteManagerRequestStatus.APPROVED);
        siteManagerRequestRepository.save(request);

        return ResponseEntity.ok(siteManager);
    }

    private User getUserFromToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authorizationHeader.substring("Bearer ".length());
        if (!token.startsWith("demo-token-")) {
            return null;
        }
        String username = token.substring("demo-token-".length());
        return userRepository.findByUsername(username).orElse(null);
    }
}
