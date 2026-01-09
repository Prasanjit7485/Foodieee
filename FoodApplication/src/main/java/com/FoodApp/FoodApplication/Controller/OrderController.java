package com.FoodApp.FoodApplication.Controller;


import com.FoodApp.FoodApplication.DTO.OrderDetailsDto;
import com.FoodApp.FoodApplication.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController
{
    @Autowired
    OrderService orderService;
    @PostMapping("/place/{userId}")
    public ResponseEntity<String> placeOrder(@PathVariable long userId)
    {
        orderService.placeOrder(userId);
        return ResponseEntity.ok("Order has been placed Successfully");
    }
    @GetMapping("/details/{userId}")
    public ResponseEntity<List<OrderDetailsDto>> getOrderDetails(@PathVariable long userId)
    {
        return  ResponseEntity.ok(orderService.getOrderDetailsByUserId(userId));
    }
}
