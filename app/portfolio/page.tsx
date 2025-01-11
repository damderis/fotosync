'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../../components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { AlertCircle, Copy } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface PortfolioItem {
  id: number
  type: 'image' | 'video'
  url: string
}

interface Folder {
  id: number
  name: string
  files: { id: number; name: string; url: string }[]
}

interface OpenSlot {
  id: string
  date: Date
  time: string
}

/**
 * Portfolio Management Component
 * Handles the photographer's portfolio creation, editing, and publishing
 * Features:
 * - Basic information management (name, services, bio)
 * - Contact information
 * - Social media links
 * - Portfolio items management
 * - Publishing controls
 * - Share functionality
 */
export default function Portfolio() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [services, setServices] = useState('')
  const [bio, setBio] = useState('')
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [newItemUrl, setNewItemUrl] = useState('')
  const [newItemType, setNewItemType] = useState<'image' | 'video'>('image')
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published' | 'suspended'>('draft')
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [folders, setFolders] = useState<Folder[]>([])
  const [openSlots, setOpenSlots] = useState<OpenSlot[]>([])
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [socialMedia, setSocialMedia] = useState({ instagram: '', facebook: '', twitter: '' })
  const [sessionPrices, setSessionPrices] = useState<{[key: string]: number}>({})

  /**
   * Loads initial mock data
   * TODO: Replace with actual API calls
   */
  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    // Simulating data fetch
    setName("Jane Doe Photography")
    setServices("Wedding,Portrait,Event,Commercial")
    setBio("Passionate photographer with over 10 years of experience capturing life's most precious moments.")
    setEmail("contact@janedoephotography.com")
    setPhone("(123) 456-7890")
    setSocialMedia({
      instagram: "https://instagram.com/janedoephoto",
      facebook: "https://facebook.com/janedoephoto",
      twitter: "https://twitter.com/janedoephoto"
    })
    setFolders([
      { id: 1, name: 'Wedding 2023', files: [{ id: 1, name: 'photo1.jpg', url: '/placeholder.svg' }] },
      { id: 2, name: 'Portrait Session', files: [{ id: 2, name: 'photo2.jpg', url: '/placeholder.svg' }] },
    ])
    setOpenSlots([
      { id: '1', date: new Date('2023-07-01'), time: '10:00' },
      { id: '2', date: new Date('2023-07-02'), time: '14:00' },
    ])
    setSessionPrices({
      "Wedding": 2500,
      "Portrait": 500,
      "Event": 1000,
      "Commercial": 1500
    })
  }, [])

  /**
   * Handles adding new portfolio items
   */
  const handleAddItem = () => {
    if (newItemUrl) {
      setPortfolioItems([
        ...portfolioItems,
        { id: Date.now(), type: newItemType, url: newItemUrl },
      ])
      setNewItemUrl('')
    }
  }

  const handleRemoveItem = (id: number) => {
    setPortfolioItems(portfolioItems.filter(item => item.id !== id))
  }

  /**
   * Handles portfolio publishing
   * TODO: Implement API call to update publish status
   */
  const handlePublish = () => {
    setPublishStatus('published')
  }

  const handlePreview = () => {
    router.push('/cview/123') // Replace '123' with the actual portfolio ID
  }

  const handleSuspend = () => {
    setPublishStatus('suspended')
  }

  const handleShareLink = () => {
    setIsShareDialogOpen(true)
  }

  const portfolioLink = `https://yourdomain.com/cview/123` // Replace with actual domain and portfolio ID

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Portfolio Management</h1>
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <Label htmlFor="services">Services</Label>
                  <Textarea
                    id="services"
                    value={services}
                    onChange={(e) => setServices(e.target.value)}
                    placeholder="Your Services (comma-separated)"
                  />
                </div>
                <div>
                  <Label htmlFor="prices">Session Prices</Label>
                  <div className="space-y-2">
                    {services.split(',').map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          id={`price-${service}`}
                          type="number"
                          value={sessionPrices[service] || ''}
                          onChange={(e) => setSessionPrices({
                            ...sessionPrices,
                            [service]: parseFloat(e.target.value)
                          })}
                          placeholder={`Price for ${service}`}
                        />
                        <span className="text-sm text-gray-500">MYR</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Your Bio"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your Phone Number"
                  />
                </div>
                <div>
                  <Label>Social Media</Label>
                  <div className="space-y-2">
                    <Input
                      value={socialMedia.instagram}
                      onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                      placeholder="Instagram URL"
                    />
                    <Input
                      value={socialMedia.facebook}
                      onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                      placeholder="Facebook URL"
                    />
                    <Input
                      value={socialMedia.twitter}
                      onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                      placeholder="Twitter URL"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Portfolio Items</h3>
                  <div className="flex space-x-2 mb-4">
                    <Input
                      value={newItemUrl}
                      onChange={(e) => setNewItemUrl(e.target.value)}
                      placeholder="Image/Video URL"
                    />
                    <select
                      value={newItemType}
                      onChange={(e) => setNewItemType(e.target.value as 'image' | 'video')}
                      className="border rounded px-2"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <Button onClick={handleAddItem}>Add Item</Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {portfolioItems.map(item => (
                      <div key={item.id} className="relative">
                        {item.type === 'image' ? (
                          <img src={item.url} alt="Portfolio item" className="w-full h-40 object-cover rounded" />
                        ) : (
                          <video src={item.url} className="w-full h-40 object-cover rounded" controls />
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Publish Status</Label>
                  <p className="text-sm text-gray-500">Current status: {publishStatus}</p>
                </div>
                <div className="flex space-x-4">
                  <Button onClick={handlePublish} disabled={publishStatus === 'published'}>Publish</Button>
                  <Button onClick={handlePreview}>Preview</Button>
                  <Button onClick={handleSuspend} variant="destructive" disabled={publishStatus === 'suspended'}>Suspend</Button>
                  <Button onClick={handleShareLink}>Share Link</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Portfolio</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="mb-2">Share this link with your clients:</p>
            <div className="flex items-center space-x-2">
              <Input value={portfolioLink} readOnly />
              <Button
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(portfolioLink)
                  alert('Link copied to clipboard!')
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {publishStatus === 'suspended' && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Portfolio Suspended</AlertTitle>
          <AlertDescription>
            Your portfolio is currently suspended and not visible to clients. Publish it to make it available again.
          </AlertDescription>
        </Alert>
      )}
    </Layout>
  )
}

