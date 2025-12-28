package com.FoodApp.FoodApplication.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.FoodApp.FoodApplication.entity.UserDetails;

@Repository
public interface UserDetailsRepository extends JpaRepository<UserDetails,Long>
{
      boolean existsByEmail(String email);
      boolean existsByPhoneNumber(String phoneNumber);   
}
