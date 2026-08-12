package com.towerSharing.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.towerSharing.backend.dto.SiteManagerRequestCreateDto;
import com.towerSharing.backend.model.SiteManagerRequest;
import com.towerSharing.backend.model.SiteManagerRequestStatus;
import com.towerSharing.backend.repository.OperatorRepository;
import com.towerSharing.backend.repository.SiteManagerRequestRepository;
import com.towerSharing.backend.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OperatorRepository operatorRepository;
    private final SiteManagerRequestRepository siteManagerRequestRepository;

    @Autowired
    public AuthService(UserRepository userRepository,
                       OperatorRepository operatorRepository,
                       SiteManagerRequestRepository siteManagerRequestRepository) {
        this.userRepository = userRepository;
        this.operatorRepository = operatorRepository;
        this.siteManagerRequestRepository = siteManagerRequestRepository;
    }

    public SiteManagerRequest createRequest(SiteManagerRequestCreateDto request) {
        if (siteManagerRequestRepository.existsByUsername(request.getUsername()) || userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists.");
        }
        return operatorRepository.findById(request.getOperatorId())
                .map(operator -> siteManagerRequestRepository.save(new SiteManagerRequest(
                        request.getUsername(),
                        request.getPassword(),
                        request.getEmail(),
                        request.getFullName(),
                        request.getPhoneNumber(),
                        operator)))
                .orElseThrow(() -> new RuntimeException("Operator not found."));
    }

    public SiteManagerRequest approveRequest(Long requestId) {
        SiteManagerRequest request = siteManagerRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found."));
        if (request.getStatus() != SiteManagerRequestStatus.PENDING) {
            throw new IllegalStateException("Request has already been processed.");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("User with this username already exists.");
        }
        userRepository.save(new com.towerSharing.backend.model.User(request.getUsername(), request.getPassword(), request.getEmail(), com.towerSharing.backend.model.UserRole.SITE_MANAGER, request.getOperator()));
        request.setStatus(SiteManagerRequestStatus.APPROVED);
        return siteManagerRequestRepository.save(request);
    }
}
