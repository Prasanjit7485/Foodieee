package com.FoodApp.FoodApplication.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.FoodApp.FoodApplication.entity.RestaurantDetails;

import java.util.List;

@Repository
public interface RestaurantDetailsRepository extends JpaRepository<RestaurantDetails, Long>
{
    @Query("SELECT f FROM RestaurantDetails f WHERE f.name LIKE %:name%")
    List<RestaurantDetails> searchByName(@Param("name") String name);
}
