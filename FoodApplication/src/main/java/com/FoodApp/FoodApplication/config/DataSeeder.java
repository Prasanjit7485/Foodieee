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
        MenuDetails m1=new MenuDetails();
        m1.setSection("Breakfast");
        m1.setRestaurant(r1);
         MenuDetails m2=new MenuDetails();
        m2.setSection("Lunch");
        m2.setRestaurant(r1);
         MenuDetails m3=new MenuDetails();
        m3.setSection("Dinner");
        m3.setRestaurant(r1);
         MenuDetails m4=new MenuDetails();
        m4.setSection("Breakfast");
        m4.setRestaurant(r2);
         MenuDetails m5=new MenuDetails();
        m5.setSection("Dinner");
        m5.setRestaurant(r2);
         MenuDetails m6=new MenuDetails();
        m6.setSection("Lunch");
        m6.setRestaurant(r3);
         MenuDetails m7=new MenuDetails();
        m7.setSection("Dinner");
        m7.setRestaurant(r3);
      menu.save(m1);
      menu.save(m2);
      menu.save(m3);
      menu.save(m4);
      menu.save(m5);
      menu.save(m6);
      menu.save(m7);
    };

  }  
}
