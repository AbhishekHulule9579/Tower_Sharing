package com.towerSharing.backend.repository;

import com.towerSharing.backend.model.User;
import com.towerSharing.backend.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByFullNameIgnoreCase(String fullName);
    List<User> findByEmailIgnoreCase(String email);
    Optional<User> findFirstByEmailIgnoreCase(String email);
    boolean existsByFullName(String fullName);
    List<User> findByRole(UserRole role);
}
