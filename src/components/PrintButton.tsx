"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 rounded-md font-medium transition-colors shadow-sm print:hidden"
      aria-label="Print service list"
    >
      <Printer className="w-5 h-5" />
      Print List
    </button>
  );
}
