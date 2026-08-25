package com.towerSharing.backend.dto;

public class SiteManagerRequestCreateDto {
    private String username;
    private String password;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String state;
    private Long operatorId;
    private String requestedRole;

    public SiteManagerRequestCreateDto() {}

    public SiteManagerRequestCreateDto(String username, String password, String email, String fullName, String phoneNumber, Long operatorId) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.operatorId = operatorId;
    }

    public SiteManagerRequestCreateDto(String username, String password, String email, String fullName, String phoneNumber, String state, Long operatorId, String requestedRole) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.state = state;
        this.operatorId = operatorId;
        this.requestedRole = requestedRole;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Long getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(Long operatorId) {
        this.operatorId = operatorId;
    }

    public String getRequestedRole() {
        return requestedRole;
    }

    public void setRequestedRole(String requestedRole) {
        this.requestedRole = requestedRole;
    }
}
