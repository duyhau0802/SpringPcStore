package com.ecom.SpringPcStore.controller;

import com.ecom.SpringPcStore.dto.request.PaymentRequest;
import com.ecom.SpringPcStore.dto.response.PaymentResponse;
import com.ecom.SpringPcStore.security.PaymentSecurity;
import com.ecom.SpringPcStore.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentSecurity paymentSecurity;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<PaymentResponse>> getAllPayments(Pageable pageable) {
        Page<PaymentResponse> payments = paymentService.getAllPayments(pageable);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @paymentSecurity.isPaymentOwner(#id, authentication)")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long id, Authentication authentication) {
        PaymentResponse payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/order/{orderId}")
    @PreAuthorize("hasRole('ADMIN') or @paymentSecurity.isOrderOwner(#orderId, authentication)")
    public ResponseEntity<Page<PaymentResponse>> getPaymentsByOrderId(
            @PathVariable Long orderId, 
            Pageable pageable, 
            Authentication authentication) {
        Page<PaymentResponse> payments = paymentService.getPaymentsByOrderId(orderId, pageable);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByStatus(@PathVariable String status) {
        List<PaymentResponse> payments = paymentService.getPaymentsByStatus(status);
        return ResponseEntity.ok(payments);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentResponse> createPayment(
            @Valid @RequestBody PaymentRequest request, 
            Authentication authentication) {
        // Validate that user owns the order
        if (!paymentSecurity.isOrderOwner(request.getOrderId(), authentication)) {
            throw new RuntimeException("You can only create payments for your own orders");
        }
        
        PaymentResponse payment = paymentService.createPayment(request);
        return ResponseEntity.ok(payment);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse> updatePaymentStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        PaymentResponse updatedPayment = paymentService.updatePaymentStatus(id, status);
        return ResponseEntity.ok(updatedPayment);
    }

    @PutMapping("/{id}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> refundPayment(
            @PathVariable Long id, 
            @RequestParam String reason) {
        paymentService.refundPayment(id, reason);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Payment refunded successfully");
        response.put("paymentId", id);
        response.put("refundReason", reason);
        
        return ResponseEntity.ok(response);
    }

}
