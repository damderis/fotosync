'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'

interface OpenSlot {
  id: string
  date: Date
  time: string
}

interface Booking {
  id: string
  date: Date
  time: string
  clientName: string
  clientEmail: string
  clientPhone: string
  service: string
}

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState('00:00')
  const [openSlots, setOpenSlots] = useState<OpenSlot[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    // Simulating data fetch
    setOpenSlots([
      { id: '1', date: new Date('2023-07-01'), time: '10:00' },
      { id: '2', date: new Date('2023-07-02'), time: '14:00' },
    ])
    setBookings([
      {
        id: '1',
        date: new Date('2023-07-03'),
        time: '11:00',
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        clientPhone: '(123) 456-7890',
        service: 'Wedding'
      },
      // Add more mock bookings as needed
    ])
  }, [])

  const handleAddSlot = () => {
    if (selectedDate) {
      const newSlot: OpenSlot = {
        id: Date.now().toString(),
        date: selectedDate,
        time: selectedTime,
      }
      setOpenSlots([...openSlots, newSlot])
    }
  }

  const handleRemoveSlot = (id: string) => {
    setOpenSlots(openSlots.filter(slot => slot.id !== id))
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Appointment System</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Create Open Slots</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={handleAddSlot}>Add Open Slot</Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Open Slots</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openSlots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>{format(slot.date, 'yyyy-MM-dd')}</TableCell>
                  <TableCell>{slot.time}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveSlot(slot.id)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Bookings</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Service</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{format(booking.date, 'yyyy-MM-dd')}</TableCell>
                <TableCell>{booking.time}</TableCell>
                <TableCell>{booking.clientName}</TableCell>
                <TableCell>{booking.clientEmail}</TableCell>
                <TableCell>{booking.clientPhone}</TableCell>
                <TableCell>{booking.service}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  )
}

