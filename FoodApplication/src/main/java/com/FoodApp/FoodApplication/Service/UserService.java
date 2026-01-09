package com.FoodApp.FoodApplication.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FoodApp.FoodApplication.DTO.UserDetailsDto;
import com.FoodApp.FoodApplication.entity.UserDetails;
import com.FoodApp.FoodApplication.excepetion.ResourceNotFoundException;
import com.FoodApp.FoodApplication.repository.UserDetailsRepository;

import lombok.extern.slf4j.Slf4j;

import java.util.*;

@Service
@Slf4j
public class UserService 
{
     @Autowired
     private UserDetailsRepository userDetailsRepository;
     public void saveUserDetails(UserDetailsDto userDetailsDto)
     {
        log.info("Saving user details: {}", userDetailsDto);
         if(userDetailsRepository.existsByEmail(userDetailsDto.getPhoneNumber())) {
            throw new ResourceNotFoundException("Email already exists: " + userDetailsDto.getPhoneNumber());
        }
        if(userDetailsRepository.existsByPhoneNumber(userDetailsDto.getPhoneNumber())) {
            throw new ResourceNotFoundException("Phone number already exists: " + userDetailsDto.getPhoneNumber());
        }
           userDetailsRepository.save(toEntity(userDetailsDto));
     }
     public UserDetailsDto getUserDetailsById(Long id)
     {
        UserDetails userDetails=userDetailsRepository.findById(id).orElseThrow(()->new RuntimeException("User not found"+id));
        return toDto(userDetails);
     }
     public List<UserDetailsDto> getALlUserDetailsDto()
     {
        List<UserDetails> userList=userDetailsRepository.findAll();
        List<UserDetailsDto> dtoList=new ArrayList<>();
        for(UserDetails userDetails:userList)
        {
            dtoList.add(toDto(userDetails));
        }
        return dtoList;
     }
     public UserDetailsDto toDto(UserDetails userDetails)
     {
        UserDetailsDto dto=new UserDetailsDto();
        dto.setId(userDetails.getId());
        dto.setName(userDetails.getName());
        dto.setAge(userDetails.getAge());
        dto.setEmail(userDetails.getEmail());
        dto.setPassword(userDetails.getPassword());
        dto.setPhoneNumber(userDetails.getPhoneNumber());
        dto.setAddress(userDetails.getAddress());
        return dto;
     }
     public UserDetails toEntity(UserDetailsDto userDetailsDto)
     {
        UserDetails userDetails=new UserDetails();
        userDetails.setName(userDetailsDto.getName());
        userDetails.setAge(userDetailsDto.getAge());
        userDetails.setEmail(userDetailsDto.getEmail());
        userDetails.setPassword(userDetailsDto.getPassword());
        userDetails.setPhoneNumber(userDetailsDto.getPhoneNumber());
        userDetails.setAddress(userDetailsDto.getAddress());
        return userDetails;
     }
}
