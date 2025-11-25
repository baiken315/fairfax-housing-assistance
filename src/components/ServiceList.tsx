"use client";

import { useState } from "react";
import { Service } from "@/lib/db";
import ServiceCard from "./ServiceCard";
import ServiceModal from "./ServiceModal";
import { LayoutGrid, List as ListIcon, Phone, Mail, Globe, Building2 } from "lucide-react";
import Link from "next/link";

interface ServiceListProps {
  services: Service[];
}

export default function ServiceList({ services }: ServiceListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex justify-end gap-2 print:hidden">
        <div className="flex items-center p-1 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            aria-label="List view"
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="flex flex-col gap-3">
          {services.map((service) => (
            <div 
              key={service.id}
              className="bg-white dark:bg-[#0b2540] rounded-lg border border-gray-200 dark:border-white/10 p-4 hover:shadow-md transition-all animate-fadeIn group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                      {service.title}
                    </h3>
                    <div className="hidden md:flex gap-1">
                      {service.categories.slice(0, 3).map(cat => (
                        <span key={cat} className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5">
                          {cat}
                        </span>
                      ))}
                      {service.categories.length > 3 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5">
                          +{service.categories.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{service.organization}</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 border-l border-gray-200 dark:border-white/10 pl-3 ml-1">
                      {service.phone && (
                        <div className="flex items-center gap-1.5" title={service.phone}>
                          <Phone className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[120px]">{service.phone}</span>
                        </div>
                      )}
                      {service.email && (
                        <div className="flex items-center gap-1.5" title={service.email}>
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[150px]">{service.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-1 md:line-clamp-2">
                    {service.description}
                  </p>
                  
                  {/* Mobile-only categories */}
                  <div className="md:hidden flex flex-wrap gap-1 mt-2">
                    {service.categories.slice(0, 3).map(cat => (
                      <span key={cat} className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-white/5 mt-2 md:mt-0">
                  <button 
                    onClick={() => setSelectedService(service)}
                    className="px-4 py-2 rounded-md bg-primary/10 hover:bg-primary/20 text-primary dark:bg-white/5 dark:hover:bg-white/10 dark:text-white text-sm font-medium transition-colors w-full md:w-auto"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for List View */}
      {selectedService && (
        <ServiceModal 
          service={selectedService} 
          isOpen={!!selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
    </div>
  );
}
