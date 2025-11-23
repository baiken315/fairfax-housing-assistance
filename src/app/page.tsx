import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import SearchFilter from "@/components/SearchFilter";
import { getServices } from "@/lib/db";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;

  const services = await getServices(search, category);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Available Services
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Browse housing assistance and support services in Fairfax County. 
            Find the help you need or submit a new service to help others.
          </p>
        </div>
        <Link 
          href="/submit"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md font-medium transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Submit Service
        </Link>
      </div>

      <SearchFilter />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No services found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
