package com.FoodApp.FoodApplication.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.FoodApp.FoodApplication.DTO.UserDetailsDto;
import com.FoodApp.FoodApplication.Service.UserService;


@RestController 
@RequestMapping("/profile")
public class UserController 
{
    @Autowired
    UserService userService;
    @PostMapping("/save")
    public ResponseEntity<String> saveUserDetails(@Valid @RequestBody UserDetailsDto userDetailsDto)
    {
        userService.saveUserDetails(userDetailsDto);
        return ResponseEntity.ok("User details saved successfully");
    }
    @GetMapping("/{id}")
    public ResponseEntity<UserDetailsDto> getUserDetailsById(@PathVariable Long id)
    {
        UserDetailsDto dto=userService.getUserDetailsById(id);
        return ResponseEntity.ok(dto);
    }
    @GetMapping("/all")
    public ResponseEntity<List<UserDetailsDto>> getAllUserDetails()
    {
        List<UserDetailsDto> userList=userService.getALlUserDetailsDto();
        return ResponseEntity.ok(userList);
    }
    @PutMapping("/update")
    public ResponseEntity<String> updateUserProfile(@Valid @RequestBody UserDetailsDto userDetailsDto)
    {
        userService.updateProfile(userDetailsDto);
        return ResponseEntity.ok("User details updated successfully");
    }
    
}
