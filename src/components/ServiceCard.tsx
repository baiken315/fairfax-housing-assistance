import { Service } from "@/lib/db";
import { Phone, Mail, Globe, Calendar, Building2 } from "lucide-react";
import Link from "next/link";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="bg-white dark:bg-[#0b2540] rounded-lg border border-gray-200 dark:border-white/10 p-6 hover:shadow-lg transition-shadow duration-200 animate-fadeIn flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div className="w-full">
          <Link 
            href={`/?category=${encodeURIComponent(service.category)}`}
            className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-blue-500/20 dark:text-blue-200 mb-3 hover:bg-primary/20 dark:hover:bg-blue-500/30 transition-colors"
          >
            {service.category}
          </Link>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
            {service.title}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mb-2">
            <Building2 className="w-4 h-4" />
            <span className="font-medium">{service.organization}</span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 text-sm flex-grow">
        {service.description}
      </p>
      
      <div className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400 mt-auto">
        {service.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-secondary-teal shrink-0" />
            <span>{service.phone}</span>
          </div>
        )}
        {service.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-secondary-teal shrink-0" />
            <a href={`mailto:${service.email}`} className="hover:text-primary transition-colors truncate">
              {service.email}
            </a>
          </div>
        )}
        {service.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-secondary-teal shrink-0" />
            <a href={service.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors truncate">
              Visit Website
            </a>
          </div>
        )}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/5 mt-3">
          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-xs text-gray-500">Posted {new Date(service.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-2 flex justify-end">
        <button className="px-4 py-2 rounded-md bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors w-full sm:w-auto text-center">
          View Details
        </button>
      </div>
    </div>
  );
}

