'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { useEffect } from 'react'

export default function LandingPage() {
  const router = useRouter()

  // Redirect to dashboard if already signed in
  useEffect(() => {
    // This will only run on the client side
    const redirectToDashboard = async () => {
      try {
        const userSession = await fetch('/api/auth/session')
        const session = await userSession.json()
        if (session?.userId) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error checking session:', error)
      }
    }

    redirectToDashboard()
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold">Welcome to FotoSync</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Your all-in-one photography management solution. Manage bookings, showcase your portfolio, and grow your business.
        </p>
        <SignedIn>
          <Button 
            size="lg" 
            onClick={() => router.push('/dashboard')}
            className="text-lg px-8"
          >
            Go to Dashboard
          </Button>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal" afterSignInUrl="/dashboard">
            <Button 
              size="lg" 
              className="text-lg px-8"
            >
              Get Started
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  )
}

