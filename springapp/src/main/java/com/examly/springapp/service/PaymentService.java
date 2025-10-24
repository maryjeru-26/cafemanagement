package com.examly.springapp.service;

import com.examly.springapp.model.Payment;
import com.examly.springapp.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment savePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id).orElse(null);
    }

    public List<Payment> getPaymentsByStatus(String status) {
        return paymentRepository.findByStatus(status);
    }

    public List<Payment> getPaymentsByMethod(String method) {
        return paymentRepository.findByMethod(method);
    }

    public Payment updatePayment(Long id, Payment updated) {
        Payment existing = paymentRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setOrderId(updated.getOrderId());
            existing.setAmount(updated.getAmount());
            existing.setMethod(updated.getMethod());
            existing.setStatus(updated.getStatus());
            existing.setPaymentDate(updated.getPaymentDate());
            return paymentRepository.save(existing);
        }
        return null;
    }

    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}
