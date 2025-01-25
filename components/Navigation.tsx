'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { UserButton } from '@clerk/nextjs'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/appointments', label: 'Appointments' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/folders', label: 'Folders' },
  { href: '/reports', label: 'Reports' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="ml-auto flex items-center space-x-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'px-3 py-2 rounded-lg text-sm transition-colors',
            pathname === item.href
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          )}
        >
          {item.label}
        </Link>
      ))}
      <UserButton afterSignOutUrl="/" />
    </nav>
  )
} 