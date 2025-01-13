'use client'

import { useState } from 'react'
import Layout from '../../components/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MoreHorizontal } from 'lucide-react'
import { format, addDays } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppointments } from '@/hooks/useAppointments'
import type { Booking } from '@/types/firebase'

export default function Appointments() {
  const { availableSlots, bookings, createSlot, removeSlot, cancelBooking } = useAppointments()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const handleCreateSlot = async () => {
    if (!selectedDate) return
    
    try {
      // Add one day to fix the date offset issue
      const adjustedDate = addDays(selectedDate, 1)
      await createSlot([adjustedDate.toISOString().split('T')[0]])
      setSelectedDate(undefined)
    } catch (error) {
      console.error('Error creating slot:', error)
    }
  }

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsViewModalOpen(true)
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Slot Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create Available Slot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
              {selectedDate && (
                <div>
                  <h3 className="font-medium mb-2">Selected Date:</h3>
                  <p>{format(selectedDate, 'MMMM d, yyyy')}</p>
                </div>
              )}
              <Button 
                onClick={handleCreateSlot}
                disabled={!selectedDate}
                className="w-full"
              >
                Create Slot
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Slots Card */}
        <Card>
          <CardHeader>
            <CardTitle>Available Slots</CardTitle>
          </CardHeader>
          <CardContent>
            {availableSlots.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No available slots</p>
            ) : (
              <div className="space-y-4">
                {availableSlots.map((slot) => (
                  <div 
                    key={slot.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        {slot.dates.map((date) => (
                          <p key={date} className="mb-1">
                            {format(new Date(date), 'MMMM d, yyyy')}
                          </p>
                        ))}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => removeSlot(slot.id)}
                          >
                            Remove Slot
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bookings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No bookings yet</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{booking.clientName}</p>
                      <p className="text-sm text-gray-500">{booking.service}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewBooking(booking)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => cancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Booking Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Client Name</p>
                  <p className="font-medium">{selectedBooking.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-medium">{selectedBooking.service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedBooking.clientEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedBooking.clientPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedBooking.date), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Time</p>
                  <p className="font-medium">{selectedBooking.startTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{selectedBooking.hours} hours</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="font-medium">MYR {selectedBooking.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

