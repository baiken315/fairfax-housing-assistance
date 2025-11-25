import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-white/10 bg-white dark:bg-fairfax-dark mt-auto print:hidden">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h3 className="font-bold text-gray-900 dark:text-gray-100">
            Fairfax Housing Helper
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Your community resource for finding housing assistance services.
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/about" className="hover:text-primary dark:hover:text-white transition-colors">
              About & Disclaimer
            </Link>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} Fairfax Housing Helper.
          </p>
        </div>
      </div>
    </footer>
  );
}
