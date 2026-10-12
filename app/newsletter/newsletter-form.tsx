'use client'

import { useState } from 'react'
import { addSubscriber } from '@/lib/storage'
import { Button } from '@/components/ui/button'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedEmail = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      addSubscriber(trimmedEmail)
      setSubscribed(true)
      setError('')
    } catch (err) {
      console.error('Error subscribing:', err)
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={subscribed}
          className="flex-1 px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-70"
        />
        <Button 
          type="submit"
          variant="secondary" 
          size="lg"
          disabled={subscribed}
          className="bg-white text-blue-600 hover:bg-gray-100"
        >
          {subscribed ? 'Subscribed!' : 'Subscribe'}
        </Button>
      </form>
      {error && (
        <p className="text-sm mt-4 text-red-200">
          {error}
        </p>
      )}
      {subscribed ? (
        <p className="text-sm mt-4">
          Thanks for subscribing! You&apos;ll get our latest articles in your inbox.
        </p>
      ) : (
        <p className="text-sm mt-4 opacity-75">
          No spam, unsubscribe at any time.
        </p>
      )}
    </div>
  )
}
