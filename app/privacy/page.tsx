import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for seopages.pro - Learn how we collect, use, and protect your personal information.',
  alternates: {
    canonical: 'https://seopages.pro/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <SiteHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: January 21, 2026</p>
        
        <div className="prose prose-invert prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              Welcome to seopages.pro (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">2. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed mb-4">We collect information that you provide directly to us:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong className="text-white">Account Information:</strong> When you sign in with Google, we receive your email address, name, and profile picture.</li>
              <li><strong className="text-white">Usage Data:</strong> Information about how you interact with our services, including pages generated and features used.</li>
              <li><strong className="text-white">Device Information:</strong> Browser type, operating system, and device identifiers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">3. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">4. Data Storage and Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We use Supabase as our database provider. Your data is stored securely with encryption at rest and in transit. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">5. Third-Party Services</h2>
            <p className="text-gray-300 leading-relaxed mb-4">We use the following third-party services:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong className="text-white">Google OAuth:</strong> For authentication</li>
              <li><strong className="text-white">Supabase:</strong> For data storage</li>
              <li><strong className="text-white">Vercel:</strong> For hosting</li>
              <li><strong className="text-white">Azure OpenAI:</strong> For AI content generation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">6. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">7. Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              We use essential cookies for authentication and session management. We do not use tracking cookies or third-party advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">8. Children&apos;s Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">9. Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">10. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:{' '}
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
