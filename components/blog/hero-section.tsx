import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/types/blog'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

interface HeroSectionProps {
  featuredPost?: Post
}

export function HeroSection({ featuredPost }: HeroSectionProps) {
  if (!featuredPost) {
    return (
      <section className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Welcome to Modern Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Discover the latest insights in web development, JavaScript, React, and modern programming techniques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild>
              <Link href="/blog">Read Latest Posts</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <span 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: featuredPost.category.color }}
              >
                Featured Post
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {featuredPost.readingTime} min read
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              {featuredPost.title}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              {featuredPost.excerpt}
            </p>
            
            <div className="flex items-center space-x-4">
              {featuredPost.author.avatar && (
                <Image
                  src={featuredPost.author.avatar}
                  alt={featuredPost.author.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {featuredPost.author.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(featuredPost.publishedAt)}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href={`/blog/${featuredPost.slug}`}>Read Full Article</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/blog">View All Posts</Link>
              </Button>
            </div>
          </div>
          
          {/* Featured Image */}
          {featuredPost.featuredImage && (
            <div className="relative">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Floating Tags */}
              <div className="absolute -bottom-4 left-4 right-4">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg">
                  <div className="flex flex-wrap gap-2">
                    {featuredPost.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}