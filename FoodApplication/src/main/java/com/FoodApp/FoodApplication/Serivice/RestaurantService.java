package com.FoodApp.FoodApplication.Serivice;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.FoodApp.FoodApplication.excepetion.ResourceNotFoundException;
import com.FoodApp.FoodApplication.entity.RestaurantDetails;
import com.FoodApp.FoodApplication.repository.RestaurantDetailsRepository;
@Service
public class RestaurantService 
{
 @Autowired
 private RestaurantDetailsRepository restaurantDetailsRepository;
 public List<RestaurantDetails> getAll()
 {
    return restaurantDetailsRepository.findAll();
 }  
 public RestaurantDetails getId(Long id)
 {
    RestaurantDetails restaurantDetails=restaurantDetailsRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Restaurant with id " + id + " not found"));
    return restaurantDetails;
 } 
}
