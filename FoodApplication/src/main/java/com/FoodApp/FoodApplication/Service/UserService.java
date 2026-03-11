package com.FoodApp.FoodApplication.Service;
import com.FoodApp.FoodApplication.entity.UserAuthDetails;
import com.FoodApp.FoodApplication.entity.UserProfile;
import com.FoodApp.FoodApplication.repository.UserAuthDetailsRepository;
import jakarta.annotation.Nonnull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FoodApp.FoodApplication.DTO.UserDetailsDto;

import com.FoodApp.FoodApplication.excepetion.ResourceNotFoundException;
import com.FoodApp.FoodApplication.repository.UserDetailsRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Slf4j
public class UserService 
{
     @Autowired
     private UserDetailsRepository userDetailsRepository;
     @Autowired
     private UserAuthDetailsRepository userAuthDetailsRepository;
     public void saveUserDetails(UserDetailsDto userDetailsDto)
     {
        log.info("Saving user details: {}", userDetailsDto);
        if(userDetailsRepository.existsByPhoneNumber(userDetailsDto.getPhoneNumber())) {
            throw new ResourceNotFoundException("Phone number already exists: " + userDetailsDto.getPhoneNumber());
        }
           userDetailsRepository.save(toEntity(userDetailsDto));
     }
     public UserDetailsDto getUserDetailsById(Long id)
     {
        UserProfile userDetails=userDetailsRepository.findById(id).orElseThrow(()->new RuntimeException("User not found"+id));
        return toDto(userDetails);
     }
     public List<UserDetailsDto> getALlUserDetailsDto()
     {
        List<UserProfile> userList=userDetailsRepository.findAll();
        List<UserDetailsDto> dtoList=new ArrayList<>();
        for(UserProfile userDetails:userList)
        {
            dtoList.add(toDto(userDetails));
        }
        return dtoList;
     }
    @Transactional
     public void updateProfile(@Nonnull UserDetailsDto userDetailsDto)
     {
         UserProfile userProfile=userDetailsRepository.findById(userDetailsDto.getId()).orElseThrow(()->new RuntimeException("User not found"+userDetailsDto.getId()));
         userProfile.setName(userDetailsDto.getName());
         userProfile.setAddress(userDetailsDto.getAddress());
         userProfile.setPhoneNumber(userDetailsDto.getPhoneNumber());
         userProfile.setAge(userDetailsDto.getAge());
     }
     public UserDetailsDto toDto(UserProfile userDetails)
     {
        UserDetailsDto dto=new UserDetailsDto();
        dto.setId(userDetails.getId());
        dto.setName(userDetails.getName());
        dto.setAge(userDetails.getAge());
        dto.setPhoneNumber(userDetails.getPhoneNumber());
        dto.setAddress(userDetails.getAddress());
        dto.setUserAuthId(userDetails.getUserAuthDetails().getId());
        return dto;
     }
     public UserProfile toEntity(UserDetailsDto userDetailsDto)
     {
        UserProfile userDetails=new UserProfile();
        userDetails.setName(userDetailsDto.getName());
        userDetails.setAge(userDetailsDto.getAge());
        userDetails.setPhoneNumber(userDetailsDto.getPhoneNumber());
        userDetails.setAddress(userDetailsDto.getAddress());
        UserAuthDetails userAuthDetails=userAuthDetailsRepository.findById(userDetailsDto.getUserAuthId()).orElseThrow(()->new RuntimeException("UserAuthDetails not found"+userDetailsDto.getUserAuthId()));;
        userDetails.setUserAuthDetails(userAuthDetails);
        return userDetails;
     }
}
