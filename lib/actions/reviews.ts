'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createReview(data: {
    propertyId: string
    rating: number
    comment?: string
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            throw new Error('You must be logged in to leave a review.')
        }

        const userId = (session.user as any).id

        // Check if user has already reviewed this property
        const existing = await prisma.review.findFirst({
            where: {
                userId,
                propertyId: data.propertyId
            }
        })

        if (existing) {
            throw new Error('You have already reviewed this property.')
        }

        const review = await prisma.review.create({
            data: {
                userId,
                propertyId: data.propertyId,
                rating: data.rating,
                comment: data.comment
            }
        })

        revalidatePath(`/properties/${data.propertyId}`)
        return { success: true, review }
    } catch (error: any) {
        console.error('createReview error:', error)
        return { success: false, error: error.message }
    }
}
