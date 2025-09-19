import Image from 'next/image'
import Link from 'next/link'
import { Post } from '@/types/blog'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PostDetailProps {
  post: Post
}

export function PostDetail({ post }: PostDetailProps) {
  return (
    <article className="py-12">
      {/* Header */}
      <header className="container mx-auto px-4 mb-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-100">{post.title}</span>
          </nav>

          {/* Category Badge */}
          <div className="flex items-center justify-between mb-6">
            <Link href={`/categories/${post.category.slug}`}>
              <span 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white hover:opacity-80 transition-opacity"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.name}
              </span>
            </Link>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {post.readingTime} min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Author and Date */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-8">
            <div className="flex items-center space-x-4">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {post.author.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {post.author.bio}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Published</p>
              <time 
                dateTime={post.publishedAt.toISOString()}
                className="font-medium text-gray-900 dark:text-gray-100"
              >
                {formatDate(post.publishedAt)}
              </time>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="container mx-auto px-4 mb-12">
          <div className="max-w-5xl mx-auto">
            <div className="relative h-64 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100">
            <div 
              className="content leading-relaxed"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {post.content}
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Enjoyed this article?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Share it with your network and help others discover great content.
                </p>
              </div>
              <div className="flex space-x-3 mt-4 sm:mt-0">
                <Button variant="secondary" size="sm" asChild>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Share on Twitter
                  </a>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Share on LinkedIn
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}