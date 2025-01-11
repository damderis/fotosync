'use client'

import { useState } from 'react'
import Layout from '../../components/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

// Mock data
const monthlyData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4500 },
  { month: 'May', sales: 6000 },
  { month: 'Jun', sales: 5500 },
]

const servicesData = [
  { name: 'Wedding', value: 400 },
  { name: 'Portrait', value: 300 },
  { name: 'Event', value: 300 },
  { name: 'Commercial', value: 200 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function Reports() {
  const [year, setYear] = useState('2023')
  const [activeModal, setActiveModal] = useState<'monthly' | 'services' | null>(null)

  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.sales, 0)
  const mostBookedMonth = monthlyData.reduce((max, month) => max.sales > month.sales ? max : month)
  const mostBookedService = servicesData.reduce((max, service) => max.value > service.value ? max : service)

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Sales Reports</h1>
      <div className="mb-6">
        <Select onValueChange={setYear} defaultValue={year}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For the year {year}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Booked Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostBookedMonth.month}</div>
            <p className="text-xs text-muted-foreground">RM {mostBookedMonth.sales.toLocaleString()} in sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Booked Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostBookedService.name}</div>
            <p className="text-xs text-muted-foreground">{mostBookedService.value} bookings</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            <Button className="mt-4 w-full" onClick={() => setActiveModal('monthly')}>View Details</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Services Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={servicesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {servicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <Button className="mt-4 w-full" onClick={() => setActiveModal('services')}>View Details</Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeModal === 'monthly' ? 'Monthly Sales Details' : 'Services Breakdown Details'}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">{activeModal === 'monthly' ? 'Month' : 'Service'}</th>
                  <th className="text-right">{activeModal === 'monthly' ? 'Sales (RM)' : 'Bookings'}</th>
                </tr>
              </thead>
              <tbody>
                {activeModal === 'monthly'
                  ? monthlyData.map((month) => (
                      <tr key={month.month}>
                        <td>{month.month}</td>
                        <td className="text-right">{month.sales.toLocaleString()}</td>
                      </tr>
                    ))
                  : servicesData.map((service) => (
                      <tr key={service.name}>
                        <td>{service.name}</td>
                        <td className="text-right">{service.value}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

