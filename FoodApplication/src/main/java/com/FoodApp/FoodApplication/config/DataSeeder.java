package com.FoodApp.FoodApplication.config;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.FoodApp.FoodApplication.entity.RestaurantDetails;
import com.FoodApp.FoodApplication.repository.RestaurantDetailsRepository;
@Configuration
public class DataSeeder 
{
  @Bean 
  @SuppressWarnings("unused")
  CommandLineRunner seedRestaurants(RestaurantDetailsRepository repository)
  {return args ->
    {
        RestaurantDetails r1=new RestaurantDetails();
        r1.setName("Spice Hub");
        r1.setRating(4.5);
        r1.setAddress("Salt lake,Kolkata");
        RestaurantDetails r2=new RestaurantDetails();
        r2.setName("Domino's");
        r2.setRating(4.2);
        r2.setAddress("Park Street,Kolkata");
        RestaurantDetails r3=new RestaurantDetails();
        r3.setName("Spice Hub");
        r3.setRating(4.0);
        r3.setAddress("New Town,Kolkata");

        repository.save(r1);
        repository.save(r2);
        repository.save(r3);
    };

  }  
}
