package com.FoodApp.FoodApplication.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.FoodApp.FoodApplication.Service.UserAuthService;
import com.FoodApp.FoodApplication.entity.UserAuthDetails;

@RestController
@RequestMapping("/api")
public class UserAuthController
{
    @Autowired
    private UserAuthService userAuthService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @PostMapping("/user-register")
    public ResponseEntity<String> register(@RequestBody UserAuthDetails userAuthDetails)
    {
        userAuthDetails.setPassword(passwordEncoder.encode(userAuthDetails.getPassword()));
        userAuthService.save(userAuthDetails);
        return ResponseEntity.ok("User registered successfully");
    }
    @GetMapping("/users")
    public ResponseEntity<String> getUsers()
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok("fetched users details successfully");
    }
}
