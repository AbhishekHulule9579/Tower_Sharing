package com.towerSharing.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.towerSharing.backend.model.Operator;
import com.towerSharing.backend.model.SiteManagerRequest;
import com.towerSharing.backend.model.SiteManagerRequestStatus;

@Repository
public interface SiteManagerRequestRepository extends JpaRepository<SiteManagerRequest, Long> {
    List<SiteManagerRequest> findByStatus(SiteManagerRequestStatus status);
    List<SiteManagerRequest> findByOperatorAndStatus(Operator operator, SiteManagerRequestStatus status);
    boolean existsByUsername(String username);
}
