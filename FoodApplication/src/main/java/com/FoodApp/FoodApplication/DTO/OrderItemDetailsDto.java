package com.FoodApp.FoodApplication.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDetailsDto
{
    private Long id;
    private Long orderId;
    private Long foodId;
    private Double price;
}
