import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Unauthorized - Modern Blog',
  description: 'You do not have permission to access this page.',
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">MB</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Modern Blog</span>
          </Link>
        </div>

        {/* Error Content */}
        <Card className="p-8">
          <div className="text-6xl mb-6">🚫</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            You don&apos;t have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
          
          <div className="space-y-4">
            <Button size="lg" asChild>
              <Link href="/">
                Return to Home
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/login">
                Login with Different Account
              </Link>
            </Button>
          </div>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Need admin access? Contact the site administrator.</p>
        </div>
      </div>
    </div>
  )
}