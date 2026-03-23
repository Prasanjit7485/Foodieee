package com.FoodApp.FoodApplication.excepetion;

import java.time.LocalDateTime;
import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
@RestControllerAdvice
public class GlobalExceptionHandler 
{
    @ExceptionHandler(ResourceNotFoundException.class)
 public ResponseEntity<HashMap<String,Object>> handleNotFound(ResourceNotFoundException ex)
 {
    HashMap<String,Object> body=new HashMap<>();
    body.put("timestamp",LocalDateTime.now());
    body.put("status",404);
    body.put("error","Not Found");
    body.put("message",ex.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
 } 
   @ExceptionHandler(BadCredentialsException.class)
   public ResponseEntity<HashMap<String,Object>> handleBadCredentials(BadCredentialsException ex)
   {
      return buildResponse(HttpStatus.UNAUTHORIZED, "AUTH_001", "Invalid username or password");
   }

   @ExceptionHandler(Exception.class)
    public ResponseEntity<HashMap<String,Object>> handleGeneric(Exception ex)
    {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "SYS_001", 
                             "Something went wrong. Please try again later.");
    }
   private ResponseEntity<HashMap<String,Object>> buildResponse(HttpStatus status,String code, String message)
   {
        HashMap<String,Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("code", code);
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
   }  
}
