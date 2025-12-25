package com.FoodApp.FoodApplication.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.FoodApp.FoodApplication.Serivice.RestaurantService;
import com.FoodApp.FoodApplication.entity.RestaurantDetails;
@RestController
@RequestMapping("/resturants")
public class RestaurantController 
{
  @Autowired
   RestaurantService service;
  @GetMapping("/all")
  public List<RestaurantDetails> getAllResturants()
  {
    return service.getAll();
  }  
  @GetMapping("/{id}")
  public RestaurantDetails getResturantById(@PathVariable Long id)
  {
    return service.getId(id);
  } 
}
