package com.FoodApp.FoodApplication.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.FoodApp.FoodApplication.DTO.OrderDetailsDto;
import com.FoodApp.FoodApplication.DTO.OrderItemDetailsDto;
import com.FoodApp.FoodApplication.Enums.OrderStatus;
import com.FoodApp.FoodApplication.entity.CartDetails;
import com.FoodApp.FoodApplication.entity.CartItemDetails;
import com.FoodApp.FoodApplication.entity.OrderDetails;
import com.FoodApp.FoodApplication.entity.OrderItemsDetails;
import com.FoodApp.FoodApplication.entity.UserProfile;
import com.FoodApp.FoodApplication.excepetion.ResourceNotFoundException;
import com.FoodApp.FoodApplication.repository.CartDetailsRepository;
import com.FoodApp.FoodApplication.repository.OrderDetailsRepository;
import com.FoodApp.FoodApplication.repository.OrderItemDetailsRepository;
import com.FoodApp.FoodApplication.repository.UserDetailsRepository;

@Service
public class OrderService
{
    @Autowired
    private OrderDetailsRepository orderDetailsRepository;
    @Autowired
    private OrderItemDetailsRepository orderItemDetailsRepository;
    @Autowired
    private CartDetailsRepository cartDetailsRepository;
    @Autowired
    private UserDetailsRepository userDetailsRepository;
    @Transactional
    public void placeOrder(long userId)
    {
        UserProfile userDetails=userDetailsRepository.findById(userId).orElseThrow(()->new ResourceNotFoundException("User id"+userId+"not found"));;
        CartDetails cartDetails=cartDetailsRepository.findByUserProfile(userDetails);
        OrderDetails orderDetails=new OrderDetails();
        orderDetails.setUserProfile(userDetails);
        orderDetails.setTotalAmount(cartDetails.getTotalPrice());
        orderDetails.setStatus(OrderStatus.CREATED);
        orderDetails.setOrderTime(LocalDateTime.now());
        List<OrderItemsDetails> orderItemsDetailsList=new ArrayList<>();
        List<CartItemDetails> cartItemsDetailsList=cartDetails.getItems();
        for(CartItemDetails cartItemsDetails:cartItemsDetailsList)
        {
            OrderItemsDetails orderItemsDetails=new OrderItemsDetails();
            orderItemsDetails.setOrderDetails(orderDetails);
            orderItemsDetails.setFoodDetails(cartItemsDetails.getFood());
            orderItemsDetails.setPrice(cartItemsDetails.getPrice());
            orderItemsDetails.setQuantity(cartItemsDetails.getQuantity());
            orderItemDetailsRepository.save(orderItemsDetails);
            orderItemsDetailsList.add(orderItemsDetails);
        }
        orderDetails.setOrderItemsDetailsList(orderItemsDetailsList);
        cartDetailsRepository.delete(cartDetails);
        orderDetailsRepository.save(orderDetails);
    }
    public List<OrderItemDetailsDto> getOrderItemDetails(Long orderId)
    {
        return orderItemDetailsRepository.findCartDtosByCartId(orderId);
    }
    public List<OrderDetailsDto>  getOrderDetailsByUserId(Long userId)
    {
        UserProfile userDetails=userDetailsRepository.findById(userId).orElseThrow(()->new ResourceNotFoundException("User id"+userId+"not found"));;
        List<OrderDetails> orderDetails=orderDetailsRepository.findByUserProfile(userDetails);
        List<OrderDetailsDto> orderDetailsDto=new ArrayList<>();
        for(OrderDetails orderDetails1:orderDetails)
            {
                orderDetailsDto.add(toDto(orderDetails1));
            }
        return orderDetailsDto;
    }
    public OrderDetailsDto toDto(OrderDetails orderDetails)
    {
        OrderDetailsDto orderDetailsDto=new OrderDetailsDto();
        orderDetailsDto.setId(orderDetails.getId());
        orderDetailsDto.setUserId(orderDetails.getUserProfile().getId());
        orderDetailsDto.setStatus(orderDetails.getStatus());
        orderDetailsDto.setOrderTime(orderDetails.getOrderTime());
        orderDetailsDto.setTotalAmount(orderDetails.getTotalAmount());
        List<OrderItemDetailsDto> orderItemsDetailsList=orderItemDetailsRepository.findCartDtosByCartId(orderDetails.getId());
        orderDetailsDto.setOrderItemDetailsDto(orderItemsDetailsList);
        return orderDetailsDto;
    }
}
