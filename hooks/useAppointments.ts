import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { 
  ref, 
  query, 
  orderByChild, 
  equalTo, 
  onValue, 
  push,
  remove,
  serverTimestamp,
  update,
  set
} from 'firebase/database'
import { db } from '@/utils/firebase'
import type { OpenSlot, Booking } from '@/types/firebase'

export function useAppointments() {
  const { userId } = useAuth()
  console.log("User ID:", userId); // Check if userId is available
  const [openSlots, setOpenSlots] = useState<OpenSlot[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    // Check if user exists in the database
    const userRef = ref(db, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      if (!snapshot.exists()) {
        // User does not exist, create a new user entry
        set(userRef, {
          clerkId: userId,
          createdAt: Date.now(),
          // Add other user fields as necessary
        }).then(() => {
          console.log("User created in database:", userId);
        }).catch((error) => {
          console.error("Error creating user:", error);
        });
      }
    });

    // Subscribe to open slots
    const slotsRef = ref(db, 'available_slots')
    const slotsQuery = query(slotsRef, orderByChild('userId'), equalTo(userId))

    const unsubscribeSlots = onValue(slotsQuery, 
      (snapshot) => {
        const slots: OpenSlot[] = []
        snapshot.forEach((childSnapshot) => {
          slots.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          })
        })
        setOpenSlots(slots)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching slots:', error)
        setError(error.message)
        setLoading(false)
      }
    )

    // Subscribe to bookings
    const bookingsRef = ref(db, 'bookings')
    const bookingsQuery = query(bookingsRef, orderByChild('userId'), equalTo(userId))

    const unsubscribeBookings = onValue(bookingsQuery,
      (snapshot) => {
        const bookingsList: Booking[] = []
        snapshot.forEach((childSnapshot) => {
          bookingsList.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          })
        })
        setBookings(bookingsList)
      }
    )

    return () => {
      unsubscribeSlots()
      unsubscribeBookings()
    }
  }, [userId])

  const addSlot = async (date: Date, time: string) => {
    if (!userId) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const slotsRef = ref(db, 'available_slots');
      await push(slotsRef, {
        userId,
        date: date.toISOString().split('T')[0],
        time,
        status: 'available',
        createdAt: Date.now(),
      });
      console.log("Slot added successfully");
    } catch (err) {
      console.error('Error adding slot:', err);
    }
  }

  const removeSlot = async (slotId: string) => {
    try {
      const slotRef = ref(db, `available_slots/${slotId}`)
      await remove(slotRef)
    } catch (err) {
      console.error('Error removing slot:', err)
      throw err
    }
  }

  return {
    openSlots,
    bookings,
    loading,
    error,
    addSlot,
    removeSlot
  }
} 