import Link from 'next/link'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Terms of Service - Modern Blog',
  description: 'The terms and conditions governing your use of Modern Blog.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              The terms governing your use of Modern Blog.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Acceptance of Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              By accessing and using Modern Blog, you agree to be bound by these Terms of 
              Service. If you do not agree with any part of these terms, please discontinue 
              use of the site.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Content
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Articles, tutorials, and code samples on this site are provided for 
              informational and educational purposes. Unless otherwise noted:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>You may use code snippets from articles in your own projects</li>
              <li>Article text may not be republished in full without attribution</li>
              <li>Content is provided as-is, without warranty of any kind</li>
            </ul>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Comments and Conduct
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              When leaving comments on articles, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Be respectful and constructive toward other readers</li>
              <li>Not post spam, advertisements, or malicious links</li>
              <li>Not impersonate others or misrepresent your affiliation</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
              Comments may be moderated before appearing publicly. We reserve the right to 
              remove comments that violate these guidelines.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Newsletter
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Subscribing to our newsletter is optional. You may unsubscribe at any time. 
              See our{' '}
              <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                privacy policy
              </Link>
              {' '}for details on how your email address is handled.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Disclaimer
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              This is a demonstration blog. Content is provided &quot;as is&quot; without warranties 
              of accuracy, completeness, or fitness for a particular purpose. We are not 
              liable for any damages arising from the use of this site or its content.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Changes to These Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We may update these terms from time to time. Continued use of the site after 
              changes are posted constitutes acceptance of the updated terms.
            </p>
          </Card>
        </div>
      </section>
    </div>
  )
}
