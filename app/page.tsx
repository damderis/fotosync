import Layout from '../components/Layout'

/**
 * Home Component
 * Main landing page of the application
 * Displays a welcome message and instructions for users
 * @returns {JSX.Element} The rendered home page component
 */
export default function Home() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Welcome to Photo Manager</h1>
      <p className="text-gray-600">Select a section from the sidebar to get started.</p>
    </Layout>
  )
}

