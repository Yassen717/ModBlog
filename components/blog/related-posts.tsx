import { Post } from '@/types/blog'
import { PostGrid } from './post-grid'

interface RelatedPostsProps {
  posts: Post[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Related Articles
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Discover more content you might find interesting
            </p>
          </div>
          
          <PostGrid posts={posts} />
        </div>
      </div>
    </section>
  )
}