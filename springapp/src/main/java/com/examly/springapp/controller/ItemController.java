package com.examly.springapp.controller;

import com.examly.springapp.model.Item;
import com.examly.springapp.service.ItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping("/addItem")
    public Item addItem(@RequestBody Item item) {
        return itemService.saveItem(item);
    }

    @GetMapping("/allItems")
    public List<Item> getAllItems() {
        return itemService.getAllItems();
    }

    @GetMapping("/byCategory")
    public List<Item> getItemsByCategory(@RequestParam String category) {
        return itemService.getItemsByCategory(category);
    }

    @GetMapping("/sortedByPrice")
    public List<Item> getItemsSortedByPrice() {
        return itemService.getItemsSortedByPrice();
    }

    @PutMapping("/{id}")
    public Item updateItem(@PathVariable Long id, @RequestBody Item item) {
        return itemService.updateItem(id, item);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
    }
}
