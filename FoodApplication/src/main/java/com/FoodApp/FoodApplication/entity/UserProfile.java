package com.FoodApp.FoodApplication.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 
    private String name;
    private Integer age;
    @Column(name = "phone_number", unique = true)
    private String phoneNumber;
    @OneToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id")
    private UserAuthDetails userAuthDetails;
    private String address;

}
