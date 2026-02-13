package com.FoodApp.FoodApplication.Controller;
import java.util.*;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import com.FoodApp.FoodApplication.Service.MenuService;
import com.FoodApp.FoodApplication.Service.FoodService;
import com.FoodApp.FoodApplication.DTO.FoodDetailsDto;
import com.FoodApp.FoodApplication.DTO.MenuDetailsDto;
@RestController
@RequestMapping("/menus")
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
     @PostMapping("/add")
     public ResponseEntity<String> addMenu(@Valid @RequestBody MenuDetailsDto menuDetailsDto)
     {
          menuService.addMenu(menuDetailsDto);
          return ResponseEntity.ok("Menu has been added");
     }
     @PutMapping("/update/{id}")
     public ResponseEntity<String> updateMenu(@Valid @RequestBody MenuDetailsDto menuDetailsDto, @PathVariable Long id)
     {
          menuService.updateMenu(id,menuDetailsDto);
          return ResponseEntity.ok(menuDetailsDto.toString());
     }
     @DeleteMapping("/delete/{id}")
     public ResponseEntity<String> deleteMenu(@PathVariable Long id)
     {
          menuService.deleteMenu(id);
          return ResponseEntity.ok("Menu deleted successfully");
     }
}
