package com.FoodApp.FoodApplication.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.FoodApp.FoodApplication.entity.RestaurantDetails;
@Repository
public interface RestaurantDetailsRepository extends JpaRepository<RestaurantDetails, Long>
{
    
}
