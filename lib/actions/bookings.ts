'use server'

import prisma from '@/lib/prisma'
import { BookingStatus } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function createBooking(data: {
    propertyId: string
    checkIn: Date
    checkOut: Date
    guests: number
    totalPrice: number
    message?: string
    phone?: string
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            throw new Error('Authentication required')
        }

        const booking = await prisma.booking.create({
            data: {
                propertyId: data.propertyId,
                userId: (session.user as any).id,
                checkIn: data.checkIn,
                checkOut: data.checkOut,
                guests: data.guests,
                totalPrice: data.totalPrice,
                message: data.message,
                phone: data.phone,
                status: BookingStatus.PENDING,
            }
        })

        return { success: true, booking }
    } catch (error: any) {
        console.error('createBooking error:', error)
        return { success: false, error: error.message }
    }
}

export async function getPropertyBookings(propertyId: string) {
    try {
        return await prisma.booking.findMany({
            where: {
                propertyId,
                status: {
                    in: [BookingStatus.CONFIRMED, BookingStatus.PENDING]
                }
            },
            select: {
                checkIn: true,
                checkOut: true
            }
        })
    } catch (error) {
        console.error('getPropertyBookings error:', error)
        return []
    }
}
