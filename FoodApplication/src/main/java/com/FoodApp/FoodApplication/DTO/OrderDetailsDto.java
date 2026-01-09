package com.FoodApp.FoodApplication.DTO;

import com.FoodApp.FoodApplication.Enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailsDto
{
    private Long id;
    private Long userId;
    private Double totalAmount;
    private OrderStatus status;
    private LocalDateTime orderTime;
    private List<OrderItemDetailsDto> OrderItemDetailsDto=new ArrayList<>();
}
