package com.examly.springapp.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;

    @JsonProperty("password") // <-- tells Jackson to map JSON "password" to this field
    private String password;

    private String role;
    private String dietaryRestrictions;
    private LocalDateTime createdDate = LocalDateTime.now();
    private LocalDateTime lastLogin;
    private Boolean isActive = true;

    public User() {}

    public User(String username, String email, String password, String role,
                String dietaryRestrictions, LocalDateTime createdDate,
                LocalDateTime lastLogin, Boolean isActive) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.dietaryRestrictions = dietaryRestrictions;
        this.createdDate = createdDate;
        this.lastLogin = lastLogin;
        this.isActive = isActive;
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    // Keep existing getter/setter names
    public String getPasswordHash() { return password; }
    public void setPasswordHash(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDietaryRestrictions() { return dietaryRestrictions; }
    public void setDietaryRestrictions(String dietaryRestrictions) {
        this.dietaryRestrictions = dietaryRestrictions;
    }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
