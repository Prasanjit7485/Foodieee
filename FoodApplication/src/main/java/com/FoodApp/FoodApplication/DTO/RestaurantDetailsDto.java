package com.FoodApp.FoodApplication.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RestaurantDetailsDto 
{
      private Long id;
      private String name;
      private Double rating;
      private String address; 
}
