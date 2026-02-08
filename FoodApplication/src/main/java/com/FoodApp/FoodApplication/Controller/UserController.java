package com.FoodApp.FoodApplication.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
    
}
