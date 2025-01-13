import { useState, useEffect } from 'react'
import { ref, onValue, push, set, remove } from 'firebase/database'
import { db } from '@/utils/firebase'
import { useAuth } from '@clerk/nextjs'
import type { AvailableSlot, Booking } from '@/types/firebase'

export function useAppointments() {
  const { userId } = useAuth()
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    // Subscribe to available slots
    const slotsRef = ref(db, `availableSlots/${userId}`)
    const unsubscribeSlots = onValue(slotsRef, (snapshot) => {
      const slots: AvailableSlot[] = []
      snapshot.forEach((childSnapshot) => {
        slots.push({
          id: childSnapshot.key!,
          ...childSnapshot.val()
        })
      })
      setAvailableSlots(slots)
    })

    // Subscribe to bookings
    const bookingsRef = ref(db, `bookings/${userId}`)
    const unsubscribeBookings = onValue(bookingsRef, (snapshot) => {
      const bookingsList: Booking[] = []
      snapshot.forEach((childSnapshot) => {
        bookingsList.push({
          id: childSnapshot.key!,
          ...childSnapshot.val()
        })
      })
      setBookings(bookingsList)
      setLoading(false)
    })

    return () => {
      unsubscribeSlots()
      unsubscribeBookings()
    }
  }, [userId])

  const createSlot = async (dates: string[]) => {
    if (!userId) return

    const newSlotRef = push(ref(db, `availableSlots/${userId}`))
    await set(newSlotRef, {
      dates,
      createdAt: new Date().toISOString(),
      photographerId: userId
    })
  }

  const removeSlot = async (slotId: string) => {
    if (!userId) return
    await remove(ref(db, `availableSlots/${userId}/${slotId}`))
  }

  const cancelBooking = async (bookingId: string) => {
    if (!userId) return
    await remove(ref(db, `bookings/${userId}/${bookingId}`))
  }

  return {
    availableSlots,
    bookings,
    loading,
    createSlot,
    removeSlot,
    cancelBooking
  }
} 