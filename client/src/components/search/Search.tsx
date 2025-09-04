import { Input } from "@/components/ui/input";
import { SearchProps } from "@/types/search";
import { Search } from "lucide-react";

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search",
  className = "",
}: SearchProps) => {
  return (
    <div className={`relative mb-4 ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="pl-10 pr-4 py-2 rounded-lg bg-gray-100"
      />
    </div>
  );
};
