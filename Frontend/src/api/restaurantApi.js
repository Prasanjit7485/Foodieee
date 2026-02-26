import axios from "axios";

const API=axios.create({
    baseURL:"http://localhost:8080/restaurants",
});

export const getAllRestaurants=()=>{
    return API.get("/all");
};
export const getRestaurantById = (id) => {
  return API.get(`/${id}`);
};
export const getFoodsByRestaurantId = (id) => {
  return API.get(`/${id}/foods`);
};