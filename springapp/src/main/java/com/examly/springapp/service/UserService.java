package com.examly.springapp.service;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public User saveUser(User user) {
        // Encrypt password before saving
        String encodedPassword = passwordEncoder.encode(user.getPasswordHash());
        user.setPasswordHash(encodedPassword);
        return repo.save(user);
    }

    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public User getUserById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public User getUserByEmail(String email) {
        return repo.findByEmail(email).orElse(null);
    }
    public User updateUser(Long id, User updated) {
        Optional<User> userOpt = repo.findById(id);
        if (userOpt.isPresent()) {
            User existing = userOpt.get();
            existing.setUsername(updated.getUsername());
            existing.setEmail(updated.getEmail());

            // Encrypt password only if updated
            if (updated.getPasswordHash() != null && !updated.getPasswordHash().isBlank()) {
                existing.setPasswordHash(passwordEncoder.encode(updated.getPasswordHash()));
            }

            existing.setRole(updated.getRole());
            existing.setDietaryRestrictions(updated.getDietaryRestrictions());
            existing.setLastLogin(updated.getLastLogin());
            existing.setIsActive(updated.getIsActive());
            return repo.save(existing);
        }
        return null;
    }

    public void deleteUser(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
        }
    }
}
