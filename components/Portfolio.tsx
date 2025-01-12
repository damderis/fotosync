import { useUserData } from '@/hooks/useFirebase'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useSessionPrices } from '@/hooks/useSessionPrices'
import { useFolders } from '@/hooks/useFolders'

export default function Portfolio() {
  const { userData, loading: userLoading } = useUserData()
  const { portfolio, loading: portfolioLoading } = usePortfolio()
  const { prices, loading: pricesLoading } = useSessionPrices()
  const { folders, loading: foldersLoading } = useFolders()

  if (userLoading || portfolioLoading || pricesLoading || foldersLoading) {
    return <div>Loading...</div>
  }

  if (!userData || !portfolio) {
    return <div>No data found</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome {userData.name}</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Portfolio</h2>
        <p>{portfolio.bio}</p>
        <div className="mt-2">
          <h3 className="font-medium">Services:</h3>
          <ul className="list-disc pl-5">
            {portfolio.services.map(service => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Session Prices</h2>
        <div className="grid grid-cols-2 gap-4">
          {prices.map(price => (
            <div key={price.id} className="p-3 border rounded">
              <h3 className="font-medium">{price.service}</h3>
              <p>${price.price}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Folders</h2>
        <div className="grid grid-cols-3 gap-4">
          {folders.map(folder => (
            <div key={folder.id} className="p-3 border rounded">
              <h3 className="font-medium">{folder.name}</h3>
              {folder.description && <p>{folder.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 