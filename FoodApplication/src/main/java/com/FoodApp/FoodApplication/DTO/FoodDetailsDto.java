package com.FoodApp.FoodApplication.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class FoodDetailsDto 
{
    private Long id; 
    @NotBlank
    private String name;
    @Positive
    private Double price;
    private Double rating;
    private String imageFilePath;
    private String description;
    private Boolean isVeg;
    private Boolean bestseller;
    @NotNull
    private Long menuId;
    @NotNull
    private Long restaurantId;
}
