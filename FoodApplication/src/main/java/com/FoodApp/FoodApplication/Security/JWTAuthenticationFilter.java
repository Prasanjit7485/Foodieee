package com.FoodApp.FoodApplication.Security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTAuthenticationFilter extends OncePerRequestFilter
{
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    public  JWTAuthenticationFilter(AuthenticationManager
                                            authenticationManager, JWTUtil jwtUtil)
    {
      this.authenticationManager = authenticationManager;
      this.jwtUtil=jwtUtil;
    }
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException
    {
        if(!request.getServletPath().equals("/generate-token"))
        {
            filterChain.doFilter(request,response);
            return;
        }
        ObjectMapper objectMapper=new ObjectMapper();
        LoginRequest loginRequest=objectMapper.readValue(request.getInputStream(),LoginRequest.class);
        UsernamePasswordAuthenticationToken authToken=new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),loginRequest.getPassword());
        Authentication authResult= authenticationManager.authenticate(authToken);
        if(authResult.isAuthenticated()) {
            String token = jwtUtil.generateToken(authResult.getName(), 15);
            response.setHeader("Authorization", "Bearer " + token);
            String refreshToken = jwtUtil.generateToken(authResult.getName(), 7 * 24 * 60);
            Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
            refreshCookie.setMaxAge(7 * 24 * 60 * 60);
            refreshCookie.setHttpOnly(true);
            refreshCookie.setSecure(false);
            refreshCookie.setPath("/refresh-token");
            response.addCookie(refreshCookie);
        }
    }
}
