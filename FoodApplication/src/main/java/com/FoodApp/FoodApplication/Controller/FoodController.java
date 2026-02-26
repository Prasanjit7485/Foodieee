package com.FoodApp.FoodApplication.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.FoodApp.FoodApplication.DTO.FoodDetailsDto;
import com.FoodApp.FoodApplication.Service.FoodService;

import jakarta.validation.Valid;
@RestController
@RequestMapping("/restaurants/foods")
public class FoodController 
{
    @Autowired 
    FoodService service;
 @PostMapping("/save")
 public ResponseEntity<String> saveFoodDetails(@Valid @RequestBody FoodDetailsDto foodDetailsDto)
 {
    service.saveFoodDetails(foodDetailsDto);
    return ResponseEntity.ok("Food details saved successfully");
 }
 @PutMapping("/update/id")

 @GetMapping("/{id}")
 public ResponseEntity<FoodDetailsDto> getFoodDetailsById(@PathVariable Long id)
 {
    FoodDetailsDto dto=service.getFoodDetailsById(id);
    return ResponseEntity.ok(dto);
 }
 @GetMapping("/all")
 public ResponseEntity<List<FoodDetailsDto>> getAllFoodDetails()
 {
        List<FoodDetailsDto> foodList=service.getAllFoodDetailsDto();
        return ResponseEntity.ok(foodList);
 }
 
}
