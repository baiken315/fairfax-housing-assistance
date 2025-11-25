import Link from "next/link";
import { ArrowLeft, Info, ShieldAlert, Users, HelpCircle, Mail } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
      <div className="space-y-4">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
          About Fairfax Housing Helper
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Important information about this community resource.
        </p>
      </div>

      <div className="grid gap-8">
        {/* 1. Unaffiliated Product */}
        <section className="bg-white dark:bg-[#0b2540] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-300">
              <Info className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Not Affiliated with Government
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                This website is an independent community project. It is <strong>not affiliated with, funded by, or endorsed by the Fairfax County Government</strong> or any of its agencies. Any resemblance to official county websites is for familiarity and ease of use only.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Crowdsourced Content */}
        <section className="bg-white dark:bg-[#0b2540] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Community-Managed Content
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                While this website is owned and managed by its creators, the content is <strong>crowdsourced</strong>. This means that listings are submitted, modified, and updated by community members. We do not guarantee the accuracy, completeness, or timeliness of any information provided.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Independent Risk */}
        <section className="bg-white dark:bg-[#0b2540] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Use at Your Own Risk
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                The use of any product, service, or contact information found on this website is done entirely at the <strong>independent risk of the user</strong>. We do not vet or verify the service providers listed here. Please exercise due diligence and caution when contacting or engaging with any organization or individual listed.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Mission */}
        <section className="bg-white dark:bg-[#0b2540] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Our Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                This product is intended to help anyone in the County find ways of helping themselves or others. Our goal is to make it easier to locate services that may address home-related challenges, fostering a more connected and supportive community.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Contact */}
        <section className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/10 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 rounded-full bg-white dark:bg-white/10 shadow-sm">
              <Mail className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                For suggestions, comments, or questions, please email us at:
              </p>
              <a 
                href="mailto:ffx_services@proton.me" 
                className="inline-block text-lg font-medium text-primary hover:underline"
              >
                ffx_services@proton.me
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
