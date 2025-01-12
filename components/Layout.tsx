'use client'

import { UserButton, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

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
          <header className="border-b">
            <div className="flex h-16 items-center px-4">
              <Link href="/" className="font-bold">
                FotoSync
              </Link>
              <nav className="ml-auto flex items-center space-x-4">
                <Link href="/appointments">Appointments</Link>
                <Link href="/portfolio">Portfolio</Link>
                <Link href="/folders">Folders</Link>
                <Link href="/reports">Reports</Link>
                <UserButton afterSignOutUrl="/sign-in" />
              </nav>
            </div>
          </header>
          <main className="container mx-auto py-6 px-4">{children}</main>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

