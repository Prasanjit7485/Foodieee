package com.FoodApp.FoodApplication.excepetion;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.*;
import java.time.*;
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
}
