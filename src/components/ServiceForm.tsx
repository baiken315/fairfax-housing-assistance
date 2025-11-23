"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ServiceForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
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

    const data = {
      title: formData.get("title"),
      organization: formData.get("organization"),
      category: formData.get("category"),
      description: formData.get("description"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      website: formData.get("website"),
    };

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || "Failed to submit service");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-[#0b2540] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
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
                className="w-full rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/70 outline-none transition-all"
                placeholder="e.g. Community Fix-It Corp"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select
              name="category"
              id="category"
              required
              className="w-full rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/70 outline-none transition-all"
            >
              <option value="">Select a category</option>
              <option value="Home Repairs">Home Repairs</option>
              <option value="Hoarding Cleanout">Hoarding Cleanout</option>
              <option value="Hazmat Cleaning">Hazmat Cleaning</option>
              <option value="Decluttering">Decluttering</option>
              <option value="Accessibility Improvements">Accessibility Improvements</option>
              <option value="Financial Aid">Financial Aid</option>
              <option value="Food & Supplies">Food & Supplies</option>
              <option value="Legal Aid">Legal Aid</option>
              <option value="Medical Support">Medical Support</option>
              <option value="Other">Other</option>
            </select>
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
                className="w-full rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/70 outline-none transition-all"
                placeholder="Phone"
              />
              <input
                type="email"
                name="email"
                className="w-full rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/70 outline-none transition-all"
                placeholder="Email"
              />
              <input
                type="url"
                name="website"
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

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md bg-primary hover:bg-primary-hover text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Submitting..." : "Submit Service"}
          </button>
        </div>
      </div>
    </form>
  );
}
