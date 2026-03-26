package com.FoodApp.FoodApplication.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.FoodApp.FoodApplication.DTO.OrderItemDetailsDto;
import com.FoodApp.FoodApplication.entity.OrderItemsDetails;

@Repository
public interface OrderItemDetailsRepository extends JpaRepository<OrderItemsDetails,Long>
{
    @Query("""
SELECT new com.FoodApp.FoodApplication.DTO.OrderItemDetailsDto(
      oi.id,
      o.id,
      f.id,
      f.price,
      oi.quantity
      
)
FROM OrderItemsDetails oi
JOIN oi.foodDetails f
JOIN oi.orderDetails o
WHERE oi.orderDetails.id=:orderId
""")
    List<OrderItemDetailsDto> findCartDtosByCartId(@Param("orderId") Long orderId);

    //List<OrderItemsDetails> findByOrderDetails(OrderDetails orderDetails);
}
