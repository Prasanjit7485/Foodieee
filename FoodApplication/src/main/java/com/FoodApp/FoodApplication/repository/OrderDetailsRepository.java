package com.FoodApp.FoodApplication.repository;

import com.FoodApp.FoodApplication.DTO.OrderDetailsDto;
import com.FoodApp.FoodApplication.entity.OrderDetails;
import com.FoodApp.FoodApplication.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailsRepository extends JpaRepository<OrderDetails,Long>
{
    List<OrderDetails> findByUserProfile(UserProfile userProfile);
}
