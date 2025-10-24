package com.examly.springapp.service;

import com.examly.springapp.model.Nutritional;
import com.examly.springapp.repository.NutritionalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NutritionalService {

    private final NutritionalRepository nutritionalRepository;

    public NutritionalService(NutritionalRepository nutritionalRepository) {
        this.nutritionalRepository = nutritionalRepository;
    }

    public Nutritional saveNutritional(Nutritional nutritional) {
        return nutritionalRepository.save(nutritional);
    }

    public List<Nutritional> getAllNutritional() {
        return nutritionalRepository.findAll();
    }

    public Nutritional getById(Long id) {
        return nutritionalRepository.findById(id).orElse(null);
    }

    public Nutritional getByMenuId(Long menuId) {
        return nutritionalRepository.findByMenuId(menuId);
    }

    public Nutritional updateNutritional(Long id, Nutritional updated) {
        Nutritional existing = nutritionalRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setCalories(updated.getCalories());
            existing.setProtein(updated.getProtein());
            existing.setCarbs(updated.getCarbs());
            existing.setFat(updated.getFat());
            existing.setFiber(updated.getFiber());
            existing.setSodium(updated.getSodium());
            existing.setMenu(updated.getMenu());
            return nutritionalRepository.save(existing);
        }
        return null;
    }

    public void deleteNutritional(Long id) {
        nutritionalRepository.deleteById(id);
    }
}
