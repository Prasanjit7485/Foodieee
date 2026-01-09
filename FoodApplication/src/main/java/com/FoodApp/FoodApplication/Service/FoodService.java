
package com.FoodApp.FoodApplication.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FoodApp.FoodApplication.DTO.FoodDetailsDto;
import com.FoodApp.FoodApplication.entity.FoodDetails;
import com.FoodApp.FoodApplication.entity.MenuDetails;
import com.FoodApp.FoodApplication.entity.RestaurantDetails;
import com.FoodApp.FoodApplication.excepetion.ResourceNotFoundException;
import com.FoodApp.FoodApplication.repository.FoodDetailsRepository;
import com.FoodApp.FoodApplication.repository.MenuDetailsRepository;
import com.FoodApp.FoodApplication.repository.RestaurantDetailsRepository;

import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
public class FoodService 
{

    
    @Autowired
    private FoodDetailsRepository foodDetailsRepository;
    @Autowired 
    private MenuDetailsRepository menuDetailsRepository;
    @Autowired
    private RestaurantDetailsRepository restaurantDetailsRepository;
     //Saving food details
    @SuppressWarnings("null")
    public void saveFoodDetails(FoodDetailsDto foodDetailsDto)
    {
        log.info("Saving food details: {}", foodDetailsDto);
        FoodDetails foodDetails=toEntity(foodDetailsDto);
        foodDetailsRepository.save(foodDetails);
    }
    //Getting food details by id
    public FoodDetailsDto getFoodDetailsById(Long id)
    {
        FoodDetails foodDetails=foodDetailsRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Food with id " + id + " not found"));
        return toDto(foodDetails);
    }
    //Getting all food details
    public List<FoodDetailsDto> getAllFoodDetailsDto()
    {
        List<FoodDetails> foodList=foodDetailsRepository.findAll();
        List<FoodDetailsDto> dtoList=new ArrayList<>();
        for(FoodDetails foodDetails:foodList)
        {
            dtoList.add(toDto(foodDetails));
        }
        return dtoList;
    }
    //Getting food details by restaurant id
     public List<FoodDetailsDto> getRestaurantFoodDetailsDto(Long resturantId)
     {
        List<FoodDetails> foodList=foodDetailsRepository.findByRestaurant(restaurantDetailsRepository.findById(resturantId).orElseThrow(()-> new ResourceNotFoundException("Restaurant with id " + resturantId + " not found")));
         List<FoodDetailsDto> dtoList=new ArrayList<>();
        for(FoodDetails foodDetails:foodList)
        {
            dtoList.add(toDto(foodDetails));
        }
        return dtoList;
     }
     //Getting food details by menu id
     public List<FoodDetailsDto> getFoodDetailsByMenuId(Long menuId)
     {
        List<FoodDetails> foodList=foodDetailsRepository.findByMenu(menuDetailsRepository.findById(menuId).orElseThrow(()-> new ResourceNotFoundException("Menu with id " + menuId + " not found")));
         List<FoodDetailsDto> dtoList=new ArrayList<>();
        for(FoodDetails foodDetails:foodList)
        {
            dtoList.add(toDto(foodDetails));
        }
        return dtoList;
     }
     
    public FoodDetailsDto toDto(FoodDetails foodDetails)
    {
        FoodDetailsDto dto=new FoodDetailsDto();
        dto.setId(foodDetails.getId());
        dto.setName(foodDetails.getName());
        dto.setPrice(foodDetails.getPrice());
        dto.setDescription(foodDetails.getDescription());
        dto.setAvailable(foodDetails.getAvailable());
        dto.setMenuId(foodDetails.getMenu().getId());
        dto.setRestaurantId(foodDetails.getRestaurant().getId());
        return dto;
    }
    public FoodDetails toEntity(FoodDetailsDto dto)
    {
        FoodDetails foodDetails=new FoodDetails();
        foodDetails.setName(dto.getName());
        foodDetails.setPrice(dto.getPrice());
        foodDetails.setDescription(dto.getDescription());
        foodDetails.setAvailable(dto.getAvailable());
        @SuppressWarnings("null")
        MenuDetails menuDetails=menuDetailsRepository.findById(dto.getMenuId()).orElseThrow(()-> new ResourceNotFoundException("Menu with id " + dto.getMenuId() + " not found"));
        foodDetails.setMenu(menuDetails);
        @SuppressWarnings("null")
        RestaurantDetails restuarantDetails=restaurantDetailsRepository.findById(dto.getRestaurantId()).orElseThrow(()->new ResourceNotFoundException("Restaurant with id " + dto.getRestaurantId() + " not found"));
        foodDetails.setRestaurant(restuarantDetails);
        return foodDetails;
    }

}
