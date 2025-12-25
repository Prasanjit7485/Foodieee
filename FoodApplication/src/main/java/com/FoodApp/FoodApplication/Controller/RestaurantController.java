package com.FoodApp.FoodApplication.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.FoodApp.FoodApplication.Serivice.MenuService;
import com.FoodApp.FoodApplication.Serivice.RestaurantService;
import com.FoodApp.FoodApplication.entity.RestaurantDetails;
import com.FoodApp.FoodApplication.DTO.MenuDetailsDto;
@RestController
@RequestMapping("/restaurants")
public class RestaurantController 
{
  @Autowired
   RestaurantService service;
  @Autowired
   MenuService menuService;
  @GetMapping("/all")
  public List<RestaurantDetails> getAllResturants()//returning all the resturant in present in db
  {
    return service.getAll();
  }  
  @GetMapping("/{id}")
  public ResponseEntity<RestaurantDetails> getResturantById(@PathVariable Long id)
  {
    return ResponseEntity.ok(service.getId(id));
  } 
  //menu controller 
  @GetMapping("/{id}/menus")
 public ResponseEntity<List<MenuDetailsDto>> getMenuById(@PathVariable Long id)
 {
    return ResponseEntity.ok(menuService.getMenuDetails(id));
 }
}
