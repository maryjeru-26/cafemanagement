package com.examly.springapp.repository;

import com.examly.springapp.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByCategory(String category);
    List<Item> findAllByOrderByPriceAsc();
}
