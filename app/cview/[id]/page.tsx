'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Instagram, Facebook, Twitter } from 'lucide-react'
import { useClientBooking } from '@/hooks/useClientBooking'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useFolders } from '@/hooks/useFolders'
import { Folder } from '@/types/firebase'
import { format } from 'date-fns'

export default function ClientView() {
  const params = useParams()
  const photographerId = params.id as string
  const { portfolio } = usePortfolio(photographerId)
  const { availableSlots, loading, bookSlot } = useClientBooking(photographerId)
  const { loading: foldersLoading, getAllImages } = useFolders(photographerId)
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [bookingStep, setBookingStep] = useState(1) // 1: Form, 2: Success
  const [bookingForm, setBookingForm] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    service: '',
    hours: '1',
    startTime: '09:00'
  })
  const calculateTotal = () => {
    return portfolio?.pricePerHour ? portfolio.pricePerHour * parseInt(bookingForm.hours) : 0
  }

  const handleBookingSubmit = async () => {
    if (!selectedDate || !portfolio) return

    try {
      await bookSlot({
        photographerId,
        clientName: bookingForm.clientName,
        clientEmail: bookingForm.clientEmail,
        clientPhone: bookingForm.clientPhone,
        service: bookingForm.service,
        date: selectedDate.toISOString(),
        startTime: bookingForm.startTime,
        hours: parseInt(bookingForm.hours),
        totalPrice: calculateTotal(),
        status: 'confirmed'
      })
      setBookingStep(2)
    } catch (error) {
      console.error('Booking failed:', error)
    }
  }

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = 9 + i
    return `${hour.toString().padStart(2, '0')}:00`
  })

  // Get all portfolio images
  const portfolioImages = getAllImages()

  if (loading || foldersLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{portfolio?.name}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
  <Card>
    <CardContent className="pt-6">
      {portfolioImages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No portfolio images available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolioImages.map((image) => (
            <div key={image.id} className="p-1">
              <img
                src={image.url}
                alt={image.name}
                className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImage(image.url)}
              />
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{portfolio?.bio}</p>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Services</h3>
                  <ul className="space-y-2">
                    {portfolio?.services.map((service, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="booking">
            <Card>
              <CardHeader>
                <CardTitle>Available Dates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled={(date) => {
                      // Disable dates that are not in available slots and past dates
                      const dateStr = date.toISOString().split('T')[0]
                      const isAvailable = availableSlots.some(slot => 
                        slot.dates.includes(dateStr)
                      )
                      return !isAvailable || date < new Date()
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-4">Selected Date</h3>
                    {selectedDate && (
                      <div className="space-y-4">
                        <p>{format(selectedDate, 'MMMM d, yyyy')}</p>
                        <Button 
                          onClick={() => setIsBookingModalOpen(true)}
                          className="w-full"
                        >
                          Book Now
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Image Preview Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <div className="relative">
            <img 
              src={selectedImage || ''} 
              alt="Preview" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bookingStep === 1 ? 'Book Your Session' : 'Booking Successful!'}
            </DialogTitle>
          </DialogHeader>

          {bookingStep === 1 ? (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={bookingForm.clientName}
                  onChange={(e) => setBookingForm({...bookingForm, clientName: e.target.value})}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={bookingForm.clientEmail}
                  onChange={(e) => setBookingForm({...bookingForm, clientEmail: e.target.value})}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={bookingForm.clientPhone}
                  onChange={(e) => setBookingForm({...bookingForm, clientPhone: e.target.value})}
                />
              </div>
              <div>
                <Label>Service</Label>
                <Select
                  value={bookingForm.service}
                  onValueChange={(value) => setBookingForm({...bookingForm, service: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {portfolio?.services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Session Hours</Label>
                <Select
                  value={bookingForm.hours}
                  onValueChange={(value) => setBookingForm({...bookingForm, hours: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select hours" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6].map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour} hour{hour > 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Time</Label>
                <Select
                  value={bookingForm.startTime}
                  onValueChange={(value) => setBookingForm({...bookingForm, startTime: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="font-semibold mb-2">Booking Summary</h3>
                <p>Date: {selectedDate?.toLocaleDateString()}</p>
                <p>Total Price: MYR {calculateTotal().toFixed(2)}</p>
              </div>
              <Button onClick={handleBookingSubmit} className="w-full">
                Proceed to Payment
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-green-600 mb-4">Payment successful! Your booking is confirmed.</p>
              <Button onClick={() => {
                setIsBookingModalOpen(false)
                setBookingStep(1)
              }}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
