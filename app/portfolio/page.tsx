'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../../components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { AlertCircle, Copy } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from '@clerk/nextjs'
import { usePortfolio } from '@/hooks/usePortfolio'

export default function Portfolio() {
  const router = useRouter()
  const { userId } = useAuth()
  const { portfolio, loading, error, createOrUpdatePortfolio, publishPortfolio, suspendPortfolio } = usePortfolio(userId || '')
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    services: '',
    bio: '',
    email: '',
    phone: '',
    pricePerHour: 0,
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: ''
    }
  })
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  // Update form data when portfolio is loaded
  useEffect(() => {
    if (portfolio) {
      setFormData({
        name: portfolio.name,
        services: Array.isArray(portfolio.services) 
          ? portfolio.services.join(',')
          : '',
        bio: portfolio.bio,
        email: portfolio.email || '',
        phone: portfolio.phone || '',
        pricePerHour: portfolio.pricePerHour || 0,
        socialMedia: {
          instagram: portfolio.instagramUrl || '',
          facebook: portfolio.facebookUrl || '',
          twitter: portfolio.twitterUrl || ''
        }
      })
    }
  }, [portfolio])

  const handleSave = async () => {
    if (!userId) return

    const updatedPortfolio = {
      id: portfolio?.id || Date.now().toString(),
      userId,
      name: formData.name,
      bio: formData.bio,
      services: formData.services
        ? formData.services.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      email: formData.email,
      phone: formData.phone,
      instagramUrl: formData.socialMedia.instagram,
      facebookUrl: formData.socialMedia.facebook,
      twitterUrl: formData.socialMedia.twitter,
      pricePerHour: formData.pricePerHour,
      status: portfolio?.status || 'draft',
      createdAt: portfolio?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await createOrUpdatePortfolio(updatedPortfolio)
    setIsEditing(false)
  }

  const handlePreview = () => {
    if (portfolio) {
      router.push(`/cview/${userId}`)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Layout>
      <div className="px-8 py-1">
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
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="services">Services</Label>
                    <Textarea
                      id="services"
                      value={formData.services}
                      onChange={(e) => setFormData({...formData, services: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Enter services separated by commas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">About Me</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricePerHour">Price per Hour (MYR)</Label>
                    <Input
                      id="pricePerHour"
                      type="number"
                      value={formData.pricePerHour}
                      onChange={(e) => setFormData({...formData, pricePerHour: parseFloat(e.target.value)})}
                      disabled={!isEditing}
                    />
                  </div>
                  {isEditing ? (
                    <Button onClick={handleSave}>Save Changes</Button>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>Edit</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={formData.socialMedia.instagram}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia, instagram: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={formData.socialMedia.facebook}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia, facebook: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={formData.socialMedia.twitter}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia, twitter: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex gap-4">
          <Button onClick={() => publishPortfolio()}>Publish</Button>
          <Button onClick={handlePreview} variant="outline">Preview</Button>
          <Button onClick={() => suspendPortfolio()} variant="destructive">Suspend</Button>
        </div>

        {portfolio?.status === 'suspended' && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Portfolio Suspended</AlertTitle>
            <AlertDescription>
              Your portfolio is currently suspended and not visible to clients. Publish it to make it available again.
            </AlertDescription>
          </Alert>
        )}

        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Your Portfolio</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <p className="mb-2">Share this link with your clients:</p>
              <div className="flex items-center space-x-2">
                <Input value={`${window.location.origin}/cview/${userId}`} readOnly />
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/cview/${userId}`)
                    alert('Link copied to clipboard!')
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
