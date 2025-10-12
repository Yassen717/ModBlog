'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center px-4 py-16 mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => router.back()} 
            variant="outline"
            className="px-6 py-3 text-base"
          >
            Go Back
          </Button>
          
          <Button asChild className="px-6 py-3 text-base">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
        
        <div className="mt-12">
          <p className="text-gray-500 dark:text-gray-400">
            You might want to check out our latest articles instead
          </p>
          <div className="mt-4">
            <Button asChild variant="ghost">
              <Link href="/blog">Browse Articles</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}