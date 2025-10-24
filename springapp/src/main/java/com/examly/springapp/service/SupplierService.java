package com.examly.springapp.service;

import com.examly.springapp.model.Supplier;
import com.examly.springapp.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public Supplier saveSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id).orElse(null);
    }

    public List<Supplier> getSuppliersByRating(Integer rating) {
        return supplierRepository.findByRating(rating);
    }

    public List<Supplier> searchSuppliersByName(String name) {
        return supplierRepository.findByNameContainingIgnoreCase(name);
    }

    public Supplier updateSupplier(Long id, Supplier updated) {
        Supplier existing = supplierRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setName(updated.getName());
            existing.setContactInfo(updated.getContactInfo());
            existing.setProducts(updated.getProducts());
            existing.setRating(updated.getRating());
            existing.setContractDetails(updated.getContractDetails());
            return supplierRepository.save(existing);
        }
        return null;
    }

    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }
}
