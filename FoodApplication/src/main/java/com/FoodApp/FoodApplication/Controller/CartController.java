package com.FoodApp.FoodApplication.Controller;

import com.FoodApp.FoodApplication.DTO.CartDetailsDto;
import com.FoodApp.FoodApplication.DTO.CartItemDetailsDto;
import com.FoodApp.FoodApplication.Service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/cart")
public class CartController 
{
    @Autowired
    CartService cartService;
    @PostMapping("/addItems")
    public ResponseEntity<String> addToCart(@Valid @RequestBody CartItemDetailsDto cartItemDetailsDto)
    {
          cartService.addToCart(cartItemDetailsDto);
          return ResponseEntity.ok("Item added to cart Successfully");      
    }
    @PostMapping("/addCart")
    public ResponseEntity<String> createCart(@Valid @RequestBody CartDetailsDto cartDetailsDto)
    {
        cartService.createCart(cartDetailsDto);
        return ResponseEntity.ok("Cart created Successfully");
    }
    @GetMapping("/all")
    public ResponseEntity<List<CartItemDetailsDto>> getCartItemDetails() {
        return ResponseEntity.ok(cartService.getCartItemDetails());
    }
    @GetMapping("/details/{cartId}")
    public ResponseEntity<CartDetailsDto> getCartDetails(@PathVariable Long cartId)
    {
        return ResponseEntity.ok(cartService.getCartDetails(cartId));
    }
    @PutMapping("/updateItems/{cartItemId}")
    public ResponseEntity<String> updateCartItem(@PathVariable Long cartItemId, @RequestBody CartItemDetailsDto cartItemDetailsDto)
    {
        cartService.updateCartItem(cartItemId,cartItemDetailsDto);
        return ResponseEntity.ok("Cart Item updated Successfully");
    }
    @DeleteMapping("/deleteItems/{cartItemId}")
    public ResponseEntity<String> deleteCartItem(@PathVariable Long cartItemId)
    {
        cartService.deleteCartItem(cartItemId);
        return ResponseEntity.ok("Cart Item deleted Successfully");
    }
    @DeleteMapping("/clear/{cartId}")
    public ResponseEntity<String> deleteCart(@PathVariable Long cartId)
    {
        cartService.clearCart(cartId);
        return ResponseEntity.ok("Cart deleted Successfully");
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<CartDetailsDto> getUserCartDetails(@PathVariable Long userId)
    {
        return ResponseEntity.ok(cartService.getCartDetailsByUserId(userId));
    }
}
