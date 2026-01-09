package com.FoodApp.FoodApplication.Service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FoodApp.FoodApplication.DTO.RestaurantDetailsDto;
import com.FoodApp.FoodApplication.entity.RestaurantDetails;
import com.FoodApp.FoodApplication.excepetion.ResourceNotFoundException;
import com.FoodApp.FoodApplication.repository.RestaurantDetailsRepository;
@Service
public class RestaurantService 
{
 @Autowired
 private RestaurantDetailsRepository restaurantDetailsRepository;
 public List<RestaurantDetailsDto> getAll()
 {
    return toDtoList(restaurantDetailsRepository.findAll());
 }  
 public RestaurantDetailsDto getId(Long id)
 {
    RestaurantDetails restaurantDetails=restaurantDetailsRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Restaurant with id " + id + " not found"));
    return toDto(restaurantDetails);
 }
 public RestaurantDetailsDto toDto(RestaurantDetails restaurantDetails)
 {
   RestaurantDetailsDto dto=new RestaurantDetailsDto();
   dto.setId(restaurantDetails.getId());
   dto.setName(restaurantDetails.getName());
   dto.setRating(restaurantDetails.getRating());
   dto.setAddress(restaurantDetails.getAddress());
   return dto;
 } 
 public List<RestaurantDetailsDto> toDtoList(List<RestaurantDetails> restaurantDetailsList)
 {
   List<RestaurantDetailsDto> dtoList=restaurantDetailsList.stream().map(this::toDto).toList();
   return dtoList;
 }
}
