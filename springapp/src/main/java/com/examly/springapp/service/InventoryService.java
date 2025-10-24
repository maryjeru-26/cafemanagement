package com.examly.springapp.service;

import com.examly.springapp.model.Inventory;
import com.examly.springapp.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public Inventory saveInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public Inventory getInventoryById(Long id) {
        return inventoryRepository.findById(id).orElse(null);
    }

    public List<Inventory> searchByItemName(String itemName) {
        return inventoryRepository.findByItemNameContainingIgnoreCase(itemName);
    }

    public List<Inventory> getLowStockItems(Integer threshold) {
        return inventoryRepository.findByQuantityLessThanEqual(threshold);
    }

    public Inventory updateInventory(Long id, Inventory updated) {
        Inventory existing = inventoryRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setItemName(updated.getItemName());
            existing.setQuantity(updated.getQuantity());
            existing.setUnit(updated.getUnit());
            existing.setStorageLocation(updated.getStorageLocation());
            existing.setReorderLevel(updated.getReorderLevel());
            existing.setSupplier(updated.getSupplier());
            return inventoryRepository.save(existing);
        }
        return null;
    }

    public void deleteInventory(Long id) {
        inventoryRepository.deleteById(id);
    }
}
