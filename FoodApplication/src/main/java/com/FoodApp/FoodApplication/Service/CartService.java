package com.FoodApp.FoodApplication.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.FoodApp.FoodApplication.DTO.CartDetailsDto;
import com.FoodApp.FoodApplication.DTO.CartItemDetailsDto;
import com.FoodApp.FoodApplication.entity.CartDetails;
import com.FoodApp.FoodApplication.entity.CartItemDetails;
import com.FoodApp.FoodApplication.entity.FoodDetails;
import com.FoodApp.FoodApplication.entity.UserProfile;
import com.FoodApp.FoodApplication.excepetion.ResourceNotFoundException;
import com.FoodApp.FoodApplication.repository.CartDetailsRepository;
import com.FoodApp.FoodApplication.repository.CartItemDetailsRepository;
import com.FoodApp.FoodApplication.repository.FoodDetailsRepository;
import com.FoodApp.FoodApplication.repository.UserDetailsRepository;

@Service
public class CartService
{
    @Autowired
    private CartDetailsRepository cartDetailsRepository;
    @Autowired
    private CartItemDetailsRepository cartItemDetailsRepository;
    @Autowired
    private FoodDetailsRepository foodDetailsRepository;
    @Autowired
    private UserDetailsRepository userDetailsRepository;

    // ── Add item to cart ──────────────────────────────────────────
    @Transactional
    public void addToCart(CartItemDetailsDto cartItemDetailsDto)
    {
        CartItemDetails cartItemDetails = toEntity(cartItemDetailsDto);
        cartItemDetailsRepository.save(cartItemDetails);

        CartDetails cartDetails = cartDetailsRepository.findById(cartItemDetailsDto.getCartId())
            .orElseThrow(() -> new ResourceNotFoundException("Cart with id " + cartItemDetailsDto.getCartId() + " not found"));

        // price field holds unit price, so multiply by quantity for line total
        double lineTotal = cartItemDetails.getPrice() * cartItemDetails.getQuantity();
        cartDetails.setTotalPrice(cartDetails.getTotalPrice() + lineTotal);
        cartDetailsRepository.save(cartDetails);
    }

    // ── Get all cart items ────────────────────────────────────────
    public List<CartItemDetailsDto> getCartItemDetails()
    {
        return cartItemDetailsRepository.findAllDtos();
    }

    // ── Get cart by userId (lightweight — no items) ───────────────
    public CartDetailsDto getCartDetailsByUserId(long userId)
    {
        UserProfile userProfile = userDetailsRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User with id " + userId + " not found"));

        CartDetails cartDetails = cartDetailsRepository.findByUserProfile(userProfile);

        CartDetailsDto cartDetailsDto = new CartDetailsDto();
        cartDetailsDto.setUserId(userProfile.getId());
        cartDetailsDto.setId(cartDetails.getId());
        return cartDetailsDto;
    }

