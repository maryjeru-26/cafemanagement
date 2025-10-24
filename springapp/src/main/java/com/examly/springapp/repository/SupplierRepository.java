package com.examly.springapp.repository;

import com.examly.springapp.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findByRating(Integer rating);
    List<Supplier> findByNameContainingIgnoreCase(String name);
}
