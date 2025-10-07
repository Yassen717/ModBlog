import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'About - Modern Blog',
  description: 'Learn about Modern Blog, our mission to share knowledge about web development, and meet the team behind the content.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Modern Blog
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Sharing knowledge, inspiring developers, and building the future of web development together.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              We believe that knowledge should be accessible to everyone. Our mission is to create 
              high-quality, practical content that helps developers at all levels grow their skills 
              and build amazing things.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Educational
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We create in-depth tutorials and guides that break down complex concepts into digestible, actionable steps.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Practical
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every article includes real-world examples and code snippets that you can use in your own projects.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Current
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We stay up-to-date with the latest technologies and best practices in the ever-evolving web development landscape.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section className="bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Meet the Author
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                The person behind the content
              </p>
            </div>

            <Card className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&auto=format&q=80"
                    alt="John Doe"
                    width={200}
                    height={200}
                    className="rounded-full"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    John Doe
                  </h3>
                  <p className="text-lg text-blue-600 dark:text-blue-400 mb-6">
                    Full-stack Developer & Technical Writer
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    John is a passionate full-stack developer with over 8 years of experience building 
                    web applications. He specializes in React, Next.js, TypeScript, and modern web 
                    technologies. When he&apos;s not coding, he enjoys sharing his knowledge through writing 
                    and helping other developers grow their skills.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <Button variant="secondary" size="sm" asChild>
                      <a href="https://twitter.com/johndoe" target="_blank" rel="noopener noreferrer">
                        🐦 Twitter
                      </a>
                    </Button>
                    <Button variant="secondary" size="sm" asChild>
                      <a href="https://github.com/johndoe" target="_blank" rel="noopener noreferrer">
                        🐙 GitHub
                      </a>
                    </Button>
                    <Button variant="secondary" size="sm" asChild>
                      <a href="https://linkedin.com/in/johndoe" target="_blank" rel="noopener noreferrer">
                        💼 LinkedIn
                      </a>
                    </Button>
                    <Button variant="secondary" size="sm" asChild>
                      <a href="https://johndoe.dev" target="_blank" rel="noopener noreferrer">
                        🌐 Website
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            By the Numbers
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Our journey so far
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              50+
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Articles Published
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              100K+
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Monthly Readers
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              500+
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Code Examples
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              5K+
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Community Members
            </div>
          </div>
        </div>
      </section>

      {/* Topics We Cover */}
      <section className="bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                What We Cover
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Comprehensive content across the modern web development stack
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-400">⚛️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Frontend Development</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">React, Next.js, TypeScript, CSS, and modern frontend frameworks</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 dark:text-green-400">🔧</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Backend Development</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Node.js, APIs, databases, and server-side technologies</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 dark:text-purple-400">🎨</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Design & UX</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">UI/UX principles, design systems, and accessibility</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 dark:text-orange-400">🚀</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">DevOps & Deployment</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">CI/CD, cloud platforms, and performance optimization</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 dark:text-red-400">🧪</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Testing & Quality</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Unit testing, integration testing, and code quality practices</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 dark:text-yellow-400">📈</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Performance & SEO</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Web performance optimization, SEO best practices, and analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Newsletter */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Stay Connected
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Get the latest articles and updates delivered to your inbox, or reach out with questions and suggestions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/newsletter">
                📧 Subscribe to Newsletter
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <a href="mailto:hello@modernblog.com">
                💬 Contact Us
              </a>
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              Have a suggestion for a topic you&apos;d like us to cover? We&apos;d love to hear from you!
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}