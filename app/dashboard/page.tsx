'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Folder, Image, DollarSign, CalendarIcon, X } from 'lucide-react'
import { useAppointments } from '@/hooks/useAppointments'
import { useFolders } from '@/hooks/useFolders'
import { format } from 'date-fns'

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const { bookings } = useAppointments()
  const { folders, getAllImages } = useFolders()
  const images = getAllImages()

  // Filter appointments when date changes
  const filteredAppointments = date 
    ? bookings.filter(booking => 
        booking.date === format(date, 'yyyy-MM-dd')
      )
    : bookings.slice(0, 3) // Show only 3 most recent bookings if no date selected

  // Clear date selection
  const handleClearDate = () => {
    setDate(undefined)
  }

  return (
    <Layout>
      <div className="px-8 py-1">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">
                Appointments scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Folders</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{folders.length}</div>
              <p className="text-xs text-muted-foreground">
                Active folders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Images</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{images.length}</div>
              <p className="text-xs text-muted-foreground">
                Images uploaded
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar and Appointments Section */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className='flex justify-between'>Recent Appointments
                <Button asChild>
                    <Link href="/appointments">View All Appointments</Link>
                </Button>
            </CardTitle>    
            </CardHeader>
            <CardContent>
              <div>
                {filteredAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAppointments.map(booking => (
                      <div key={booking.id} className="flex items-center p-3 border rounded-lg">
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">{booking.clientName}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(booking.date), 'MMM dd, yyyy')} at {booking.startTime}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.service}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No appointments {date ? 'for this date' : 'found'}
                  </div>
                )}

                
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
} 