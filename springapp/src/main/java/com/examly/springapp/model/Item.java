package com.examly.springapp.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;


@Entity
@Table(name = "item")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private String category;
    private int price;
    private boolean available;

    // ✅ Many items belong to one order
    @ManyToOne
    @JoinColumn(name = "order_id")  // creates a foreign key column in Item table
    @JsonBackReference
    private Order order;

    public Item() {}

    public Item(String itemName, String category, int price, boolean available) {
        this.itemName = itemName;
        this.category = category;
        this.price = price;
        this.available = available;
    }

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
}
