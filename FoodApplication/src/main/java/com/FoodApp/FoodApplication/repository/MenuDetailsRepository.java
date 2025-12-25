package com.FoodApp.FoodApplication.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
import com.FoodApp.FoodApplication.entity.MenuDetails;
import com.FoodApp.FoodApplication.entity.RestaurantDetails;
import org.springframework.stereotype.Repository;
@Repository
public interface MenuDetailsRepository extends JpaRepository<MenuDetails, Long>
{
   List<MenuDetails> findByRestaurant(RestaurantDetails restaurantId);
}
