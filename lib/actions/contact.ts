'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function submitContactForm(data: {
    name: string
    email: string
    subject: string
    message: string
}) {
    try {
        const contactMessage = await prisma.contactMessage.create({
            data: {
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
            }
        })

        revalidatePath('/admin/messages') // Where admins will see contact messages
        return { success: true }
    } catch (error: any) {
        console.error('submitContactForm error:', error)
        return { success: false, error: error.message }
    }
}

export async function getContactMessages() {
    try {
        return await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        })
    } catch (error) {
        console.error('getContactMessages error:', error)
        return []
    }
}
