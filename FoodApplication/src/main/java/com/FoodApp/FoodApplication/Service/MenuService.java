package com.FoodApp.FoodApplication.Service;
import java.util.*;
import com.FoodApp.FoodApplication.entity.MenuDetails;
import com.FoodApp.FoodApplication.entity.RestaurantDetails;
import com.FoodApp.FoodApplication.excepetion.ResourceNotFoundException;
import com.FoodApp.FoodApplication.DTO.MenuDetailsDto;
import org.springframework.beans.factory.annotation.Autowired;
import com.FoodApp.FoodApplication.repository.MenuDetailsRepository;
import com.FoodApp.FoodApplication.repository.RestaurantDetailsRepository;

import org.springframework.stereotype.Service;
@Service
public class MenuService 
{
    @Autowired
    private MenuDetailsRepository menuDetailsRespository;
     @Autowired
    private RestaurantDetailsRepository restaurantDetailsRepository;
  public List<MenuDetailsDto> getMenuDetails(long Resturant_Id)
  {
    RestaurantDetails restaurantDetails=restaurantDetailsRepository.findById(Resturant_Id).orElseThrow(()-> new ResourceNotFoundException("Restaurant with id " + Resturant_Id + " not found from menu"));
     List<MenuDetails> menuDetailsList=menuDetailsRespository.findByRestaurant(restaurantDetails);
    return toDtoList(menuDetailsList);
  }
  public List<MenuDetailsDto> getAllMenuDetailsDto()
  {
    List<MenuDetails> menuDetailsList=menuDetailsRespository.findAll();
    return toDtoList(menuDetailsList);
  }
   public MenuDetailsDto getMenuDetailsById(Long id)
   {
    MenuDetails menuDetails=menuDetailsRespository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Menu with id " + id + " not found"));
    return toDto(menuDetails);
   }
  
  public MenuDetailsDto toDto(MenuDetails menuDetails)
  {
    MenuDetailsDto dto=new MenuDetailsDto();
        dto.setId(menuDetails.getId());
        dto.setSection(menuDetails.getSection());
        dto.setRestaurantId(menuDetails.getRestaurant().getId());
        return dto;
  } 
  public List<MenuDetailsDto> toDtoList(List<MenuDetails> menuDetailsList)
  {
    List<MenuDetailsDto> menuDetailsDtoList=new ArrayList<>();
    for(MenuDetails x:menuDetailsList) menuDetailsDtoList.add(toDto(x));
    return menuDetailsDtoList;
  }
}
