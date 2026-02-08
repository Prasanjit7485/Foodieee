package com.FoodApp.FoodApplication.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

import jakarta.persistence.Id;
import jakarta.persistence.CascadeType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.*;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartDetails 
{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserProfile userProfile;
    @OneToMany(mappedBy="cart",cascade=CascadeType.ALL,orphanRemoval = false)
    private List<CartItemDetails> items= new ArrayList<>();
    private Double totalPrice;
}
