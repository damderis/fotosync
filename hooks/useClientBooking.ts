'use client'

import { useState, useEffect } from 'react'
import { ref, onValue, push, set } from 'firebase/database'
import { db } from '@/utils/firebase'
import type { AvailableSlot, Booking } from '@/types/firebase'

export function useClientBooking(photographerId: string) {
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!photographerId) {
      setLoading(false)
      return
    }

    // Subscribe to available slots
    const slotsRef = ref(db, `availableSlots/${photographerId}`)
    const unsubscribe = onValue(slotsRef, (snapshot) => {
      const slots: AvailableSlot[] = []
      snapshot.forEach((childSnapshot) => {
        slots.push({
          id: childSnapshot.key!,
          ...childSnapshot.val()
        })
      })
      setAvailableSlots(slots)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [photographerId])

  const bookSlot = async (bookingData: Omit<Booking, 'id'>) => {
    if (!photographerId) return

    // Create new booking
    const newBookingRef = push(ref(db, `bookings/${photographerId}`))
    await set(newBookingRef, {
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    })

    // Remove the booked date from available slots
    const slotToUpdate = availableSlots.find(slot => 
      slot.dates.includes(bookingData.date.split('T')[0])
    )

    if (slotToUpdate) {
      const updatedDates = slotToUpdate.dates.filter(date => 
        date !== bookingData.date.split('T')[0]
      )

      if (updatedDates.length === 0) {
        // If no dates left, remove the slot
        await set(ref(db, `availableSlots/${photographerId}/${slotToUpdate.id}`), null)
      } else {
        // Update the slot with remaining dates
        await set(ref(db, `availableSlots/${photographerId}/${slotToUpdate.id}`), {
          ...slotToUpdate,
          dates: updatedDates
        })
      }
    }
  }

  return {
    availableSlots,
    loading,
    bookSlot
  }
} 