'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useClientBooking } from '@/hooks/useClientBooking'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useFolders } from '@/hooks/useFolders'
import { format } from 'date-fns'

export default function ClientView() {
  const params = useParams()
  const photographerId = params.id as string
  const { portfolio } = usePortfolio(photographerId)
  const { 
    availableSlots,
    bookings,
    loading, 
    selectedDate,
    setSelectedDate,
    bookingForm,
    setBookingForm,
    bookingStep,
    setBookingStep,
    handleBookingSubmit,
    calculateTotal,
    getAvailableTimeSlots,
    getAvailableEndTimes
  } = useClientBooking(photographerId)
  const { loading: foldersLoading, getAllImages } = useFolders(photographerId)
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const portfolioImages = getAllImages()

  if (loading || foldersLoading || !portfolio) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{portfolio.name}</h1>
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
                  <p className="text-gray-700">{portfolio.bio}</p>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Services</h3>
                  <ul className="space-y-2">
                    {portfolio.services.map((service, index) => (
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
                <CardTitle>Book a Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled={(date) => {
                      const dateStr = format(date, 'yyyy-MM-dd')
                      const isAvailable = availableSlots.some(slot => 
                        slot.dates.includes(dateStr)
                      )
                      return !isAvailable || date < new Date()
                    }}
                  />
                  
                  {selectedDate && (
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label>Service</Label>
                        <Select
                          value={bookingForm.service}
                          onValueChange={(value) => setBookingForm({...bookingForm, service: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                          <SelectContent>
                            {portfolio.services.map((service) => (
                              <SelectItem key={service} value={service}>
                                {service}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Time</Label>
                          <Select
                            value={bookingForm.startTime}
                            onValueChange={(value) => setBookingForm({
                              ...bookingForm, 
                              startTime: value,
                              endTime: ''
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select start" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableTimeSlots().map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>End Time</Label>
                          <Select
                            value={bookingForm.endTime}
                            onValueChange={(value) => setBookingForm({...bookingForm, endTime: value})}
                            disabled={!bookingForm.startTime}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select end" />
                            </SelectTrigger>
                            <SelectContent>
                              {bookingForm.startTime && 
                                getAvailableEndTimes(bookingForm.startTime).map((endTime) => (
                                  <SelectItem key={endTime} value={endTime}>
                                    {endTime}
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Input
                          placeholder="Full Name"
                          value={bookingForm.clientName}
                          onChange={(e) => setBookingForm({...bookingForm, clientName: e.target.value})}
                        />
                        <Input
                          type="email"
                          placeholder="Email"
                          value={bookingForm.clientEmail}
                          onChange={(e) => setBookingForm({...bookingForm, clientEmail: e.target.value})}
                        />
                        <Input
                          placeholder="Phone"
                          value={bookingForm.clientPhone}
                          onChange={(e) => setBookingForm({...bookingForm, clientPhone: e.target.value})}
                        />
                      </div>

                      <div className="p-4 bg-gray-50 rounded-md">
                        <h3 className="font-semibold mb-2">Booking Summary</h3>
                        <p>Date: {format(selectedDate, 'MMM dd, yyyy')}</p>
                        {bookingForm.startTime && bookingForm.endTime && (
                          <>
                            <p>Duration: {parseInt(bookingForm.endTime.split(':')[0]) - parseInt(bookingForm.startTime.split(':')[0])} hours</p>
                            <p>
                              Total Price: RM {calculateTotal(
                                bookingForm.startTime,
                                bookingForm.endTime,
                                portfolio.pricePerHour
                              ).toFixed(2)}
                            </p>
                          </>
                        )}
                      </div>

                      <Button 
                        onClick={() => handleBookingSubmit(portfolio)}
                        disabled={!bookingForm.startTime || !bookingForm.endTime}
                        className="w-full"
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <img 
            src={selectedImage || ''} 
            alt="Preview" 
            className="w-full h-auto rounded-lg"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={bookingStep === 2} onOpenChange={() => setBookingStep(1)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Confirmed!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-green-600 mb-4">
              Your booking has been successfully received.
            </p>
            <Button onClick={() => {
              setBookingStep(1)
              setSelectedDate(null)
              setBookingForm({
                clientName: '',
                clientEmail: '',
                clientPhone: '',
                service: '',
                startTime: '',
                endTime: ''
              })
            }}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}