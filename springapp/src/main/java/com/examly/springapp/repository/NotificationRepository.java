package com.examly.springapp.repository;

import com.examly.springapp.model.Notification;
import com.examly.springapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Find all notifications for a specific user
    List<Notification> findByUser(User user);

    // Find all unread notifications for a user
    List<Notification> findByUserAndIsReadFalse(User user);
}
