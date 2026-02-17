import pizzaImg from "@/assets/pizza.jpg";
import burgerImg from "@/assets/burger.jpg";
import biryaniImg from "@/assets/biryani.jpg";
import sushiImg from "@/assets/sushi.jpg";
import chickenImg from "@/assets/chicken.jpg";
import dessertImg from "@/assets/dessert.jpg";

const categories = [
  { name: "Pizza", image: pizzaImg },
  { name: "Burger", image: burgerImg },
  { name: "Biryani", image: biryaniImg },
  { name: "Sushi", image: sushiImg },
  { name: "Chicken", image: chickenImg },
  { name: "Dessert", image: dessertImg },
];

const FoodCategories = () => {
  return (
    <section className="px-4 py-4">
      <h2 className="mb-3 text-lg font-extrabold text-foreground">What are you craving?</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className="flex flex-col items-center gap-2 min-w-[72px] group"
          >
            <div className="h-16 w-16 overflow-hidden rounded-2xl shadow-[var(--category-shadow)] transition-transform group-hover:scale-110">
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-xs font-bold text-foreground">{cat.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default FoodCategories;
