package com.examly.springapp.service;

import com.examly.springapp.model.Reservation;
import com.examly.springapp.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    // Create
    public Reservation saveReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    // Read all
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // Read by ID
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id).orElse(null);
    }

    // Read by status
    public List<Reservation> getReservationsByStatus(String status) {
        return reservationRepository.findByStatus(status);
    }

    // Read between dates
    public List<Reservation> getReservationsInRange(LocalDateTime start, LocalDateTime end) {
        return reservationRepository.findByReservationTimeBetween(start, end);
    }

    // Update
    public Reservation updateReservation(Long id, Reservation updated) {
        Reservation existing = reservationRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setCustomerName(updated.getCustomerName());
            existing.setTableNumber(updated.getTableNumber());
            existing.setReservationTime(updated.getReservationTime());
            existing.setNumberOfGuests(updated.getNumberOfGuests());
            existing.setStatus(updated.getStatus());
            return reservationRepository.save(existing);
        }
        return null;
    }

    // Delete
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }
}
