package com.group_6.book_store.controller;

import com.group_6.book_store.dto.OrderDTO;
import com.group_6.book_store.form.OrderCreateForm;
import com.group_6.book_store.service.OrderServiceV2;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2")
public class OrderControllerV2 {

    private final OrderServiceV2 orderServiceV2;

    public OrderControllerV2(OrderServiceV2 orderServiceV2) {
        this.orderServiceV2 = orderServiceV2;
    }

    @GetMapping("/orders/users/{userId}")
    public ResponseEntity<Page<OrderDTO>> getOrdersByUserId(@PathVariable Long userId, Pageable pageable) {
        Page<OrderDTO> orders = orderServiceV2.getOrdersByUserId(userId, pageable);
        return ResponseEntity.ok(orders);
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderCreateForm form, @RequestParam Long userId) {
        OrderDTO order = orderServiceV2.createOrder(userId, form);
        return ResponseEntity.ok(order);
    }
}