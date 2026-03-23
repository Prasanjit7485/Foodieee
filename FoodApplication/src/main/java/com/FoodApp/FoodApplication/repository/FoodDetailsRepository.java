package com.FoodApp.FoodApplication.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.FoodApp.FoodApplication.entity.FoodDetails;
import com.FoodApp.FoodApplication.entity.MenuDetails;
import com.FoodApp.FoodApplication.entity.RestaurantDetails;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.*;
@Repository
public interface FoodDetailsRepository extends JpaRepository<FoodDetails, Long> 
{
    List<FoodDetails> findByRestaurant(RestaurantDetails restaurantId);
    List<FoodDetails> findByMenu(MenuDetails menuId);
    @Query("SELECT f FROM FoodDetails f WHERE f.name LIKE %:name%")
    List<FoodDetails> searchByName(@Param("name") String name);
}
