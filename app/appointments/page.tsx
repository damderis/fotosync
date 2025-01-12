'use client'

import { useState } from 'react'
import Layout from '../../components/Layout'
import { Theme, Box, Card, Button, ScrollArea, Text, Flex } from '@radix-ui/themes'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import '@radix-ui/themes/styles.css'
import { useAuth } from '@clerk/nextjs'
import { useAppointments } from '@/hooks/useAppointments'
import { CalendarIcon, Clock, X } from 'lucide-react'

export default function Appointments() {
  const { userId } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState('00:00')
  const { openSlots, bookings, loading, error, addSlot, removeSlot } = useAppointments()

  const handleAddSlot = async () => {
    console.log("Add Slot button clicked")
    if (!selectedDate) return
    try {
      await addSlot(selectedDate, selectedTime)
      console.log("Slot added")
      setSelectedTime('00:00')
    } catch (error) {
      console.error('Error adding slot:', error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Layout>
      <Theme>
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-3 gap-8">
            {/* Create Slots Card */}
            <Card>
              <Box p="5">
                <Text size="5" weight="bold" mb="1">Create Slots</Text>
                <Text size="2" color="gray" mb="4">Add new appointment slots</Text>
                
                <Flex direction="column" gap="4">
                  <Box className="bg-gray-100 rounded-lg p-3">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="w-full"
                      disabled={(date) => date < new Date()}
                    />
                  </Box>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full pl-10 h-10 rounded-md border px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleAddSlot} 
                    disabled={!selectedDate}
                  >
                    Add Slot
                  </Button>
                </Flex>
              </Box>
            </Card>

            {/* Open Slots Card */}
            <Card>
              <Box p="5">
                <Text size="5" weight="bold" mb="1">Available Slots</Text>
                <Text size="2" color="gray" mb="4">Currently open appointment slots</Text>
                
                <ScrollArea>
                  {openSlots.length === 0 ? (
                    <Text align="center" color="gray" mt="4">
                      No open slots yet.
                    </Text>
                  ) : (
                    <div className="space-y-3">
                      {openSlots.map((slot) => (
                        <Flex 
                          key={slot.id} 
                          justify="between" 
                          align="center"
                          p="3"
                          className="border rounded-lg"
                        >
                          <Flex gap="3" align="center">
                            <CalendarIcon className="h-4 w-4 text-gray-500" />
                            <div>
                              <Text weight="medium">
                                {format(new Date(slot.date), 'MMMM d, yyyy')}
                              </Text>
                              <Text size="2" color="gray">
                                {slot.time}
                              </Text>
                            </div>
                          </Flex>
                          <Button 
                            color="red" 
                            variant="soft"
                            onClick={() => removeSlot(slot.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </Flex>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </Box>
            </Card>

            {/* Bookings Card */}
            <Card>
              <Box p="5">
                <Text size="5" weight="bold" mb="1">Bookings</Text>
                <Text size="2" color="gray" mb="4">Your confirmed bookings</Text>
                
                <ScrollArea>
                  {bookings.length === 0 ? (
                    <Text align="center" color="gray" mt="4">
                      No bookings yet.
                    </Text>
                  ) : (
                    <div className="space-y-3">
                      {bookings.map((booking) => (
                        <div 
                          key={booking.id} 
                          className="p-3 border rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <Text weight="medium">{booking.clientName}</Text>
                              <Text size="2" color="gray">
                                {format(new Date(booking.date), 'MMMM d, yyyy')} at {booking.time}
                              </Text>
                              <Text size="2" color="gray">{booking.service}</Text>
                            </div>
                            <Text size="2" className={`px-2 py-1 rounded ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </Text>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </Box>
            </Card>
          </div>
        </div>
      </Theme>
    </Layout>
  )
}

