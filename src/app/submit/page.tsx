import ServiceForm from "@/components/ServiceForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SubmitPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Submit a Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Know of a housing resource? Share it with the community.
          </p>
        </div>
      </div>

      <ServiceForm />
    </div>
  );
}
