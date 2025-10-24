package com.examly.springapp.service;

import com.examly.springapp.exception.ItemNotFoundException;
import com.examly.springapp.model.Item;
import com.examly.springapp.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public Item saveItem(Item item) {
        return itemRepository.save(item);
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public List<Item> getItemsByCategory(String category) {
        return itemRepository.findByCategory(category);
    }

    public List<Item> getItemsSortedByPrice() {
        return itemRepository.findAllByOrderByPriceAsc();
    }

    public Item updateItem(Long id, Item updated) {
        Item existing = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException(id));
        existing.setItemName(updated.getItemName());
        existing.setCategory(updated.getCategory());
        existing.setPrice(updated.getPrice());
        existing.setAvailable(updated.isAvailable());
        return itemRepository.save(existing);
    }

    public void deleteItem(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new ItemNotFoundException(id);
        }
        itemRepository.deleteById(id);
    }
}
