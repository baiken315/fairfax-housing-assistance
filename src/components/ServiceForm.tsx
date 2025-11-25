"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { Service } from "@/lib/db";

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

interface ServiceFormProps {
  initialData?: Service;
  onSuccess?: () => void;
  variant?: 'default' | 'modal';
  hideSubmitButton?: boolean;
  id?: string;
  onSubmitStart?: () => void;
  onSubmitEnd?: () => void;
}

export default function ServiceForm({ 
  initialData, 
  onSuccess, 
  variant = 'default',
  hideSubmitButton = false,
  id = 'service-form',
  onSubmitStart,
  onSubmitEnd
}: ServiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [descriptionCharCount, setDescriptionCharCount] = useState(initialData?.description.length || 0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialData?.categories || []);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    if (onSubmitStart) onSubmitStart();
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    // Validate at least one contact method
    const phone = formData.get("phone");
    const email = formData.get("email");
    const website = formData.get("website");
    
    if (!phone && !email && !website) {
      setError("Please provide at least one form of contact (Phone, Email, or Website).");
      setIsSubmitting(false);
      return;
    }

    // Validate at least one category
    if (selectedCategories.length === 0) {
      setError("Please select at least one category.");
      setIsSubmitting(false);
      return;
    }

    const data = {
      title: formData.get("title"),
      organization: formData.get("organization"),
      categories: selectedCategories,
      description: formData.get("description"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      website: formData.get("website"),
    };

    try {
      const url = initialData ? `/api/services/${initialData.id}` : "/api/services";
      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || "Failed to submit service");
      }

      if (onSuccess) {
        onSuccess();
        router.refresh();
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
      if (onSubmitEnd) onSubmitEnd();
    }
  }

  const containerClasses = variant === 'modal' 
    ? "space-y-4" 
    : "bg-white dark:bg-[#0b2540] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm";

  return (
    <form id={id} onSubmit={handleSubmit} className={`space-y-6 max-w-2xl mx-auto ${variant === 'modal' ? 'w-full' : ''}`}>
      <div className={containerClasses}>
        <div className="space-y-4">
          {/* Title & Organization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Service Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                defaultValue={initialData?.title}
                className="w-full rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/70 outline-none transition-all"
                placeholder="e.g. Free Minor Repairs"
              />
            </div>
            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Organization Name *
              </label>
              <input
                type="text"
                name="organization"
                id="organization"
                required
                defaultValue={initialData?.organization}
                className="w-full rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/70 outline-none transition-all"
                placeholder="e.g. Community Fix-It Corp"
              />
            </div>
          </div>

          {/* Categories (Multi-select) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categories (Select all that apply) *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all border ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary dark:bg-primary/20 dark:border-primary dark:text-white"
                        : "bg-white dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:border-primary/50"
                    }`}
                  >
                    <span className="truncate mr-2">{category}</span>
                    {isSelected && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {selectedCategories.length === 0 ? "No categories selected" : `${selectedCategories.length} selected`}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Information (Provide at least one) *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="tel"
                name="phone"
                defaultValue={initialData?.phone}
                className="w-full rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/70 outline-none transition-all"
                placeholder="Phone"
              />
              <input
                type="email"
                name="email"
                defaultValue={initialData?.email}
                className="w-full rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/70 outline-none transition-all"
                placeholder="Email"
              />
              <input
                type="url"
                name="website"
                defaultValue={initialData?.website}
                className="w-full rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/70 outline-none transition-all"
                placeholder="Website URL"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description *
              </label>
              <span className={`text-xs ${descriptionCharCount > 180 ? 'text-red-500' : 'text-gray-500'}`}>
                {descriptionCharCount}/180
              </span>
            </div>
            <textarea
              name="description"
              id="description"
              required
              maxLength={180}
              rows={4}
              defaultValue={initialData?.description}
              onChange={(e) => setDescriptionCharCount(e.target.value.length)}
              className="w-full rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/70 outline-none transition-all resize-y"
              placeholder="Describe the service provided (max 180 characters)..."
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {!hideSubmitButton && (
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md bg-primary hover:bg-primary-hover text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? (initialData ? "Updating..." : "Submitting...") : (initialData ? "Submit Edit" : "Submit Service")}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}

