import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/types/blog'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={`/blog/${post.slug}`}>
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
        
        <CardHeader className="pb-3">
          {/* Category Badge */}
          <div className="flex items-center justify-between mb-2">
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {post.readingTime} min read
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h3>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
            {post.excerpt}
          </p>
          
          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <span>{post.author.name}</span>
            </div>
            <time dateTime={post.publishedAt.toISOString()}>
              {formatDate(post.publishedAt)}
            </time>
          </div>
          
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}