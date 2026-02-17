import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-3 rounded-xl bg-search-bg px-4 py-3">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search for restaurants or food..."
          className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>
    </div>
  );
};

export default SearchBar;
