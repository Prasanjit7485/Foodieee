package com.FoodApp.FoodApplication.excepetion;

public class ResourceNotFoundException extends RuntimeException
{
  public ResourceNotFoundException(String message)
  {
    super(message);
  }   
}
