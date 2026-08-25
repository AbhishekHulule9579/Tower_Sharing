package com.towerSharing.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.towerSharing.backend.model.Operator;
import com.towerSharing.backend.model.SiteManagerRequest;
import com.towerSharing.backend.model.SiteManagerRequestStatus;
import com.towerSharing.backend.model.UserRole;

@Repository
public interface SiteManagerRequestRepository extends JpaRepository<SiteManagerRequest, Long> {
    List<SiteManagerRequest> findByStatus(SiteManagerRequestStatus status);
    long countByStatus(SiteManagerRequestStatus status);
    List<SiteManagerRequest> findByOperatorAndStatus(Operator operator, SiteManagerRequestStatus status);
    List<SiteManagerRequest> findByOperatorAndRequestedRoleAndStatus(Operator operator, UserRole requestedRole, SiteManagerRequestStatus status);
    List<SiteManagerRequest> findByRequestedRoleAndStatus(UserRole requestedRole, SiteManagerRequestStatus status);
    List<SiteManagerRequest> findByOperatorAndRequestedRoleAndStatusAndStateIgnoreCase(Operator operator, UserRole requestedRole, SiteManagerRequestStatus status, String state);
    boolean existsByUsername(String username);
    boolean existsByOperatorAndRequestedRoleAndStatusAndStateIgnoreCase(Operator operator, UserRole requestedRole, SiteManagerRequestStatus status, String state);
}
