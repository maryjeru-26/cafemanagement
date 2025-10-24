package com.examly.springapp.repository;

import com.examly.springapp.model.Nutritional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NutritionalRepository extends JpaRepository<Nutritional, Long> {
    Nutritional findByMenuId(Long menuId);
}
