package com.examly.springapp.repository;

import com.examly.springapp.model.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByCategory(String category);
    List<Menu> findAllByOrderByPriceAsc();
}
