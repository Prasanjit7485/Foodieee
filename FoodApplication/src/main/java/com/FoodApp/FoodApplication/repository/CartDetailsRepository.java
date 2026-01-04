package com.FoodApp.FoodApplication.repository;
import com.FoodApp.FoodApplication.entity.CartDetails;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface CartDetailsRepository extends JpaRepository<CartDetails,Long>
{

}
