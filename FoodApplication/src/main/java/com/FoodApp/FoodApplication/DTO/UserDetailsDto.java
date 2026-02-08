package com.FoodApp.FoodApplication.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDetailsDto 
{
   private Long id;
   private String name;
   private Integer age;
   private String phoneNumber;
   private String address;
   private Long UserAuthId;
}
