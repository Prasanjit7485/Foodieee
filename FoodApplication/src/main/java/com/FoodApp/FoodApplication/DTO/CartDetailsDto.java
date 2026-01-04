package com.FoodApp.FoodApplication.DTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartDetailsDto {
    private Long id;
    private Long userId;
    private List<CartItemDetailsDto> items=new ArrayList<>();
    private Double totalPrice;
}
