import Link from 'next/link'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Privacy Policy - Modern Blog',
  description: 'Learn how Modern Blog collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              How we collect, use, and protect your information.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Information We Collect
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Modern Blog is a demonstration blog. We collect only the information you voluntarily 
              provide when interacting with the site:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Email address when you subscribe to our newsletter</li>
              <li>Name and email address when you leave a comment on an article</li>
              <li>Content preferences you configure in site settings</li>
            </ul>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How Your Data Is Stored
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              All data on this site is stored locally in your browser using localStorage. 
              Nothing you enter is transmitted to or stored on a remote server. Clearing your 
              browser storage permanently removes all of your data from this site.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              The information you provide is used solely to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Display your comments alongside the articles they belong to</li>
              <li>Maintain your newsletter subscription preference</li>
              <li>Remember your site settings between visits</li>
            </ul>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Cookies and Tracking
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              This site does not use tracking cookies, analytics beacons, or third-party 
              advertising. Your theme preference may be stored locally to remember your 
              light or dark mode selection.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Third-Party Links
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Our articles may link to external websites. We are not responsible for the 
              privacy practices of those sites and encourage you to review their policies.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Changes to This Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We may update this privacy policy from time to time. Any changes will be posted 
              on this page. Questions about this policy? Reach out through our{' '}
              <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">
                about page
              </Link>
              .
            </p>
          </Card>
        </div>
      </section>
    </div>
  )
}
