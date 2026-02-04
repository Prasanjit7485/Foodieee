package com.FoodApp.FoodApplication.Security;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

public class JWTAuthenticationProvider implements AuthenticationProvider
{
    private JWTUtil jwtUtil;
    private UserDetailsService userDetailsService;
    public JWTAuthenticationProvider(JWTUtil jwtutil,UserDetailsService userDetailsService)
    {
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtutil;
    }
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException
    {
        String token=((JwtAuthenticationToken)authentication).getToken();
        String username=jwtUtil.validateAndExtractUsername(token);
        if(username==null)
        {
            throw new BadCredentialsException("Invalid token");
        }
        UserDetails user=userDetailsService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(user,null,user.getAuthorities());
    }
    @Override
    public boolean supports(Class<?> authentication)
    {
        return JwtAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
