package com.FoodApp.FoodApplication.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.FoodApp.FoodApplication.DTO.FoodDetailsDto;
import com.FoodApp.FoodApplication.DTO.MenuDetailsDto;
import com.FoodApp.FoodApplication.DTO.RestaurantDetailsDto;
import com.FoodApp.FoodApplication.Serivice.FoodService;
import com.FoodApp.FoodApplication.Serivice.MenuService;
import com.FoodApp.FoodApplication.Serivice.RestaurantService;

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
  public List<RestaurantDetailsDto> getAllResturants()//returning all the resturant in present in db
  {
    return service.getAll();
  }  
  @GetMapping("/{id}")
  public ResponseEntity<RestaurantDetailsDto> getResturantById(@PathVariable Long id)
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
}
