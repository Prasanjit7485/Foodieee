package com.FoodApp.FoodApplication.repository;

import com.FoodApp.FoodApplication.DTO.CartItemDetailsDto;
import com.FoodApp.FoodApplication.entity.CartItemDetails;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface CartItemDetailsRepository extends JpaRepository<CartItemDetails,Long>{
    @Query("""
SELECT new com.FoodApp.FoodApplication.DTO.CartItemDetailsDto(
    ci.id,
    ci.cart.id,
    f.id,
    ci.quantity,
    f.price * ci.quantity
)
FROM CartItemDetails ci
JOIN ci.food f
JOIN ci.cart c
""")
    List<CartItemDetailsDto> findAllDtos();
    @Query("""
SELECT new com.FoodApp.FoodApplication.DTO.CartItemDetailsDto(
    ci.id,
    ci.cart.id,
    f.id,
    ci.quantity,
    f.price * ci.quantity
)
FROM CartItemDetails ci
JOIN ci.food f
JOIN ci.cart c
WHERE ci.cart.id=:cartId
""")
    List<CartItemDetailsDto> findCartDtosByCartId(@Param("cartId") Long cartId);
}
