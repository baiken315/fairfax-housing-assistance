"use client";

import { X, Phone, Mail, Globe, Calendar, Building2 } from "lucide-react";
import { Service } from "@/lib/db";
import { useEffect } from "react";

interface ServiceModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceModal({ service, isOpen, onClose }: ServiceModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-[#0b2540] rounded-xl shadow-2xl w-full max-w-lg relative overflow-hidden border border-gray-200 dark:border-white/10 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
          <div className="flex justify-between items-start">
            <div className="pr-8">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-blue-500/20 dark:text-blue-200 mb-3">
                {service.category}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                {service.title}
              </h2>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2">
                <Building2 className="w-4 h-4" />
                <span className="font-medium text-sm">{service.organization}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400 absolute top-4 right-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              {service.description}
            </p>

            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">
              Contact Information
            </h3>
            <div className="space-y-3 bg-gray-50 dark:bg-white/5 p-4 rounded-lg">
              {service.phone && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-white dark:bg-white/10 shadow-sm">
                    <Phone className="w-4 h-4 text-secondary-teal" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Phone</div>
                    <div className="text-gray-900 dark:text-gray-100">{service.phone}</div>
                  </div>
                </div>
              )}
              
              {service.email && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-white dark:bg-white/10 shadow-sm">
                    <Mail className="w-4 h-4 text-secondary-teal" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Email</div>
                    <a href={`mailto:${service.email}`} className="text-primary hover:underline">
                      {service.email}
                    </a>
                  </div>
                </div>
              )}
              
              {service.website && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-white dark:bg-white/10 shadow-sm">
                    <Globe className="w-4 h-4 text-secondary-teal" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Website</div>
                    <a 
                      href={service.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline break-all"
                    >
                      {service.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Posted {new Date(service.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
