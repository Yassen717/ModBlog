import Link from 'next/link'
import { Card } from '@/components/ui/card'
import NewsletterForm from './newsletter-form'

export const metadata = {
  title: 'Newsletter - Modern Blog',
  description: 'Subscribe to the Modern Blog newsletter and get the latest articles delivered to your inbox.',
}

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Stay Updated
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Get the latest articles and insights delivered straight to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What You&apos;ll Get
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to stay current with modern web development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Latest Articles
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                New tutorials and guides delivered as soon as they&apos;re published.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                No Noise
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Quality over quantity. Only the content that matters, nothing else.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Unsubscribe Anytime
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No lock-in. Leave whenever you want with a single click.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Not ready to subscribe?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Browse our latest articles and see what the newsletter is all about.
          </p>
          <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Browse all articles →
          </Link>
        </div>
      </section>
    </div>
  )
}
