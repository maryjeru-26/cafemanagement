package com.examly.springapp.repository;

import com.examly.springapp.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByItemNameContainingIgnoreCase(String itemName);
    List<Inventory> findByQuantityLessThanEqual(Integer quantity);
}
