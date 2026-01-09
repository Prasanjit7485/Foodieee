package com.FoodApp.FoodApplication.Controller;
import java.util.*;

import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.FoodApp.FoodApplication.Service.MenuService;
import com.FoodApp.FoodApplication.Service.FoodService;
import com.FoodApp.FoodApplication.DTO.FoodDetailsDto;
import com.FoodApp.FoodApplication.DTO.MenuDetailsDto;
@RestController
@RequestMapping("/restaurants/menus")
public class MenuController 
{
     @Autowired
     MenuService menuService;
     @Autowired
     FoodService foodService;
     @GetMapping("/{id}")
     public ResponseEntity<MenuDetailsDto> getManyId(@PathVariable Long id)
     {
        return ResponseEntity.ok(menuService.getMenuDetailsById(id));
     }
     @GetMapping("/all")
     public ResponseEntity<List<MenuDetailsDto>> getAllMenus()
     {
        return ResponseEntity.ok(menuService.getAllMenuDetailsDto());
     }
     @GetMapping("/{id}/foods")
     public ResponseEntity<List<FoodDetailsDto>> getFoodbyMenuId(@PathVariable Long id)
     {
        return ResponseEntity.ok(foodService.getFoodDetailsByMenuId(id));
     }
}
