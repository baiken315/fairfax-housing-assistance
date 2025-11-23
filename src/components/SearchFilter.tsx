"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const CATEGORIES = [
  "Home Repairs",
  "Hoarding Cleanout",
  "Hazmat Cleaning",
  "Decluttering",
  "Accessibility Improvements",
  "Financial Aid",
  "Food & Supplies",
  "Legal Aid",
  "Medical Support",
  "Other"
];

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "";

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    router.replace(`/?${params.toString()}`);
  }, 300);

  const handleCategory = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === currentCategory) {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.replace(`/?${params.toString()}`);
  };

  const clearFilters = () => {
    router.replace("/");
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search services by title, organization, or description..."
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0b2540] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
        />
      </div>

      {/* Category Tags */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => handleCategory(category)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              currentCategory === category
                ? "bg-primary text-white border-primary"
                : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-primary/50 hover:text-primary dark:hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
        
        {(currentSearch || currentCategory) && (
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border border-transparent text-gray-500 hover:text-red-500 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
