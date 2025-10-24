package com.examly.springapp.controller;

import com.examly.springapp.model.Nutritional;
import com.examly.springapp.service.NutritionalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nutritional")
public class NutritionalController {

    private final NutritionalService nutritionalService;

    public NutritionalController(NutritionalService nutritionalService) {
        this.nutritionalService = nutritionalService;
    }

    @PostMapping("/add")
    public Nutritional addNutritional(@RequestBody Nutritional nutritional) {
        return nutritionalService.saveNutritional(nutritional);
    }

    @GetMapping("/all")
    public List<Nutritional> getAllNutritional() {
        return nutritionalService.getAllNutritional();
    }

    @GetMapping("/{id}")
    public Nutritional getNutritionalById(@PathVariable Long id) {
        return nutritionalService.getById(id);
    }

    @GetMapping("/menu/{menuId}")
    public Nutritional getNutritionalByMenu(@PathVariable Long menuId) {
        return nutritionalService.getByMenuId(menuId);
    }

    @PutMapping("/{id}")
    public Nutritional updateNutritional(@PathVariable Long id, @RequestBody Nutritional nutritional) {
        return nutritionalService.updateNutritional(id, nutritional);
    }

    @DeleteMapping("/{id}")
    public void deleteNutritional(@PathVariable Long id) {
        nutritionalService.deleteNutritional(id);
    }
}
