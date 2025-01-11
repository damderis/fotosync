import Link from 'next/link'

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
  return (
    <div className="flex h-screen bg-gray-100">
      <nav className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Photo Manager</h1>
        </div>
        <ul className="space-y-2 p-4">
          <li>
            <Link href="/appointments" className="block p-2 hover:bg-gray-200 rounded">
              Appointments
            </Link>
          </li>
          <li>
            <Link href="/folders" className="block p-2 hover:bg-gray-200 rounded">
              Folders
            </Link>
          </li>
          <li>
            <Link href="/reports" className="block p-2 hover:bg-gray-200 rounded">
              Reports
            </Link>
          </li>
          <li>
            <Link href="/portfolio" className="block p-2 hover:bg-gray-200 rounded">
              Portfolio
            </Link>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}

