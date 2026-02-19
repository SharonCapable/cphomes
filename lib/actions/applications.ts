'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function submitApplication(data: {
    companyName?: string
    phone: string
    yearsExperience?: string
    propertyCount?: string
    description: string
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            throw new Error('You must be logged in to apply as a property manager.')
        }

        const userId = (session.user as any).id

        // Check if user already has a pending application
        const existing = await prisma.propertyManagerApplication.findFirst({
            where: {
                userId,
                status: 'PENDING'
            }
        })

        if (existing) {
            throw new Error('You already have a pending application. Please wait for our team to review it.')
        }

        const application = await prisma.propertyManagerApplication.create({
            data: {
                userId,
                companyName: data.companyName,
                phone: data.phone,
                yearsExperience: data.yearsExperience,
                propertyCount: data.propertyCount,
                description: data.description,
            }
        })

        // Log the activity
        await prisma.activityLog.create({
            data: {
                userId,
                action: 'SUBMIT_APPLICATION',
                entityType: 'APPLICATION',
                entityId: application.id,
                details: 'Submitted property manager application.'
            }
        })

        revalidatePath('/admin') // Admin will see the new application
        return { success: true, application }
    } catch (error: any) {
        console.error('submitApplication error:', error)
        return { success: false, error: error.message }
    }
}

export async function getPendingApplications() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || ((session.user as any).role !== 'SUPER_ADMIN' && (session.user as any).role !== 'super_admin')) {
            throw new Error('Unauthorized')
        }

        return await prisma.propertyManagerApplication.findMany({
            where: { status: 'PENDING' },
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        })
    } catch (error) {
        console.error('getPendingApplications error:', error)
        return []
    }
}

export async function reviewApplication(id: string, status: 'APPROVED' | 'REJECTED', reason?: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || ((session.user as any).role !== 'SUPER_ADMIN' && (session.user as any).role !== 'super_admin')) {
            throw new Error('Unauthorized')
        }

        const application = await prisma.propertyManagerApplication.update({
            where: { id },
            data: {
                status: status === 'APPROVED' ? 'APPROVED' : 'REJECTED',
                rejectionReason: reason
            },
            include: { user: true }
        })

        // If approved, update user role
        if (status === 'APPROVED') {
            await prisma.user.update({
                where: { id: application.userId },
                data: { role: 'PROPERTY_MANAGER' }
            })
        }

        await prisma.activityLog.create({
            data: {
                userId: (session.user as any).id,
                action: 'REVIEW_APPLICATION',
                entityType: 'APPLICATION',
                entityId: id,
                details: `Application for ${application.user.fullName} ${status.toLowerCase()}.`
            }
        })

        revalidatePath('/admin')
        return { success: true }
    } catch (error: any) {
        console.error('reviewApplication error:', error)
        return { success: false, error: error.message }
    }
}
