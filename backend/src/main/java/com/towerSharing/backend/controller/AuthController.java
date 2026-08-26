package com.towerSharing.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.towerSharing.backend.config.JwtUtil;
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
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthController(UserRepository userRepository,
                          OperatorRepository operatorRepository,
                          SiteManagerRequestRepository siteManagerRequestRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.operatorRepository = operatorRepository;
        this.siteManagerRequestRepository = siteManagerRequestRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request) {
        String loginEmail = request.getLoginEmail();
        if (loginEmail == null || loginEmail.isBlank()) {
            return ResponseEntity.badRequest().body("Please enter your Email or Username and password.");
        }

        String query = loginEmail.trim();
        User user = userRepository.findFirstByEmailIgnoreCase(query)
                .or(() -> userRepository.findByUsername(query))
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("Invalid Email/Username or password.");
        }

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword())
                || request.getPassword().equals(user.getPassword());

        if (!passwordMatches) {
            return ResponseEntity.badRequest().body("Invalid Email/Username or password.");
        }

        if (request.getPassword().equals(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(user);
        }

        if (request.getRole() != null && !request.getRole().isBlank()) {
            if (!user.getRole().name().equalsIgnoreCase(request.getRole())) {
                return ResponseEntity.badRequest().body("Selected login role does not match your assigned role.");
            }
        }

        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(new LoginResponseDto(user, token));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(name = "Authorization", required = false) String authorization) {
        User user = getUserFromToken(authorization);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token.");
        }
        String token = authorization != null && authorization.startsWith("Bearer ")
                ? authorization.substring(7)
                : authorization;
        return ResponseEntity.ok(new LoginResponseDto(user, token));
    }

    @PostMapping("/site-manager-requests")
    public ResponseEntity<?> createSiteManagerRequest(@RequestBody SiteManagerRequestCreateDto request) {
        String fullName = request.getFullName();
        if (fullName == null || fullName.isBlank()) {
            fullName = request.getUsername();
        }
        if (fullName == null || fullName.isBlank()) {
            return ResponseEntity.badRequest().body("Full name is required.");
        }
        request.setFullName(fullName);
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            request.setUsername(fullName);
        }

        if (userRepository.existsByFullName(fullName) || userRepository.findByUsername(fullName).isPresent()) {
            return ResponseEntity.badRequest().body("Account with this Name already exists.");
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

        String state = request.getState() != null ? request.getState().trim() : null;
        if (requestedRole == UserRole.OPERATOR_MANAGER) {
            if (state == null || state.isBlank()) {
                return ResponseEntity.badRequest().body("State jurisdiction is required for Operations Manager registration.");
            }
            if (userRepository.existsByOperatorAndRoleAndStateIgnoreCase(operator, UserRole.OPERATOR_MANAGER, state)) {
                return ResponseEntity.badRequest().body("The state '" + state + "' is already assigned to an Operations Manager for " + operator.getName() + ".");
            }
            if (siteManagerRequestRepository.existsByOperatorAndRequestedRoleAndStatusAndStateIgnoreCase(operator, UserRole.OPERATOR_MANAGER, SiteManagerRequestStatus.PENDING, state)) {
                return ResponseEntity.badRequest().body("The state '" + state + "' is already assigned and a registration request for " + operator.getName() + " Operations Manager is currently pending admin review.");
            }
        } else if (requestedRole == UserRole.SITE_MANAGER) {
            if (state == null || state.isBlank()) {
                return ResponseEntity.badRequest().body("Please select an assigned operating state jurisdiction.");
            }
            if (!userRepository.existsByOperatorAndRoleAndStateIgnoreCase(operator, UserRole.OPERATOR_MANAGER, state)) {
                return ResponseEntity.badRequest().body("No Operations Manager is currently assigned for " + operator.getName() + " in '" + state + "'. Site Managers can only register in states with an active Operations Manager.");
            }
        }

        if (request.getPhoneNumber() == null || request.getPhoneNumber().isBlank()) {
            return ResponseEntity.badRequest().body("Mobile number is required.");
        }

        String cleanPhone = request.getPhoneNumber().replaceAll("[\\s-]", "");

        if (!cleanPhone.matches("^[6-9]\\d{9}$") || cleanPhone.matches("^(\\d)\\1{9}$")) {
            return ResponseEntity.badRequest().body("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9 (dummy/repeated numbers like 0000000000 are not allowed).");
        }

        if (userRepository.existsByPhoneNumber(cleanPhone)) {
            return ResponseEntity.badRequest().body("An account with this mobile number already exists.");
        }

        if (siteManagerRequestRepository.existsByPhoneNumberAndStatus(cleanPhone, SiteManagerRequestStatus.PENDING)) {
            return ResponseEntity.badRequest().body("A registration request with this mobile number is already pending review.");
        }

        request.setPhoneNumber(cleanPhone);

        SiteManagerRequest newRequest = new SiteManagerRequest(
                request.getUsername(),
                request.getPassword(),
                request.getEmail(),
                request.getFullName(),
                request.getPhoneNumber(),
                state,
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
            if (actor.getState() != null && !actor.getState().isBlank()) {
                return ResponseEntity.ok(siteManagerRequestRepository.findByOperatorAndRequestedRoleAndStatusAndStateIgnoreCase(
                        actor.getOperator(), UserRole.SITE_MANAGER, SiteManagerRequestStatus.PENDING, actor.getState().trim()));
            }
            return ResponseEntity.ok(siteManagerRequestRepository.findByOperatorAndRequestedRoleAndStatus(
                    actor.getOperator(), UserRole.SITE_MANAGER, SiteManagerRequestStatus.PENDING));
        }
        if (actor.getRole() == UserRole.ADMIN) {
            return ResponseEntity.ok(
                siteManagerRequestRepository.findByOperatorAndRequestedRoleAndStatus(
                    actor.getOperator(),
                    UserRole.OPERATOR_MANAGER,
                    SiteManagerRequestStatus.PENDING
                )
            );
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins or operator managers can view pending registration requests.");
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
        boolean canApprove = (actor.getRole() == UserRole.ADMIN
                    && actor.getOperator() != null && actor.getOperator().getId().equals(request.getOperator().getId()))
                || (actor.getRole() == UserRole.OPERATOR_MANAGER && request.getRequestedRole() == UserRole.SITE_MANAGER
                    && actor.getOperator() != null && actor.getOperator().getId().equals(request.getOperator().getId()));
        if (!canApprove) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to approve this registration request.");
        }

        if (actor.getRole() == UserRole.OPERATOR_MANAGER && actor.getState() != null && !actor.getState().isBlank()) {
            if (request.getState() == null || !request.getState().equalsIgnoreCase(actor.getState().trim())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only approve Site Managers for your assigned state jurisdiction (" + actor.getState() + ").");
            }
        }

        if (request.getRequestedRole() == UserRole.OPERATOR_MANAGER && request.getState() != null && !request.getState().isBlank()) {
            userRepository.findByOperatorAndRoleAndStateIgnoreCase(request.getOperator(), UserRole.OPERATOR_MANAGER, request.getState().trim())
                .ifPresent(existingManager -> {
                    if (!existingManager.getUsername().equalsIgnoreCase(request.getUsername())) {
                        existingManager.setState(null);
                        userRepository.save(existingManager);
                    }
                });
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User siteManager = userRepository.findByUsername(request.getUsername())
                .orElseGet(User::new);
        siteManager.setUsername(request.getUsername());
        siteManager.setPassword(encodedPassword);
        siteManager.setEmail(request.getEmail());
        siteManager.setFullName(request.getFullName());
        siteManager.setPhoneNumber(request.getPhoneNumber());
        siteManager.setState(request.getState());
        siteManager.setRole(request.getRequestedRole());
        siteManager.setOperator(request.getOperator());
        userRepository.save(siteManager);

        request.setStatus(SiteManagerRequestStatus.APPROVED);
        siteManagerRequestRepository.save(request);

        return ResponseEntity.ok(siteManager);
    }

    @PostMapping("/site-manager-requests/{id}/reject")
    public ResponseEntity<?> rejectSiteManagerRequest(@PathVariable Long id,
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
        boolean canReject = (actor.getRole() == UserRole.ADMIN
                    && actor.getOperator() != null && actor.getOperator().getId().equals(request.getOperator().getId()))
                || (actor.getRole() == UserRole.OPERATOR_MANAGER && request.getRequestedRole() == UserRole.SITE_MANAGER
                    && actor.getOperator() != null && actor.getOperator().getId().equals(request.getOperator().getId()));
        if (!canReject) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to reject this registration request.");
        }

        request.setStatus(SiteManagerRequestStatus.REJECTED);
        siteManagerRequestRepository.save(request);

        return ResponseEntity.ok(request);
    }

    private User getUserFromToken(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            return null;
        }
        String username = jwtUtil.extractUsername(authorizationHeader);
        if (username == null || username.isBlank()) {
            return null;
        }
        return userRepository.findByUsername(username).orElse(null);
    }
}
