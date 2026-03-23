package com.FoodApp.FoodApplication.Service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
   dto.setDescription(restaurantDetails.getDescription());
   dto.setImageFilePath(restaurantDetails.getImageFilePath());
   return dto;
 }
 public RestaurantDetails toEntity(RestaurantDetailsDto restaurantDetailsDto)
 {
     RestaurantDetails restaurantDetails=new RestaurantDetails();
     restaurantDetails.setName(restaurantDetailsDto.getName());
     restaurantDetails.setRating(restaurantDetailsDto.getRating());
     restaurantDetails.setAddress(restaurantDetailsDto.getAddress());
     restaurantDetails.setDescription(restaurantDetailsDto.getDescription());
     restaurantDetails.setImageFilePath(restaurantDetailsDto.getImageFilePath());
     return restaurantDetails;
 }
 public List<RestaurantDetailsDto> toDtoList(List<RestaurantDetails> restaurantDetailsList)
 {
   List<RestaurantDetailsDto> dtoList=restaurantDetailsList.stream().map(this::toDto).toList();
   return dtoList;
 }
 public void addRestaurant(RestaurantDetailsDto restaurantDetailsDto)
 {
     restaurantDetailsRepository.save(toEntity(restaurantDetailsDto));
 }
 public List<RestaurantDetailsDto> getAllRestaurantsByRestaurantName(String restaurantName)
 {
     List<RestaurantDetails> restaurantDetailsList=restaurantDetailsRepository.searchByName(restaurantName);
     return toDtoList(restaurantDetailsList);
 }
 @Transactional
 public RestaurantDetailsDto updateRestaurant(Long id,RestaurantDetailsDto restaurantDetailsDto)
 {
     RestaurantDetails restaurantDetails=restaurantDetailsRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Restaurant with id " + id + " not found"));
     restaurantDetails.setName(restaurantDetailsDto.getName());
     restaurantDetails.setRating(restaurantDetailsDto.getRating());
     restaurantDetails.setImageFilePath(restaurantDetailsDto.getImageFilePath());
     restaurantDetails.setDescription(restaurantDetailsDto.getDescription());
     restaurantDetails.setAddress(restaurantDetailsDto.getAddress());
     return toDto(restaurantDetails);
 }
}
