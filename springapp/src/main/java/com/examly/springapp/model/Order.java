package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;


@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderStatus;
    private Double totalAmount;
    private LocalDateTime orderDate = LocalDateTime.now();
    private Integer quantity;

    // 🔹 Many orders can belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // 🔹 One order can have many items
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Item> items;

    public Order() {}

    public Order(String orderStatus, Double totalAmount, LocalDateTime orderDate, User user, Integer quantity) {
        this.orderStatus = orderStatus;
        this.totalAmount = totalAmount;
        this.orderDate = orderDate;
        this.user = user;
        this.quantity = quantity;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public List<Item> getItems() { return items; }

    // ✅ Fix: set both sides of the relationship
    public void setItems(List<Item> items) {
        this.items = items;
        if (items != null) {
            for (Item item : items) {
                item.setOrder(this); // important line — sets the foreign key
            }
        }
    }
}
