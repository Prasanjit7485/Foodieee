import RestaurantCard from "./RestaurantCard";
import pizzaImg from "@/assets/pizza.jpg";
import burgerImg from "@/assets/burger.jpg";
import biryaniImg from "@/assets/biryani.jpg";
import sushiImg from "@/assets/sushi.jpg";
import chickenImg from "@/assets/chicken.jpg";
import dessertImg from "@/assets/dessert.jpg";

const restaurants = [
  { name: "Paradise Biryani", cuisine: "Biryani • North Indian", rating: 4.5, time: "25-30 min", image: biryaniImg, offer: "50% OFF" },
  { name: "Pizza Palace", cuisine: "Pizza • Italian", rating: 4.3, time: "20-25 min", image: pizzaImg, offer: "Buy 1 Get 1" },
  { name: "Burger Hub", cuisine: "Burgers • American", rating: 4.1, time: "15-20 min", image: burgerImg },
  { name: "Sakura Sushi", cuisine: "Sushi • Japanese", rating: 4.7, time: "30-35 min", image: sushiImg, offer: "20% OFF" },
  { name: "Crispy Chicken Co.", cuisine: "Chicken • Fast Food", rating: 4.2, time: "15-20 min", image: chickenImg },
  { name: "Sweet Tooth Bakery", cuisine: "Desserts • Bakery", rating: 4.6, time: "20-25 min", image: dessertImg },
];

const RestaurantList = () => {
  return (
    <section className="px-4 pb-24 pt-2">
      <h2 className="mb-3 text-lg font-extrabold text-foreground">Popular Restaurants</h2>
      <div className="grid grid-cols-2 gap-3">
        {restaurants.map((r) => (
          <RestaurantCard key={r.name} {...r} />
        ))}
      </div>
    </section>
  );
};

export default RestaurantList;
