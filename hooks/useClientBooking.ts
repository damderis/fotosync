'use client'

import { useState, useEffect } from 'react'
import { ref, onValue, push, set } from 'firebase/database'
import { db } from '@/utils/firebase'
import type { AvailableSlot, Booking } from '@/types/firebase'

export function useClientBooking(photographerId: string) {
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!photographerId) {
      setLoading(false)
      return
    }

    const slotsRef = ref(db, `available_slots/${photographerId}`)
    const unsubscribe = onValue(slotsRef, (snapshot) => {
      const slots: AvailableSlot[] = []
      snapshot.forEach((childSnapshot) => {
        const slot = childSnapshot.val()
        if (slot.status === 'available') {
          slots.push({
            id: childSnapshot.key!,
            ...slot
          })
        }
      })
      setAvailableSlots(slots)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching available slots:', error)
      setError(error.message)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [photographerId])

  const bookSlot = async (bookingData: {
    clientName: string
    clientEmail: string
    clientPhone: string
    service: string
    date: string
    startTime: string
    hours: number
    totalPrice: number
  }) => {
    if (!photographerId) return

    try {
      const newBooking: Omit<Booking, 'id'> = {
        userId: photographerId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...bookingData
      }

      const bookingRef = push(ref(db, `bookings/${photographerId}`))
      await set(bookingRef, newBooking)

      // Update the slot status
      const slotToUpdate = availableSlots.find(slot => 
        slot.dates.includes(bookingData.date.split('T')[0])
      )

      if (slotToUpdate) {
        const updatedDates = slotToUpdate.dates.filter(date => 
          date !== bookingData.date.split('T')[0]
        )

        if (updatedDates.length === 0) {
          // If no dates left, update slot status to booked
          await set(ref(db, `available_slots/${photographerId}/${slotToUpdate.id}`), {
            ...slotToUpdate,
            status: 'booked',
            updatedAt: new Date().toISOString()
          })
        } else {
          // Update remaining dates
          await set(ref(db, `available_slots/${photographerId}/${slotToUpdate.id}`), {
            ...slotToUpdate,
            dates: updatedDates,
            updatedAt: new Date().toISOString()
          })
        }
      }

      return bookingRef.key
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  }

  return {
    availableSlots,
    loading,
    error,
    bookSlot
  }
} 