package com.FoodApp.FoodApplication.Serivice;

import com.FoodApp.FoodApplication.DTO.CartDetailsDto;
import com.FoodApp.FoodApplication.DTO.CartItemDetailsDto;
import com.FoodApp.FoodApplication.entity.CartDetails;
import com.FoodApp.FoodApplication.entity.FoodDetails;
import com.FoodApp.FoodApplication.entity.CartItemDetails;
import com.FoodApp.FoodApplication.entity.UserDetails;
import com.FoodApp.FoodApplication.excepetion.ResourceNotFoundException;
import com.FoodApp.FoodApplication.repository.CartDetailsRepository;
import com.FoodApp.FoodApplication.repository.CartItemDetailsRepository;
import com.FoodApp.FoodApplication.repository.UserDetailsRepository;
import com.FoodApp.FoodApplication.repository.FoodDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

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
    //adding cart item to the cart
    public void addToCart(CartItemDetailsDto cartItemDetailsDto)
    {
        cartItemDetailsRepository.save(toEntity(cartItemDetailsDto));
    }
    // returning list of cartitemdetails od specfic cart
    public List<CartItemDetailsDto> getCartItemDetails()
    {
        return cartItemDetailsRepository.findAllDtos();
    }
    public CartDetailsDto  getCartDetails(long cartId)
    {
       CartDetailsDto cartDetailsDto=new CartDetailsDto();
       CartDetails cartDetails=cartDetailsRepository.findById(cartId).orElseThrow(()->new ResourceNotFoundException("Cart id"+cartId+"not found"));
       cartDetailsDto.setUserId(cartDetails.getUser().getId());
       List<CartItemDetailsDto> cartItemDetailsDtos=cartItemDetailsRepository.findCartDtosByCartId(cartId);
       cartDetailsDto.setItems(cartItemDetailsDtos);
       double totalPrice=0;
       for(CartItemDetailsDto cartItemDetailsDto:cartItemDetailsDtos)
       {
           totalPrice+=(double)cartItemDetailsDto.getPrice();
       }
       cartDetailsDto.setTotalPrice(totalPrice);
       return cartDetailsDto;
    }
    //updating cart item
    @Transactional
    public void updateCartItem(Long id,CartItemDetailsDto cartItemDetailsDto)
    {
        CartItemDetails cartItemDetails=cartItemDetailsRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Cart Item with id " + id  + " not found"));
        CartDetails cartDetails=cartDetailsRepository.findById(cartItemDetailsDto.getCartId()).orElseThrow(()-> new ResourceNotFoundException("Cart with id " + cartItemDetailsDto.getCartId()  + " not found"));
        FoodDetails foodDetails=foodDetailsRepository.findById(cartItemDetailsDto.getFoodId()).orElseThrow(() -> new ResourceNotFoundException("Food with id " + cartItemDetailsDto.getFoodId() + " not found"));

        cartItemDetails.setCart(cartDetails);
        cartItemDetails.setFood(foodDetails);
        cartItemDetails.setQuantity(cartItemDetailsDto.getQuantity());
        cartItemDetails.setPrice(foodDetails.getPrice()*cartItemDetailsDto.getQuantity());

    }
    //creating cart
    public void  createCart(CartDetailsDto cartDetailsDto)
    {
        CartDetails cartDetails=new CartDetails();
        UserDetails userDetails=userDetailsRepository.findById(cartDetailsDto.getUserId()).orElseThrow(()-> new ResourceNotFoundException("User with id " + cartDetailsDto.getUserId() + " not found"));
        List<CartItemDetailsDto> cartItemDetailsDtoList=cartDetailsDto.getItems();
        double totalPrice=0;
        List<CartItemDetails> cartItemDetailsList=new ArrayList<>();
        for(CartItemDetailsDto cartItemDetailsDto1:cartItemDetailsDtoList)
        {
            cartItemDetailsList.add(toEntity(cartItemDetailsDto1));
            totalPrice+=cartItemDetailsDto1.getPrice();
        }
        cartDetails.setUser(userDetails);
        cartDetails.setItems(cartItemDetailsList);
        cartDetails.setTotalPrice(totalPrice);
        cartDetailsRepository.save(cartDetails);
    }
    //deleteing cart item
    public void deleteCartItem(long id)
    {
        CartItemDetails cartItemDetails=cartItemDetailsRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Cart Item with id " + id  + " not found"));
        cartItemDetailsRepository.deleteById(id);

    }
    //converting entity to Dto of CartItem
    public CartItemDetailsDto toDto(CartItemDetails cartItemDetails)
    {
        CartItemDetailsDto cartItemDetailsDto = new CartItemDetailsDto();
        cartItemDetailsDto.setId(cartItemDetails.getId());
        cartItemDetailsDto.setCartId(cartItemDetails.getCart().getId());
        cartItemDetailsDto.setFoodId(cartItemDetails.getFood().getId());
        cartItemDetailsDto.setQuantity(cartItemDetails.getQuantity());
        cartItemDetailsDto.setPrice(cartItemDetails.getFood().getPrice()*cartItemDetails.getQuantity());
        return cartItemDetailsDto;
    }
    //converting Dto to entity of CartItem
    public CartItemDetails toEntity(CartItemDetailsDto cartItemDetailsDto) {
        CartItemDetails cartItemDetails = new CartItemDetails();
        CartDetails cartDetails = cartDetailsRepository.findById(cartItemDetailsDto.getCartId()).orElseThrow(() -> new ResourceNotFoundException("Cart with id " + cartItemDetailsDto.getCartId() + " not found"));
        FoodDetails foodDetails = foodDetailsRepository.findById(cartItemDetailsDto.getFoodId()).orElseThrow(() -> new ResourceNotFoundException("Food with id " + cartItemDetailsDto.getFoodId() + " not found"));
        cartItemDetails.setCart(cartDetails);
        cartItemDetails.setFood(foodDetails);
        cartItemDetails.setQuantity(cartItemDetailsDto.getQuantity());
        cartItemDetails.setPrice(foodDetails.getPrice() * cartItemDetailsDto.getQuantity());
        return cartItemDetails;
    }
    public List<CartItemDetailsDto> toDtoList(List<CartItemDetails> cartItemDetailsList)
    {
        List<CartItemDetailsDto> cartItemDetailsDtoList = new ArrayList<>();
        for(CartItemDetails cartItemDetails : cartItemDetailsList)
        {
            cartItemDetailsDtoList.add(toDto(cartItemDetails));
        }
        return cartItemDetailsDtoList;
    }

}
