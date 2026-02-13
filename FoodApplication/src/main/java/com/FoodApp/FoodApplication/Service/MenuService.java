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
import org.springframework.transaction.annotation.Transactional;

@Service
public class MenuService 
{
    @Autowired
    private MenuDetailsRepository menuDetailsRepository;
     @Autowired
    private RestaurantDetailsRepository restaurantDetailsRepository;
  public List<MenuDetailsDto> getMenuDetails(long Restaurant_Id)
  {
    RestaurantDetails restaurantDetails=restaurantDetailsRepository.findById(Restaurant_Id).orElseThrow(()-> new ResourceNotFoundException("Restaurant with id " + Restaurant_Id + " not found from menu"));
     List<MenuDetails> menuDetailsList= menuDetailsRepository.findByRestaurant(restaurantDetails);
    return toDtoList(menuDetailsList);
  }
  public List<MenuDetailsDto> getAllMenuDetailsDto()
  {
    List<MenuDetails> menuDetailsList= menuDetailsRepository.findAll();
    return toDtoList(menuDetailsList);
  }
   public MenuDetailsDto getMenuDetailsById(Long id)
   {
    MenuDetails menuDetails= menuDetailsRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Menu with id " + id + " not found"));
    return toDto(menuDetails);
   }
   public void addMenu(MenuDetailsDto menuDetailsDto)
   {
       menuDetailsRepository.save(toEntity(menuDetailsDto));
   }
   @Transactional
   public void updateMenu(Long id, MenuDetailsDto menuDetailsDto)
   {
       MenuDetails menuDetails=menuDetailsRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Menu with id " + id + " not found"));
       menuDetails.setSection(menuDetailsDto.getSection());
       RestaurantDetails restaurantDetails=restaurantDetailsRepository.findById(menuDetailsDto.getRestaurantId()).orElseThrow(()->new ResourceNotFoundException("Restaurant with id " + menuDetailsDto.getRestaurantId() + " not found"));
       menuDetails.setRestaurant(restaurantDetails);
   }
   @Transactional
   public void deleteMenu(Long id)
   {
       menuDetailsRepository.deleteById(id);
   }
  
  public MenuDetailsDto toDto(MenuDetails menuDetails)
  {
    MenuDetailsDto dto=new MenuDetailsDto();
        dto.setId(menuDetails.getId());
        dto.setSection(menuDetails.getSection());
        dto.setRestaurantId(menuDetails.getRestaurant().getId());
        return dto;
  }
  public MenuDetails toEntity(MenuDetailsDto menuDetailsDto)
  {
      MenuDetails menuDetails=new MenuDetails();
      if(menuDetailsDto.getRestaurantId()==null)
      {
          throw new IllegalArgumentException("RestaurantId must not be null");
      }
      menuDetails.setSection(menuDetailsDto.getSection());
      RestaurantDetails restaurantDetails=restaurantDetailsRepository.findById(menuDetailsDto.getRestaurantId()).orElseThrow(()->new ResourceNotFoundException("Restaurant with id " + menuDetailsDto.getRestaurantId() + " not found"));
      menuDetails.setRestaurant(restaurantDetails);
      return menuDetails;
  }
  public List<MenuDetailsDto> toDtoList(List<MenuDetails> menuDetailsList)
  {
    List<MenuDetailsDto> menuDetailsDtoList=new ArrayList<>();
    for(MenuDetails x:menuDetailsList) menuDetailsDtoList.add(toDto(x));
    return menuDetailsDtoList;
  }
}
