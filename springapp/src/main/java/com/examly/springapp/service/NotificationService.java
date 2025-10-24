package com.examly.springapp.service;

import com.examly.springapp.model.Notification;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.NotificationRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepo;
    private final UserRepository userRepo;

    public NotificationService(NotificationRepository notificationRepo, UserRepository userRepo) {
        this.notificationRepo = notificationRepo;
        this.userRepo = userRepo;
    }

    // Save a notification
    public Notification saveNotification(Notification notification) {
        // Ensure user exists
        User user = userRepo.findById(notification.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        notification.setUser(user);
        return notificationRepo.save(notification);
    }

    // Get all notifications
    public List<Notification> getAllNotifications() {
        return notificationRepo.findAll();
    }

    // Get notifications by user
    public List<Notification> getNotificationsByUser(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepo.findByUser(user);
    }

    // Update notification (e.g., mark as read)
    public Notification updateNotification(Long id, Notification updated) {
        Optional<Notification> notifOpt = notificationRepo.findById(id);
        if (notifOpt.isPresent()) {
            Notification existing = notifOpt.get();
            existing.setTitle(updated.getTitle());
            existing.setMessage(updated.getMessage());
            existing.setType(updated.getType());
            existing.setIsRead(updated.getIsRead());
            return notificationRepo.save(existing);
        }
        return null;
    }

    // Delete notification
    public void deleteNotification(Long id) {
        if (notificationRepo.existsById(id)) {
            notificationRepo.deleteById(id);
        }
    }
}
