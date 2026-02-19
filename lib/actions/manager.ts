'use server'

import prisma from '@/lib/prisma'
import { PropertyStatus, PropertyType, Currency, BillingPeriod } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { serializePrisma } from '@/lib/utils'

export async function createProperty(data: {
    title: string
    description: string
    type: PropertyType
    address: string
    city: string
    country: string
    bedrooms: number
    bathrooms: number
    squareFeet?: number
    pricePerMonth: number
    currency?: Currency
    billingPeriod?: BillingPeriod
    amenities: string[]
    images: { url: string; caption?: string; isPrimary?: boolean }[]
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            throw new Error('Authentication required')
        }

        const managerId = (session.user as any).id
        const slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 7)

        const property = await prisma.property.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                address: data.address,
                city: data.city,
                country: data.country,
                bedrooms: data.bedrooms,
                bathrooms: data.bathrooms,
                squareFeet: data.squareFeet,
                pricePerMonth: data.pricePerMonth,
                currency: data.currency || Currency.USD,
                billingPeriod: data.billingPeriod || BillingPeriod.PER_MONTH,
                amenities: data.amenities,
                slug: slug,
                managerId: managerId,
                status: PropertyStatus.AVAILABLE,
                images: {
                    create: data.images.map((img, index) => ({
                        url: img.url,
                        caption: img.caption,
                        isPrimary: img.isPrimary || index === 0,
                        displayOrder: index
                    }))
                }
            }
        })

        await prisma.activityLog.create({
            data: {
                userId: managerId,
                action: 'CREATE_PROPERTY',
                entityType: 'PROPERTY',
                entityId: property.id,
                details: `Property "${property.title}" created.`
            }
        })

        revalidatePath('/')
        revalidatePath('/properties')
        revalidatePath('/manager/properties')
        revalidatePath(`/properties/${property.id}`)
        revalidatePath(`/properties/${property.slug}`)

        return { success: true, property: serializePrisma(property) }
    } catch (error: any) {
        console.error('createProperty error:', error)
        return { success: false, error: error.message }
    }
}

export async function updateProperty(id: string, data: {
    title: string
    description: string
    type: PropertyType
    address: string
    city: string
    country: string
    bedrooms: number
    bathrooms: number
    squareFeet?: number
    pricePerMonth: number
    currency?: Currency
    billingPeriod?: BillingPeriod
    amenities: string[]
    images: { url: string; caption?: string; isPrimary?: boolean }[]
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            throw new Error('Authentication required')
        }

        const managerId = (session.user as any).id

        // Verify ownership
        const existing = await prisma.property.findUnique({
            where: { id },
            select: { managerId: true }
        })

        if (!existing || existing.managerId !== managerId) {
            throw new Error('Unauthorized or property not found')
        }

        const property = await prisma.property.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                address: data.address,
                city: data.city,
                country: data.country,
                bedrooms: data.bedrooms,
                bathrooms: data.bathrooms,
                squareFeet: data.squareFeet,
                pricePerMonth: data.pricePerMonth,
                currency: data.currency || Currency.USD,
                billingPeriod: data.billingPeriod || BillingPeriod.PER_MONTH,
                amenities: data.amenities,
                images: {
                    deleteMany: {},
                    create: data.images.map((img, index) => ({
                        url: img.url,
                        caption: img.caption,
                        isPrimary: img.isPrimary || index === 0,
                        displayOrder: index
                    }))
                }
            }
        })

        await prisma.activityLog.create({
            data: {
                userId: managerId,
                action: 'UPDATE_PROPERTY',
                entityType: 'PROPERTY',
                entityId: property.id,
                details: `Property "${property.title}" updated.`
            }
        })

        revalidatePath('/')
        revalidatePath('/properties')
        revalidatePath('/manager/properties')
        revalidatePath(`/properties/${id}`)
        revalidatePath(`/properties/${property.slug}`)

        return { success: true, property: serializePrisma(property) }
    } catch (error: any) {
        console.error('updateProperty error:', error)
        return { success: false, error: error.message }
    }
}

export async function deleteProperty(id: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            throw new Error('Authentication required')
        }

        const userId = (session.user as any).id
        const userRole = (session.user as any).role

        // Verify ownership or admin status
        const property = await prisma.property.findUnique({
            where: { id },
            select: { managerId: true, slug: true }
        })

        if (!property) throw new Error('Property not found')

        if (property.managerId !== userId && userRole !== 'SUPER_ADMIN' && userRole !== 'super_admin') {
            throw new Error('Unauthorized')
        }

        await prisma.property.delete({
            where: { id }
        })

        await prisma.activityLog.create({
            data: {
                userId: userId,
                action: 'DELETE_PROPERTY',
                entityType: 'PROPERTY',
                entityId: id,
                details: `Property "${property.slug}" deleted.`
            }
        })

        revalidatePath('/')
        revalidatePath('/properties')
        revalidatePath('/manager/properties')

        return { success: true }
    } catch (error: any) {
        console.error('deleteProperty error:', error)
        return { success: false, error: error.message }
    }
}

export async function updateBookingStatus(bookingId: string, status: any) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            throw new Error('Authentication required')
        }

        const userId = (session.user as any).id
        const userRole = (session.user as any).role

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { property: { select: { managerId: true } } }
        })

        if (!booking) throw new Error('Booking not found')

        // Only manager of the property or admin can change status
        if (booking.property.managerId !== userId && userRole !== 'SUPER_ADMIN' && userRole !== 'super_admin') {
            throw new Error('Unauthorized')
        }

        const updated = await prisma.booking.update({
            where: { id: bookingId },
            data: { status }
        })

        revalidatePath('/manager')
        revalidatePath('/profile')

        return { success: true, booking: serializePrisma(updated) }
    } catch (error: any) {
        console.error('updateBookingStatus error:', error)
        return { success: false, error: error.message }
    }
}
