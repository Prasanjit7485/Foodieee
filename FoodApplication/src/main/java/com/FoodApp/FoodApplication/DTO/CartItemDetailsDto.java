package com.FoodApp.FoodApplication.DTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDetailsDto {
    private Long id;
    private Long cartId;
    private Long foodId;
    private int quantity;
    private double price;
}
