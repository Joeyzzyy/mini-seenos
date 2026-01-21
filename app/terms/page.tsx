import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for seopages.pro - Read our terms and conditions for using our AI-powered alternative page generator.',
  alternates: {
    canonical: 'https://seopages.pro/terms',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <SiteHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Last updated: January 21, 2026</p>
        
        <div className="prose prose-invert prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">1. Agreement to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing or using seopages.pro (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">2. Description of Service</h2>
            <p className="text-gray-300 leading-relaxed">
              seopages.pro is an AI-powered platform that generates SEO and GEO optimized alternative pages and comparison content. We provide deploy-ready HTML code that you can use on your own websites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">3. User Accounts</h2>
            <p className="text-gray-300 leading-relaxed mb-4">When you create an account:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>You must notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">4. Ownership of Generated Content</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">You own the content.</strong> Once you generate and download HTML files using our Service, you own full rights to that code. There are no restrictions on how you use, modify, or distribute the generated content. No watermarks, no attribution required, no ongoing fees.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">5. Acceptable Use</h2>
            <p className="text-gray-300 leading-relaxed mb-4">You agree not to use the Service to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Generate content that is illegal, harmful, or violates third-party rights</li>
              <li>Create misleading or deceptive comparison content</li>
              <li>Impersonate competitors or spread false information</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to circumvent usage limits or security measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">6. Payment and Refunds</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">Free Tier:</strong> Every Google user receives 1 free page generation with full features.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">Paid Plans:</strong> Payments are one-time purchases, not subscriptions. Credits do not expire.
            </p>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Refund Policy:</strong> We offer a 30-day money-back guarantee. If you&apos;re not satisfied with our Service, contact us within 30 days of purchase for a full refund.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">7. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              The seopages.pro platform, including its design, code, and AI models, is our intellectual property. You may not copy, modify, or reverse-engineer our platform. However, all content you generate belongs to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">8. Disclaimers</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">AI-Generated Content:</strong> While we strive for accuracy, AI-generated content may contain errors. You are responsible for reviewing and editing content before publishing.
            </p>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">SEO Results:</strong> We do not guarantee specific search engine rankings. SEO success depends on many factors beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">9. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              To the maximum extent permitted by law, seopages.pro shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">10. Modifications to Service</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify or discontinue the Service at any time. We will provide reasonable notice of any significant changes that affect your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">11. Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the Service operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">12. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about these Terms, please contact us at:{' '}
              <a href="mailto:wps_zy@126.com" className="text-[#65B4FF] hover:underline">wps_zy@126.com</a>
            </p>
          </section>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10">
          <Link href="/" className="text-[#65B4FF] hover:underline">← Back to Home</Link>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
