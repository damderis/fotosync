'use client'

import { useState, useEffect } from 'react'
import { 
  ref, 
  query, 
  orderByChild, 
  equalTo, 
  onValue, 
  push,
  get,
  serverTimestamp,
  update
} from 'firebase/database'
import { db } from '@/utils/firebase'
import type { OpenSlot, Booking } from '@/types/firebase'

export function useClientBooking(photographerId: string) {
  const [availableSlots, setAvailableSlots] = useState<OpenSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch available slots for this photographer
  useEffect(() => {
    const slotsRef = ref(db, 'available_slots')
    const slotsQuery = query(
      slotsRef, 
      orderByChild('userId'), 
      equalTo(photographerId)
    )

    const unsubscribe = onValue(slotsQuery, 
      (snapshot) => {
        const slots: OpenSlot[] = []
        const now = new Date()

        snapshot.forEach((childSnapshot) => {
          const slot = childSnapshot.val()
          const slotDate = new Date(`${slot.date}T${slot.time}`)
          
          // Only include future slots that are available
          if (slotDate > now && slot.status === 'available') {
            slots.push({
              id: childSnapshot.key,
              ...slot
            })
          }
        })

        setAvailableSlots(slots.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`)
          const dateB = new Date(`${b.date}T${b.time}`)
          return dateA.getTime() - dateB.getTime()
        }))
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching available slots:', error)
        setError(error.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [photographerId])

  const bookSlot = async (
    slotId: string, 
    bookingData: {
      clientName: string
      clientEmail: string
      clientPhone: string
      service: string
      clientId?: string
    }
  ) => {
    try {
      // Get the slot data
      const slotRef = ref(db, `available_slots/${slotId}`)
      const slotSnapshot = await get(slotRef)
      const slotData = slotSnapshot.val()

      if (!slotData || slotData.status !== 'available') {
        throw new Error('Slot is no longer available')
      }

      // Create booking
      const bookingsRef = ref(db, 'bookings')
      const newBooking = await push(bookingsRef, {
        slotId,
        userId: photographerId,
        date: slotData.date,
        time: slotData.time,
        status: 'pending',
        createdAt: serverTimestamp(),
        ...bookingData
      })

      // Update slot status
      await update(slotRef, {
        status: 'booked'
      })

      return newBooking.key
    } catch (err) {
      console.error('Error booking slot:', err)
      throw err
    }
  }

  return {
    availableSlots,
    loading,
    error,
    bookSlot
  }
} 