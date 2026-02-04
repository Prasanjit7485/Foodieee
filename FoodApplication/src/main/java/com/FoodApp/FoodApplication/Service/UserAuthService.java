package com.FoodApp.FoodApplication.Service;

import com.FoodApp.FoodApplication.entity.UserAuthDetails;
import com.FoodApp.FoodApplication.repository.UserAuthDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserAuthService implements UserDetailsService
{
    @Autowired
    private UserAuthDetailsRepository userAuthDetailsRepository;
    public UserDetails save(UserAuthDetails userAuthDetails)
    {
        return userAuthDetailsRepository.save(userAuthDetails);
    }
    @Override
    public UserAuthDetails loadUserByUsername(String username)
    {
        return userAuthDetailsRepository.findByUsername(username).orElseThrow(()->new UsernameNotFoundException("User not found"));
    }
}
