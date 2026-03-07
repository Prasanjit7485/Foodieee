package com.FoodApp.FoodApplication.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.FoodApp.FoodApplication.entity.UserAuthDetails;
import com.FoodApp.FoodApplication.entity.UserProfile;
import com.FoodApp.FoodApplication.repository.UserAuthDetailsRepository;
import com.FoodApp.FoodApplication.repository.UserDetailsRepository;

@Service
public class UserAuthService implements UserDetailsService
{
    @Autowired
    private UserAuthDetailsRepository userAuthDetailsRepository;
    @Autowired
    private UserDetailsRepository userDetailsRepository;
    public UserDetails save(UserAuthDetails userAuthDetails)
    {
        UserDetails userDetails = userAuthDetailsRepository.save(userAuthDetails);
        System.out.println("DB password: " + userAuthDetails.getPassword());
        UserProfile userProfile = new UserProfile();
        userProfile.setUserAuthDetails(loadUserByUsername(userAuthDetails.getUsername()));
        userDetailsRepository.save(userProfile);
        return userDetails;
    }
    @Override
    public UserAuthDetails loadUserByUsername(String username)
    {
        return userAuthDetailsRepository.findByUsername(username).orElseThrow(()->new UsernameNotFoundException("User not found"));
    }
}
