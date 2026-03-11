package com.FoodApp.FoodApplication.Security;

import java.util.Map;
import java.util.Optional;

import com.FoodApp.FoodApplication.entity.UserAuthDetails;
import com.FoodApp.FoodApplication.repository.UserAuthDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/auth")
public class AuthController
{
    @Autowired
    UserAuthDetailsRepository userAuthDetailsRepository;
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    public AuthController(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }
    @PostMapping("/refresh-token")
    public ResponseEntity<Void> refreshToken()
    {
        return ResponseEntity.ok().build();
    }
    @PostMapping("/login")
    public Map<String,String> login(@RequestBody LoginRequest request)
    {
         Authentication authentication =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );
         Optional<UserAuthDetails> userAuthDetails=userAuthDetailsRepository.findByUsername(request.getUsername());

         long userid=userAuthDetails.get().getUserProfile().getId();
         String token = jwtUtil.generateToken(request.getUsername(), 15);
    return Map.of(
            "token", token,
            "userId", String.valueOf(userid)
    );
    } 
    
}
