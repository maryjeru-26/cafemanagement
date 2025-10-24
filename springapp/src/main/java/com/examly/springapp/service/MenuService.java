package com.examly.springapp.service;

import com.examly.springapp.model.Menu;
import com.examly.springapp.repository.MenuRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {

    private final MenuRepository menuRepository;

    public MenuService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    // ✅ Save menu item
    public Menu saveMenu(Menu menu) {
        return menuRepository.save(menu);
    }

    // ✅ Get all menu items
    public List<Menu> getAllMenuItems() {
        return menuRepository.findAll();
    }

    // ✅ Get menu item by ID
    public Menu getMenuById(Long id) {
        return menuRepository.findById(id).orElse(null);
    }

    // ✅ Get paginated + sorted menu list
    public Page<Menu> getPaginatedMenus(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return menuRepository.findAll(pageable);
    }

    // ✅ Update menu item
    public Menu updateMenu(Long id, Menu updated) {
        Menu existing = menuRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setItemName(updated.getItemName());
            existing.setCategory(updated.getCategory());
            existing.setPrice(updated.getPrice());
            existing.setAvailable(updated.getAvailable());
            return menuRepository.save(existing);
        }
        return null;
    }

    // ✅ Delete menu item
    public void deleteMenu(Long id) {
        menuRepository.deleteById(id);
    }
}
