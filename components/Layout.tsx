'use client'

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import Navigation from './Navigation';

/**
 * Layout Component
 * Main layout wrapper for the application
 * Provides:
 * - Navigation sidebar
 * - Consistent layout structure
 * - Responsive design
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} The rendered layout component
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  // Initialize Firebase auth with Clerk
  useFirebaseAuth();

  return (
    <>
      <SignedIn>
        <div className="min-h-screen">
          <header className="border-b bg-white">
            <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
              <Link href="/dashboard" className="font-bold text-xl">
                FotoSync
              </Link>
              <Navigation />
            </div>
          </header>
          <main className="max-w-7xl mx-auto py-6 px-4">{children}</main>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

