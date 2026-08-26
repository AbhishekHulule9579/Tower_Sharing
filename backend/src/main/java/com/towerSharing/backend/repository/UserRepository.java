package com.towerSharing.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.towerSharing.backend.model.Operator;
import com.towerSharing.backend.model.User;
import com.towerSharing.backend.model.UserRole;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByFullNameIgnoreCase(String fullName);
    List<User> findByEmailIgnoreCase(String email);
    Optional<User> findFirstByEmailIgnoreCase(String email);
    boolean existsByFullName(String fullName);
    List<User> findByRole(UserRole role);
    List<User> findByOperator(Operator operator);
    List<User> findByOperatorAndRole(Operator operator, UserRole role);
    long countByOperatorAndRole(Operator operator, UserRole role);
    boolean existsByOperatorAndRoleAndStateIgnoreCase(Operator operator, UserRole role, String state);
    Optional<User> findByOperatorAndRoleAndStateIgnoreCase(Operator operator, UserRole role, String state);
    //new thing added
    boolean existsByPhoneNumber(String phoneNumber);
}
