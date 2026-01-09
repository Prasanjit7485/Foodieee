package com.FoodApp.FoodApplication.config;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.FoodApp.FoodApplication.entity.RestaurantDetails;
import com.FoodApp.FoodApplication.entity.MenuDetails;
import com.FoodApp.FoodApplication.repository.RestaurantDetailsRepository;
import com.FoodApp.FoodApplication.repository.MenuDetailsRepository;
@Configuration
public class DataSeeder 
{
  @Bean 
  CommandLineRunner seedRestaurants(RestaurantDetailsRepository repository,MenuDetailsRepository menu)
  {return args ->
    {
        //msql has been created
    };

  }  
}
