package com.FoodApp.FoodApplication.Controller;

import java.util.List;

import com.FoodApp.FoodApplication.entity.RestaurantDetails;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.FoodApp.FoodApplication.DTO.FoodDetailsDto;
import com.FoodApp.FoodApplication.DTO.MenuDetailsDto;
import com.FoodApp.FoodApplication.DTO.RestaurantDetailsDto;
import com.FoodApp.FoodApplication.Service.FoodService;
import com.FoodApp.FoodApplication.Service.MenuService;
import com.FoodApp.FoodApplication.Service.RestaurantService;

@RestController
@RequestMapping("/restaurants")
public class RestaurantController 
{
  @Autowired
   RestaurantService service;
  @Autowired
   MenuService menuService;
   @Autowired 
    FoodService foodService;
  @GetMapping("/all")
  public List<RestaurantDetailsDto> getAllRestaurants()//returning all the restaurant in present in db
  {
    return service.getAll();
  }  
  @GetMapping("/{id}")
  public ResponseEntity<RestaurantDetailsDto> getRestaurantById(@PathVariable Long id)
  {
    return ResponseEntity.ok(service.getId(id));
  } 
  //menu controller 
  @GetMapping("/{id}/menus")
 public ResponseEntity<List<MenuDetailsDto>> getMenuById(@PathVariable Long id)
 {
    return ResponseEntity.ok(menuService.getMenuDetails(id));
 }
 @GetMapping("/{id}/foods")
  public ResponseEntity<List<FoodDetailsDto>> getFoodById(@PathVariable Long id)
  {
      return ResponseEntity.ok(foodService.getRestaurantFoodDetailsDto(id));
  }
  @PostMapping("/add")
    public ResponseEntity<String> addRestaurant(@Valid @RequestBody RestaurantDetailsDto restaurantDetailsDto)
  {
      service.addRestaurant(restaurantDetailsDto);
      return ResponseEntity.status(HttpStatus.CREATED).body(restaurantDetailsDto.toString());
  }
  @PutMapping("/update/{id}")
  public ResponseEntity<RestaurantDetailsDto> updateRestaurant(@PathVariable Long id, @Valid @RequestBody RestaurantDetailsDto restaurantDetailsDto)
  {
      return ResponseEntity.ok(service.updateRestaurant(id,restaurantDetailsDto));
  }
}
