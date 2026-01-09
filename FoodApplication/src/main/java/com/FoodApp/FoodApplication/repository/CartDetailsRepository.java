package com.FoodApp.FoodApplication.repository;
import com.FoodApp.FoodApplication.entity.CartDetails;
import com.FoodApp.FoodApplication.entity.UserDetails;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface CartDetailsRepository extends JpaRepository<CartDetails,Long>
{
   CartDetails findByUser(UserDetails userDetails);
}
