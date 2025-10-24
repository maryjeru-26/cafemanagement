package com.examly.springapp.repository;

import com.examly.springapp.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByStatus(String status);
    List<Reservation> findByReservationTimeBetween(LocalDateTime start, LocalDateTime end);
}
