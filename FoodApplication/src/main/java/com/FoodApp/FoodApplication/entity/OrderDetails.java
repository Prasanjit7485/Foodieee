package com.FoodApp.FoodApplication.entity;

import com.FoodApp.FoodApplication.Enums.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetails
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name="user_id",nullable=false)
    private UserDetails userDetails;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private double totalAmount;
    private LocalDateTime orderTime;
    @OneToMany(mappedBy="orderDetails",cascade=CascadeType.ALL,orphanRemoval=true)
    private List<OrderItemsDetails> orderItemsDetailsList=new ArrayList<>();
}
