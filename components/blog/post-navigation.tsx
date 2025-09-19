import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/types/blog'

interface PostNavigationProps {
  previous: Post | null
  next: Post | null
}

export function PostNavigation({ previous, next }: PostNavigationProps) {
  if (!previous && !next) {
    return null
  }

  return (
    <nav className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Previous Post */}
            <div className="flex justify-start">
              {previous ? (
                <Link 
                  href={`/blog/${previous.slug}`}
                  className="group flex items-center space-x-4 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors bg-white dark:bg-gray-800 w-full"
                >
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Previous Article
                    </p>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {previous.title}
                    </h3>
                  </div>
                  {previous.featuredImage && (
                    <div className="flex-shrink-0 hidden sm:block">
                      <Image
                        src={previous.featuredImage}
                        alt={previous.title}
                        width={80}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                </Link>
              ) : (
                <div className="w-full" />
              )}
            </div>

            {/* Next Post */}
            <div className="flex justify-end">
              {next ? (
                <Link 
                  href={`/blog/${next.slug}`}
                  className="group flex items-center space-x-4 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors bg-white dark:bg-gray-800 w-full"
                >
                  {next.featuredImage && (
                    <div className="flex-shrink-0 hidden sm:block">
                      <Image
                        src={next.featuredImage}
                        alt={next.title}
                        width={80}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Next Article
                    </p>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {next.title}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ) : (
                <div className="w-full" />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}