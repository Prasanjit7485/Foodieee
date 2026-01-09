package com.FoodApp.FoodApplication.repository;


import com.FoodApp.FoodApplication.DTO.OrderDetailsDto;
import com.FoodApp.FoodApplication.DTO.OrderItemDetailsDto;
import com.FoodApp.FoodApplication.entity.OrderItemsDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemDetailsRepository extends JpaRepository<OrderItemsDetails,Long>
{
    @Query("""
SELECT new com.FoodApp.FoodApplication.DTO.OrderItemDetailsDto(
      oi.id,
      o.id,
      f.id,
      f.price
)
FROM OrderItemsDetails oi
JOIN oi.foodDetails f
JOIN oi.orderDetails o
WHERE oi.orderDetails.id=:orderId
""")
    List<OrderItemDetailsDto> findCartDtosByCartId(@Param("orderId") Long orderId);

}
