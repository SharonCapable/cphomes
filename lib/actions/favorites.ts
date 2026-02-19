'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function toggleFavorite(propertyId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            throw new Error('Authentication required to curate your collection.')
        }

        const userId = (session.user as any).id

        const existing = await prisma.favorite.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId
                }
            }
        })

        if (existing) {
            await prisma.favorite.delete({
                where: { id: existing.id }
            })
            revalidatePath('/properties')
            revalidatePath(`/properties/${propertyId}`)
            revalidatePath('/profile')
            return { success: true, action: 'removed' }
        } else {
            await prisma.favorite.create({
                data: {
                    userId,
                    propertyId
                }
            })
            revalidatePath('/properties')
            revalidatePath(`/properties/${propertyId}`)
            revalidatePath('/profile')
            return { success: true, action: 'added' }
        }
    } catch (error: any) {
        console.error('toggleFavorite error:', error)
        return { success: false, error: error.message }
    }
}

export async function getUserFavorites() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) return []

        const userId = (session.user as any).id

        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: {
                property: {
                    include: {
                        images: { where: { isPrimary: true }, take: 1 }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return favorites.map(f => f.property)
    } catch (error) {
        console.error('getUserFavorites error:', error)
        return []
    }
}
