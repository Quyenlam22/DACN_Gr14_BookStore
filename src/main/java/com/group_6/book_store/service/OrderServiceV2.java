package com.group_6.book_store.service;

import com.group_6.book_store.dto.OrderDTO;
import com.group_6.book_store.entity.Book;
import com.group_6.book_store.entity.Order;
import com.group_6.book_store.entity.OrderItem;
import com.group_6.book_store.entity.User;
import com.group_6.book_store.form.OrderCreateForm;
import com.group_6.book_store.form.OrderItemForm;
import com.group_6.book_store.mapper.OrderMapper;
import com.group_6.book_store.repository.BookRepository;
import com.group_6.book_store.repository.OrderRepository;
import com.group_6.book_store.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceV2 {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final OrderMapper orderMapper;

    public OrderServiceV2(OrderRepository orderRepository, UserRepository userRepository,
                          BookRepository bookRepository, OrderMapper orderMapper) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.orderMapper = orderMapper;
    }

    public Page<OrderDTO> getOrdersByUserId(Long userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable)
                .map(orderMapper::toDTO);
    }

    @Transactional
    public OrderDTO createOrder(Long userId, OrderCreateForm form) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.UNPROCESSED);
        order.setFullName(form.getFullName());
        order.setPhone(form.getPhone());
        order.setAddress(form.getAddress());
        order.setCartId(form.getCartId()); // Thêm ánh xạ cartId

        // Kiểm tra số lượng đơn hàng hiện tại để xác định itemSequence
        long existingOrderCount = orderRepository.countByUserId(userId);
        int itemSequenceStart = (existingOrderCount == 0) ? 1 : 1; // Bắt đầu từ 1 cho mỗi đơn hàng mới

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        int itemSequence = itemSequenceStart;

        for (OrderItemForm itemForm : form.getOrderItems()) {
            Book book = bookRepository.findById(itemForm.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found with id: " + itemForm.getBookId()));

            if (book.getStock() < itemForm.getQuantity()) {
                throw new RuntimeException("Insufficient stock for book: " + book.getTitle());
            }

            // Kiểm tra giá unitPrice khớp với giá sách
            if (book.getPrice().compareTo(itemForm.getUnitPrice()) != 0) {
                throw new RuntimeException("Unit price does not match book price for: " + book.getTitle());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setBook(book);
            orderItem.setQuantity(itemForm.getQuantity());
            orderItem.setUnitPrice(itemForm.getUnitPrice());
            orderItem.setDiscount(book.getDiscount());
            orderItem.setItemSequence(itemSequence++);

            // Tính discount và tổng tiền
            BigDecimal discountAmount = orderItem.getUnitPrice()
                    .multiply(orderItem.getDiscount().divide(new BigDecimal("100"), 2, BigDecimal.ROUND_HALF_UP));
            BigDecimal discountedPrice = orderItem.getUnitPrice().subtract(discountAmount);
            totalAmount = totalAmount.add(discountedPrice.multiply(new BigDecimal(itemForm.getQuantity())));

            orderItems.add(orderItem);

            // Cập nhật stock
            book.setStock(book.getStock() - itemForm.getQuantity());
            bookRepository.save(book);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);

        return orderMapper.toDTO(order);
    }
}