package com.towerSharing.backend.dto;

public class LoginRequestDto {
    private String email;
    private String name;
    private String fullName;
    private String username;
    private String password;
    private String role;

    public LoginRequestDto() {}

    public LoginRequestDto(String email, String password, String role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    /** Returns the best available login identifier (email first). */
    public String getLoginEmail() {
        if (email != null && !email.isBlank()) return email;
        // fallback: legacy clients may send name/username containing an email
        if (name != null && name.contains("@")) return name;
        if (username != null && username.contains("@")) return username;
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
