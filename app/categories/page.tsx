import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { sampleCategories, samplePosts } from '@/lib/sample-data'

export const metadata = {
  title: 'Categories - Modern Blog',
  description: 'Explore our blog content organized by categories including Web Development, JavaScript, React, Next.js, and CSS.',
}

export default function CategoriesPage() {
  // Calculate post counts for each category
  const categoriesWithCounts = sampleCategories.map(category => {
    const postCount = samplePosts.filter(post => post.category.id === category.id).length
    return { ...category, postCount }
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Browse by Category
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Discover our latest articles organized by topics that matter to developers. 
              From modern web development to cutting-edge frameworks, find exactly what you&apos;re looking for.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriesWithCounts.map((category) => (
            <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="p-8">
                {/* Category Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {category.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.postCount} {category.postCount === 1 ? 'article' : 'articles'}
                    </p>
                  </div>
                </div>

                {/* Category Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {category.description}
                </p>

                {/* View Articles Button */}
                <Button 
                  asChild 
                  className="w-full group-hover:bg-blue-700 transition-colors"
                  style={{ backgroundColor: category.color }}
                >
                  <Link href={`/blog?category=${category.slug}`}>
                    View Articles
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </Button>
              </div>

              {/* Category Stats Bar */}
              <div className="bg-gray-50 dark:bg-gray-800 px-8 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Latest articles in {category.name.toLowerCase()}
                  </span>
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-gray-500 dark:text-gray-500 text-xs">
                      /{category.slug}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Tags Section */}
      <section className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Tags
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore specific topics and technologies covered across our articles
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Next.js', 'React', 'TypeScript', 'JavaScript', 'CSS', 'Web Development',
              'App Router', 'Server Components', 'Tailwind CSS', 'Node.js', 'API',
              'Performance', 'SEO', 'Responsive Design', 'Dark Mode', 'Authentication',
              'Database', 'Deployment', 'Testing', 'Best Practices'
            ].map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                #{tag.replace(/\s+/g, '')}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Browse all our articles or use our search feature to find specific topics and tutorials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/blog">
                Browse All Articles
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/search">
                Search Articles
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}