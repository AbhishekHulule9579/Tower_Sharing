package com.towerSharing.backend.dto;

import com.towerSharing.backend.model.User;

public class LoginResponseDto {
    private Long id;
    private String username;
    private String email;
    private String role;
    private Long operatorId;
    private String operatorCode;
    private String operatorName;
    private String token;

    public LoginResponseDto() {}

    public LoginResponseDto(User user, String token) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getRole() != null ? user.getRole().name() : null;
        this.operatorId = user.getOperator() != null ? user.getOperator().getId() : null;
        this.operatorCode = user.getOperator() != null ? user.getOperator().getCode() : null;
        this.operatorName = user.getOperator() != null ? user.getOperator().getName() : null;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(Long operatorId) {
        this.operatorId = operatorId;
    }

    public String getOperatorCode() {
        return operatorCode;
    }

    public void setOperatorCode(String operatorCode) {
        this.operatorCode = operatorCode;
    }

    public String getOperatorName() {
        return operatorName;
    }

    public void setOperatorName(String operatorName) {
        this.operatorName = operatorName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
