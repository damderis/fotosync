'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Folder, Image, DollarSign, CalendarIcon, X } from 'lucide-react'

/**
 * Mock data for appointments
 * TODO: Replace with actual API calls to fetch real appointment data
 */
const appointmentData = [
  { id: 1, client: "Alice Johnson", date: "2023-07-15", time: "10:00 AM" },
  { id: 2, client: "Bob Smith", date: "2023-07-16", time: "2:00 PM" },
  { id: 3, client: "Carol Williams", date: "2023-07-17", time: "11:30 AM" },
]

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [filteredAppointments, setFilteredAppointments] = useState(appointmentData)

  // Filter appointments when date changes
  useEffect(() => {
    if (!date) {
      setFilteredAppointments(appointmentData)
      return
    }

    const selectedDate = date.toISOString().split('T')[0]
    const filtered = appointmentData.filter(
      appointment => appointment.date === selectedDate
    )
    setFilteredAppointments(filtered)
  }, [date])

  // Clear date selection
  const handleClearDate = () => {
    setDate(undefined)
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Statistics Cards Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Appointments Stats Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointmentData.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        {/* Folders Stats Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Folders</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              +1 from last week
            </p>
          </CardContent>
        </Card>

        {/* Images Stats Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">425</div>
            <p className="text-xs text-muted-foreground">
              +200 from last month
            </p>
          </CardContent>
        </Card>

        {/* Revenue Stats Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$17,300</div>
            <p className="text-xs text-muted-foreground">
              +10% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Combined Appointments and Calendar Section */}
      <div className="mt-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>
                  {date 
                    ? `Showing appointments for ${date.toLocaleDateString()}`
                    : 'Showing all upcoming appointments'}
                </CardDescription>
              </div>
              {date && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearDate}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear date
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calendar Section */}
              <div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>

              {/* Appointments List Section */}
              <div>
                {filteredAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAppointments.map(appointment => (
                      <div key={appointment.id} className="flex items-center p-3 border rounded-lg">
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">{appointment.client}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No appointments found for this date
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <Button asChild>
                    <Link href="/appointments">View All Appointments</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

