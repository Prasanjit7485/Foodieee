package com.FoodApp.FoodApplication.repository;

import com.FoodApp.FoodApplication.entity.UserProfile;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public interface UserDetailsRepository extends JpaRepository<UserProfile,Long>
{
      boolean existsByPhoneNumber(String phoneNumber);   
}
