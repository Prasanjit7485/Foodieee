export default function CategoryCard({ category }) {
  return (
    <div className="flex flex-col items-center cursor-pointer group">
      <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow mb-2">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <span className="text-sm font-semibold text-gray-700 text-center">
        {category.name}
      </span>
    </div>
  );
}
