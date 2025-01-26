'use client'

import { useState, useEffect } from 'react'
import { database } from '@/lib/firebase'
import { ref, onValue, push, set, remove, update } from 'firebase/database'
import type { AvailableSlot, Booking, BookingForm, Portfolio } from '@/types/firebase'
import { format, parseISO } from 'date-fns'

export function useClientBooking(photographerId: string) {
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [bookingStep, setBookingStep] = useState(1)
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    service: '',
    startTime: '',
    endTime: '',
  })

  useEffect(() => {
    if (!photographerId) {
      setLoading(false)
      return
    }

    const slotsRef = ref(database, `availableSlots/${photographerId}`)
    const slotsUnsubscribe = onValue(slotsRef, (snapshot) => {
      const slots: AvailableSlot[] = []
      snapshot.forEach((childSnapshot) => {
        const slotData = childSnapshot.val()
        slots.push({
          id: childSnapshot.key!,
          photographerId: slotData.photographerId,
          dates: slotData.dates.map((date: string) => format(new Date(date), 'yyyy-MM-dd')),
          createdAt: slotData.createdAt
        })
      })
      setAvailableSlots(slots)
    })

    const bookingsRef = ref(database, `bookings/${photographerId}`)
    const bookingsUnsubscribe = onValue(bookingsRef, (snapshot) => {
      const bookingsData: Booking[] = []
      snapshot.forEach((childSnapshot) => {
        const bookingData = childSnapshot.val()
        bookingsData.push({
          id: childSnapshot.key!,
          ...bookingData,
          date: format(new Date(bookingData.date), 'yyyy-MM-dd')
        })
      })
      setBookings(bookingsData)
      setLoading(false)
    })

    return () => {
      slotsUnsubscribe()
      bookingsUnsubscribe()
    }
  }, [photographerId])

  const bookSlot = async (bookingData: Omit<Booking, 'id'>) => {
    if (!photographerId) return

    try {
      // Create new booking
      const newBookingRef = push(ref(database, `bookings/${photographerId}`))
      await set(newBookingRef, {
        ...bookingData,
        status: 'upcoming',
        createdAt: new Date().toISOString()
      })

      // Remove booked date from available slots
      const bookedDate = bookingData.date
      const slotToUpdate = availableSlots.find(slot => 
        slot.dates.includes(bookedDate)
      )

      if (slotToUpdate) {
        const updatedDates = slotToUpdate.dates.filter(date => date !== bookedDate)
        
        if (updatedDates.length === 0) {
          await remove(ref(database, `availableSlots/${photographerId}/${slotToUpdate.id}`))
        } else {
          await update(ref(database, `availableSlots/${photographerId}/${slotToUpdate.id}`), {
            dates: updatedDates
          })
        }
      }
    } catch (err) {
      console.error('Error booking slot:', err)
      throw err
    }
  }

  const calculateTotal = (startTime: string, endTime: string, pricePerHour: number) => {
    const startHour = parseInt(startTime.split(':')[0])
    const endHour = parseInt(endTime.split(':')[0])
    return (pricePerHour || 0) * (endHour - startHour)
  }

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !bookings) return []
    
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
    const dayBookings = bookings.filter(b => b.date === selectedDateStr)
    
    const allStartTimes = Array.from({ length: 12 }, (_, i) => {
      const hour = 9 + i
      return `${hour.toString().padStart(2, '0')}:00`
    })

    return allStartTimes.filter(startTime => {
      const [startHour] = startTime.split(':').map(Number)
      const endHour = startHour + 1
      
      return !dayBookings.some(booking => {
        const bookingStart = parseInt(booking.startTime.split(':')[0])
        const bookingEnd = parseInt(booking.endTime.split(':')[0])
        return (
          (startHour >= bookingStart - 2 && startHour < bookingEnd + 2) ||
          (endHour > bookingStart - 2 && endHour <= bookingEnd + 2)
        )
      })
    })
  }

  const getAvailableEndTimes = (startTime: string) => {
    if (!selectedDate || !bookings || !startTime) return []
    
    const startHour = parseInt(startTime.split(':')[0])
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
    const dayBookings = bookings.filter(b => b.date === selectedDateStr)
    
    return Array.from({ length: 21 - startHour }, (_, i) => {
      const endHour = startHour + i + 1
      return endHour <= 21 ? `${endHour.toString().padStart(2, '0')}:00` : null
    }).filter(endTime => {
      if (!endTime) return false
      const endHour = parseInt(endTime.split(':')[0])
      
      return !dayBookings.some(booking => {
        const bookingStart = parseInt(booking.startTime.split(':')[0])
        const bookingEnd = parseInt(booking.endTime.split(':')[0])
        return (
          (startHour >= bookingStart - 2 && startHour < bookingEnd + 2) ||
          (endHour > bookingStart - 2 && endHour <= bookingEnd + 2)
        )
      })
    })
  }
  
  const handleBookingSubmit = async (portfolio: Portfolio) => {
    if (!selectedDate || !portfolio) return
  
    const startHour = parseInt(bookingForm.startTime.split(':')[0])
    const endHour = parseInt(bookingForm.endTime.split(':')[0])
    const duration = endHour - startHour
    const totalPrice = duration * portfolio.pricePerHour
  
    if (startHour >= endHour) {
      alert('End time must be after start time')
      return
    }
  
    try {
      const bookingData = {
        photographerId,
        clientName: bookingForm.clientName,
        clientEmail: bookingForm.clientEmail,
        clientPhone: bookingForm.clientPhone,
        service: bookingForm.service,
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: bookingForm.startTime,
        endTime: bookingForm.endTime,
        duration,
        totalPrice,
        status: 'upcoming',
        createdAt: new Date().toISOString()
      }
  
      await bookSlot(bookingData)
      setBookingStep(2)
    } catch (error) {
      console.error('Booking failed:', error)
      throw error
    }
  }

  return {
    availableSlots,
    bookings,
    loading,
    selectedDate,
    setSelectedDate,
    bookingForm,
    setBookingForm,
    bookingStep,
    setBookingStep,
    bookSlot,
    handleBookingSubmit,
    calculateTotal,
    getAvailableTimeSlots,
    getAvailableEndTimes
  }
}