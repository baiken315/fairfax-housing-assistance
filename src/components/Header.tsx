"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Home } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="w-full border-b border-gray-200 dark:border-white/10 bg-white dark:bg-fairfax-dark transition-colors duration-200 sticky top-0 z-50 print:hidden">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-full bg-primary/10 dark:bg-white/10 group-hover:bg-primary/20 dark:group-hover:bg-white/20 transition-colors">
            <Home className="w-6 h-6 text-primary dark:text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
            Fairfax County Housing Helper
          </span>
          <span className="font-bold text-m text-gray-900 dark:text-gray-100">
            Not affiliated with or endorsed by Fairfax County
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link 
            href="/submit" 
            className="hidden md:block text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white font-medium transition-colors"
          >
            Submit Service
          </Link>
          
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
            ) : (
              <div className="w-5 h-5" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
