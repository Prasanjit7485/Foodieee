import { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import axios from "axios";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

 const fetchRestaurants = async () => {
  try {
    const res = await axios.get(
      "http://localhost:8080/restaurants/all"
    );
    setRestaurants(res.data);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
  }
};


  return (
    <section className="px-4 pb-24 pt-2">
      <h2 className="mb-3 text-lg font-extrabold text-foreground">
        Popular Restaurants
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {restaurants.map((r) => (
          <RestaurantCard
            key={r.id}
            name={r.name}
            rating={r.rating}
            description={r.description}
            imagePath={r.imageFilePath}
            address={r.address}
          />
        ))}
      </div>
    </section>
  );
};

export default RestaurantList;
