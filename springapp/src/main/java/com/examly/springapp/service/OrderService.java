package com.examly.springapp.service;

import com.examly.springapp.model.Order;
import com.examly.springapp.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByOrderStatus(status);
    }

    public Order updateOrder(Long id, Order updated) {
        Order existing = orderRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setOrderStatus(updated.getOrderStatus());
            existing.setTotalAmount(updated.getTotalAmount());
            existing.setOrderDate(updated.getOrderDate());
            existing.setUser(updated.getUser());
            existing.setQuantity(updated.getQuantity());
            return orderRepository.save(existing);
        }
        return null;
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
