import { useState, useEffect } from 'react'
import { database } from '@/lib/firebase'
import { ref, onValue, push, set, remove, update } from 'firebase/database'
import { useAuth } from '@clerk/nextjs'
import { format, addDays, isBefore, startOfDay, parseISO } from 'date-fns'
import type { Booking, AvailableSlot } from '@/types/firebase'

export function useAppointments() {
  const { userId } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch bookings and slots
  useEffect(() => {
    if (!userId) return

    // Subscribe to bookings
    const bookingsRef = ref(database, `bookings/${userId}`)
    const bookingsUnsubscribe = onValue(bookingsRef, (snapshot) => {
      const bookingsData: Booking[] = []
      snapshot.forEach((childSnapshot) => {
        bookingsData.push({
          id: childSnapshot.key!,
          ...childSnapshot.val()
        })
      })
      setBookings(bookingsData)
    })

    // Subscribe to available slots
    const slotsRef = ref(database, `availableSlots/${userId}`)
    const slotsUnsubscribe = onValue(slotsRef, (snapshot) => {
      const slotsData: AvailableSlot[] = []
      snapshot.forEach((childSnapshot) => {
        slotsData.push({
          id: childSnapshot.key!,
          ...childSnapshot.val()
        })
      })
      setAvailableSlots(slotsData)
      setLoading(false)
    })

    return () => {
      bookingsUnsubscribe()
      slotsUnsubscribe()
    }
  }, [userId])

  // Create available slot
  const createSlot = async (dates: string[]) => {
    if (!userId) return

    try {
      const newSlot = {
        photographerId: userId,
        dates: dates.map(date => format(new Date(date), 'yyyy-MM-dd')),
        createdAt: new Date().toISOString()
      }

      const newSlotRef = push(ref(database, `availableSlots/${userId}`))
      await set(newSlotRef, newSlot)
    } catch (err) {
      console.error('Error creating slot:', err)
      throw err
    }
  }

  // Remove available slot
  const removeSlot = async (slotId: string) => {
    if (!userId) return

    try {
      await remove(ref(database, `availableSlots/${userId}/${slotId}`))
    } catch (err) {
      console.error('Error removing slot:', err)
      throw err
    }
  }

  // Cancel booking
  const cancelBooking = async (bookingId: string) => {
    if (!userId) return

    try {
      await update(ref(database, `bookings/${userId}/${bookingId}`), {
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      })
    } catch (err) {
      console.error('Error cancelling booking:', err)
      throw err
    }
  }

  // Mark booking as completed
  const completeBooking = async (bookingId: string) => {
    await update(ref(database, `bookings/${userId}/${bookingId}`), {
      status: 'completed',
      endTime: new Date().toISOString(), // Add actual end time if needed
      updatedAt: new Date().toISOString()
    })
  }

  // Cleanup past slots
  const cleanupPastSlots = async () => {
    if (!userId) return

    try {
      const today = startOfDay(new Date())
      
      // Filter out past slots locally
      const updatedSlots = availableSlots.filter(slot => {
        return slot.dates.some(date => !isBefore(new Date(date), today))
      })

      // Update slots in database
      const removedSlots = availableSlots.filter(slot => 
        !updatedSlots.find(us => us.id === slot.id)
      )

      // Delete past slots from database
      await Promise.all(
        removedSlots.map(slot => 
          remove(ref(database, `availableSlots/${userId}/${slot.id}`))
        )
      )

      // Update past bookings to completed
      const pastBookings = bookings.filter(booking => 
        booking.status === 'upcoming' && 
        isBefore(new Date(booking.date), today)
      )

      await Promise.all(
        pastBookings.map(booking => 
          update(ref(database, `bookings/${userId}/${booking.id}`), {
            status: 'completed',
            updatedAt: new Date().toISOString()
          })
        )
      )
    } catch (err) {
      console.error('Error cleaning up past slots:', err)
      throw err
    }
  }

  return {
    bookings,
    availableSlots,
    loading,
    error,
    createSlot,
    removeSlot,
    cancelBooking,
    completeBooking,
    cleanupPastSlots
  }
} 