    // ── Get full cart with items and computed total ───────────────
    public CartDetailsDto getCartDetails(long cartId)
    {
        CartDetails cartDetails = cartDetailsRepository.findById(cartId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart id " + cartId + " not found"));

        List<CartItemDetailsDto> cartItemDetailsDtos =
            cartItemDetailsRepository.findCartDtosByCartId(cartId);

        double totalPrice =40;
        for (CartItemDetailsDto dto : cartItemDetailsDtos)
        {
            totalPrice += dto.getPrice(); // toDto() already returns unit × qty
        }

        CartDetailsDto cartDetailsDto = new CartDetailsDto();
        cartDetailsDto.setId(cartId);
        cartDetailsDto.setUserId(cartDetails.getUserProfile().getId());
        cartDetailsDto.setItems(cartItemDetailsDtos);
        cartDetailsDto.setTotalPrice(totalPrice);
        return cartDetailsDto;
    }

    // ── Update cart item quantity ─────────────────────────────────
    @Transactional
    public void updateCartItem(Long id, CartItemDetailsDto cartItemDetailsDto)
    {
        CartItemDetails cartItemDetails = cartItemDetailsRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cart Item with id " + id + " not found"));

        CartDetails cartDetails = cartDetailsRepository.findById(cartItemDetailsDto.getCartId())
            .orElseThrow(() -> new ResourceNotFoundException("Cart with id " + cartItemDetailsDto.getCartId() + " not found"));

        FoodDetails foodDetails = foodDetailsRepository.findById(cartItemDetailsDto.getFoodId())
            .orElseThrow(() -> new ResourceNotFoundException("Food with id " + cartItemDetailsDto.getFoodId() + " not found"));

        // subtract old line total first
        double oldLineTotal = cartItemDetails.getPrice() * cartItemDetails.getQuantity();
       // cartDetails.setTotalPrice(cartDetails.getTotalPrice() - oldLineTotal);
    
        // apply updates — store unit price only
        cartItemDetails.setCart(cartDetails);
        cartItemDetails.setFood(foodDetails);
        cartItemDetails.setQuantity(cartItemDetailsDto.getQuantity());
        cartItemDetails.setPrice(foodDetails.getPrice()); // unit price only

        // add new line total
        double newLineTotal = foodDetails.getPrice() * cartItemDetailsDto.getQuantity();
        cartDetails.setTotalPrice((cartDetails.getTotalPrice()+newLineTotal-oldLineTotal));
        System.out.println(oldLineTotal+" "+newLineTotal);
        cartItemDetailsRepository.save(cartItemDetails);
        cartDetailsRepository.save(cartDetails);
    }

    // ── Create cart ───────────────────────────────────────────────
    @Transactional
    public void createCart(CartDetailsDto cartDetailsDto)
    {
        UserProfile userDetails = userDetailsRepository.findById(cartDetailsDto.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User with id " + cartDetailsDto.getUserId() + " not found"));

        CartDetails cartDetails = new CartDetails();
        cartDetails.setUserProfile(userDetails);
        cartDetails.setTotalPrice(40.0);

        List<CartItemDetails> cartItemDetailsList = new ArrayList<>();
        double totalPrice = 40;

        for (CartItemDetailsDto dto : cartDetailsDto.getItems())
        {
            CartItemDetails item = toEntity(dto);
            cartItemDetailsList.add(item);
            totalPrice += item.getPrice() * item.getQuantity(); // unit × qty
        }

        cartDetails.setItems(cartItemDetailsList);
        cartDetails.setTotalPrice(totalPrice);
        cartDetailsRepository.save(cartDetails);
    }

    // ── Delete cart item ──────────────────────────────────────────
    @Transactional
    public void deleteCartItem(long id)
    {
        CartItemDetails cartItemDetails = cartItemDetailsRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cart Item with id " + id + " not found"));

        // unit price × quantity = correct line total to deduct
        double lineTotal = cartItemDetails.getPrice() * cartItemDetails.getQuantity();

        CartDetails cartDetails = cartItemDetails.getCart();
        cartDetails.setTotalPrice(cartDetails.getTotalPrice() - lineTotal);

        cartDetailsRepository.save(cartDetails);
        cartItemDetailsRepository.deleteById(id);
    }

    // ── Clear entire cart ─────────────────────────────────────────
    public void clearCart(Long cartId)
    {
        cartDetailsRepository.deleteById(cartId);
    }

    // ── Converters ────────────────────────────────────────────────

    // entity → DTO  (price in DTO = unit × qty, for display)
    public CartItemDetailsDto toDto(CartItemDetails cartItemDetails)
    {
        CartItemDetailsDto dto = new CartItemDetailsDto();
        dto.setId(cartItemDetails.getId());
        dto.setCartId(cartItemDetails.getCart().getId());
        dto.setFoodId(cartItemDetails.getFood().getId());
        dto.setQuantity(cartItemDetails.getQuantity());
        dto.setPrice(cartItemDetails.getPrice() * cartItemDetails.getQuantity()); // line total for display
        return dto;
    }

    // DTO → entity  (always store unit price in entity)
    public CartItemDetails toEntity(CartItemDetailsDto dto)
    {
        CartDetails cartDetails = cartDetailsRepository.findById(dto.getCartId())
            .orElseThrow(() -> new ResourceNotFoundException("Cart with id " + dto.getCartId() + " not found"));

        FoodDetails foodDetails = foodDetailsRepository.findById(dto.getFoodId())
            .orElseThrow(() -> new ResourceNotFoundException("Food with id " + dto.getFoodId() + " not found"));

        CartItemDetails cartItemDetails = new CartItemDetails();
        cartItemDetails.setCart(cartDetails);
        cartItemDetails.setFood(foodDetails);
        cartItemDetails.setQuantity(dto.getQuantity());
        cartItemDetails.setPrice(foodDetails.getPrice()); // unit price only — never × quantity here
        return cartItemDetails;
    }

    public List<CartItemDetailsDto> toDtoList(List<CartItemDetails> cartItemDetailsList)
    {
        List<CartItemDetailsDto> dtoList = new ArrayList<>();
        for (CartItemDetails item : cartItemDetailsList)
        {
            dtoList.add(toDto(item));
        }
        return dtoList;
    }
}