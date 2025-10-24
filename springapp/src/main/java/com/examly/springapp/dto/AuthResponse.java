package com.examly.springapp.dto;

import java.util.List;

public class AuthResponse {
    private String token;
    private String email;
    private List<String> roles;
    private Long userId; // ✅ added this
    private String username; // ✅ include username for clarity

    public AuthResponse() {}

    public AuthResponse(String token, String email, List<String> roles, Long userId, String username) {
        this.token = token;
        this.email = email;
        this.roles = roles;
        this.userId = userId;
        this.username = username;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}
