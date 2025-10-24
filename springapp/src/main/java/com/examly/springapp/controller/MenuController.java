package com.examly.springapp.controller;

import com.examly.springapp.model.Menu;
import com.examly.springapp.service.MenuService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")

public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    
    @PostMapping
    public Menu addMenu(@RequestBody Menu menu) {
        return menuService.saveMenu(menu);
    }

    
    @GetMapping
    public List<Menu> getAllMenu() {
        return menuService.getAllMenuItems();
    }

    
    @GetMapping("/{id}")
    public Menu getMenuById(@PathVariable Long id) {
        return menuService.getMenuById(id);
    }

   
    @GetMapping("/paginated")
    public Page<Menu> getPaginatedMenus(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return menuService.getPaginatedMenus(page, size, sortBy, direction);
    }

    @PutMapping("/{id}")
    public Menu updateMenu(@PathVariable Long id, @RequestBody Menu menu) {
        return menuService.updateMenu(id, menu);
    }

    @DeleteMapping("/{id}")
    public void deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
    }
}
