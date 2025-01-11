'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Instagram, Facebook, Twitter } from 'lucide-react'

interface PortfolioData {
  name: string
  services: string[]
  bio: string
  email: string
  phone: string
  socialMedia: {
    instagram: string
    facebook: string
    twitter: string
  }
  portfolioItems: { id: number; type: 'image' | 'video'; url: string }[]
  folders: { id: number; name: string; files: { id: number; name: string; url: string }[] }[]
  openSlots: { id: string; date: Date; time: string }[]
  sessionPrices: {[key: string]: number}
}

export default function ClientView() {
  const params = useParams()
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<{ id: string; time: string } | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending')

  useEffect(() => {
    // In a real application, fetch the portfolio data based on the ID
    // For now, we'll use mock data
    const mockData: PortfolioData = {
      name: "Jane Doe Photography",
      services: ["Wedding", "Portrait", "Event", "Commercial"],
      bio: "Passionate photographer with over 10 years of experience capturing life's most precious moments.",
      email: "contact@janedoephotography.com",
      phone: "(123) 456-7890",
      socialMedia: {
        instagram: "https://instagram.com/janedoephoto",
        facebook: "https://facebook.com/janedoephoto",
        twitter: "https://twitter.com/janedoephoto"
      },
      portfolioItems: [
        { id: 1, type: 'image', url: '/placeholder.svg' },
        { id: 2, type: 'image', url: '/placeholder.svg' },
        { id: 3, type: 'image', url: '/placeholder.svg' },
      ],
      folders: [
        { id: 1, name: 'Wedding 2023', files: [{ id: 1, name: 'photo1.jpg', url: '/placeholder.svg' }] },
        { id: 2, name: 'Portrait Session', files: [{ id: 2, name: 'photo2.jpg', url: '/placeholder.svg' }] },
      ],
      openSlots: [
        { id: '1', date: new Date('2023-07-01'), time: '10:00' },
        { id: '2', date: new Date('2023-07-02'), time: '14:00' },
      ],
      sessionPrices: {
        "Wedding": 2500,
        "Portrait": 500,
        "Event": 1000,
        "Commercial": 1500
      }
    }
    setPortfolioData(mockData)
  }, [params.id])

  if (!portfolioData) {
    return <div>Loading...</div>
  }

  const handleBookSlot = (slot: { id: string; time: string }) => {
    setSelectedSlot(slot)
    setIsBookingModalOpen(true)
  }

  const handleBookingSubmit = async () => {
    // Here you would typically send this data to your backend
    console.log('Booking submitted:', {
      clientName,
      clientEmail,
      clientPhone,
      selectedService,
      date: selectedDate,
      time: selectedSlot?.time
    })

    // Simulate payment process
    setPaymentStatus('pending')
    try {
      // In a real application, you would integrate with a payment gateway here
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      setPaymentStatus('success')
      // Close the modal and reset form after successful payment
      setTimeout(() => {
        setIsBookingModalOpen(false)
        setClientName('')
        setClientEmail('')
        setClientPhone('')
        setSelectedService('')
        setSelectedSlot(null)
        setPaymentStatus('pending')
      }, 2000)
    } catch (error) {
      setPaymentStatus('failed')
    }
  }

  const handlePayment = async () => {
    try {
      // Create payment session with Billplz
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          amount: portfolioData.sessionPrices[selectedService],
          description: `${selectedService} Session - ${selectedDate?.toDateString()} ${selectedSlot?.time}`,
          bookingDetails: {
            service: selectedService,
            date: selectedDate,
            time: selectedSlot?.time,
          }
        }),
      });

      const { billplzUrl } = await response.json();
      window.location.href = billplzUrl; // Redirect to Billplz payment page
    } catch (error) {
      console.error('Payment creation failed:', error);
      setPaymentStatus('failed');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{portfolioData.name}</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Tabs defaultValue="portfolio" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="booking">Booking</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="portfolio">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <Carousel className="w-full max-w-xs mx-auto">
                    <CarouselContent>
                      {portfolioData.portfolioItems.map(item => (
                        <CarouselItem key={item.id}>
                          {item.type === 'image' ? (
                            <img src={item.url} alt="Portfolio item" className="w-full h-60 object-cover rounded" />
                          ) : (
                            <video src={item.url} className="w-full h-60 object-cover rounded" controls />
                          )}
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </CardContent>
              </Card>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {portfolioData.folders.map(folder => (
                  <Card key={folder.id}>
                    <CardHeader>
                      <CardTitle>{folder.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2">
                        {folder.files.map(file => (
                          <img key={file.id} src={file.url} alt={file.name} className="w-full h-20 object-cover rounded" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{portfolioData.bio}</p>
                  <h3 className="font-semibold mt-4 mb-2">Services</h3>
                  <ul className="list-disc list-inside">
                    {portfolioData.services.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="booking">
              <Card>
                <CardHeader>
                  <CardTitle>Book a Session</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Available Slots</h3>
                      <ul className="space-y-2">
                        {portfolioData.openSlots
                          .filter(slot => slot.date.toDateString() === selectedDate?.toDateString())
                          .map(slot => (
                            <li key={slot.id}>
                              <Button variant="outline" onClick={() => handleBookSlot(slot)}>{slot.time}</Button>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Get in touch for inquiries or to book a session!</p>
                  <div className="space-y-2">
                    <p>Email: {portfolioData.email}</p>
                    <p>Phone: {portfolioData.phone}</p>
                  </div>
                  <div className="mt-4 flex space-x-4">
                    <a href={portfolioData.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                      <Instagram />
                    </a>
                    <a href={portfolioData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                      <Facebook />
                    </a>
                    <a href={portfolioData.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                      <Twitter />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Your Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="clientName">Name</Label>
              <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="clientEmail">Email</Label>
              <Input id="clientEmail" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="clientPhone">Phone</Label>
              <Input id="clientPhone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="service">Service</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {portfolioData.services.map((service) => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p>Selected Date: {selectedDate?.toDateString()}</p>
              <p>Selected Time: {selectedSlot?.time}</p>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold mb-2">Booking Summary</h3>
              <p>Date: {selectedDate?.toDateString()}</p>
              <p>Time: {selectedSlot?.time}</p>
              <p>Service: {selectedService}</p>
              {selectedService && (
                <p className="text-lg font-bold mt-2">
                  Price: MYR {portfolioData.sessionPrices[selectedService].toFixed(2)}
                </p>
              )}
            </div>
            {paymentStatus === 'pending' && (
              <Button 
                onClick={handlePayment}
                disabled={!clientName || !clientEmail || !clientPhone || !selectedService}
                className="w-full"
              >
                Proceed to Payment
              </Button>
            )}
            {paymentStatus === 'success' && (
              <div className="text-green-600">Payment successful! Your booking is confirmed.</div>
            )}
            {paymentStatus === 'failed' && (
              <div className="text-red-600">Payment failed. Please try again.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

