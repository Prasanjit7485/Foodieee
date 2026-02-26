package com.FoodApp.FoodApplication.DTO;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RestaurantDetailsDto 
{
      private Long id;
      private String name;
      private Double rating;
      private String imageFilePath;
      private String description;
      private String address; 
      private List<FoodDetailsDto> foodList=new ArrayList<>();
}
