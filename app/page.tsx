'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Folder, Image, DollarSign, CalendarIcon } from 'lucide-react'

/**
 * Mock data for appointments
 * TODO: Replace with actual API calls to fetch real appointment data
 * @type {Array<{id: number, client: string, date: string, time: string}>}
 */
const appointmentData = [
  { id: 1, client: "Alice Johnson", date: "2023-07-15", time: "10:00 AM" },
  { id: 2, client: "Bob Smith", date: "2023-07-16", time: "2:00 PM" },
  { id: 3, client: "Carol Williams", date: "2023-07-17", time: "11:30 AM" },
]

/**
 * Mock data for folders
 * TODO: Replace with actual API calls to fetch real folder data
 * @type {Array<{id: number, name: string, fileCount: number}>}
 */
const folderData = [
  { id: 1, name: "Wedding 2023", fileCount: 150 },
  { id: 2, name: "Portrait Session", fileCount: 75 },
  { id: 3, name: "Commercial Shoot", fileCount: 200 },
]

/**
 * Mock data for sales statistics
 * TODO: Replace with actual API calls to fetch real sales data
 * @type {Array<{name: string, total: number}>}
 */
const salesData = [
  { name: "Jan", total: 1500 },
  { name: "Feb", total: 2300 },
  { name: "Mar", total: 3200 },
  { name: "Apr", total: 2800 },
  { name: "May", total: 3500 },
  { name: "Jun", total: 4000 },
]

/**
 * Home/Dashboard Component
 * Main dashboard page displaying overview of:
 * - Appointments
 * - Folders and Images
 * - Revenue
 * - Calendar
 * - Recent Activities
 * 
 * @returns {JSX.Element} The rendered dashboard component
 */
export default function Home() {
  // State for selected date in calendar
  const [date, setDate] = useState<Date | undefined>(new Date())

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
            <div className="text-2xl font-bold">{folderData.length}</div>
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
            <div className="text-2xl font-bold">
              {/* Calculate total images across all folders */}
              {folderData.reduce((sum, folder) => sum + folder.fileCount, 0)}
            </div>
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
            <div className="text-2xl font-bold">
              {/* Calculate total revenue */}
              ${salesData.reduce((sum, month) => sum + month.total, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              +10% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        {/* Upcoming Appointments Card */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {appointmentData.map(appointment => (
                <div key={appointment.id} className="flex items-center">
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
            <div className="mt-4 flex justify-end">
              <Button asChild>
                <Link href="/appointments">View All Appointments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Card */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>
              Select a date to view or add appointments
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Recent Folders Card */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Folders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {folderData.map(folder => (
                <div key={folder.id} className="flex items-center">
                  <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{folder.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {folder.fileCount} files
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button asChild>
                <Link href="/folders">View All Folders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sales Overview Card */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Sales Bar Chart */}
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salesData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-end">
              <Button asChild>
                <Link href="/reports">View Full Report</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

