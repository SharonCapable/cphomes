'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function sendMessage(data: {
    receiverId: string
    content: string
    propertyId?: string
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            throw new Error('Authentication required to transmission messages.')
        }

        const senderId = (session.user as any).id

        const message = await prisma.message.create({
            data: {
                senderId,
                receiverId: data.receiverId,
                content: data.content,
                propertyId: data.propertyId
            },
            include: {
                sender: { select: { fullName: true, avatarUrl: true } }
            }
        })

        revalidatePath(`/concierge/${data.receiverId}`)
        revalidatePath('/manager/messages')

        return { success: true, message }
    } catch (error: any) {
        console.error('sendMessage error:', error)
        return { success: false, error: error.message }
    }
}

export async function getConversation(otherUserId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) return []

        const userId = (session.user as any).id

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId }
                ]
            },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: { select: { fullName: true, avatarUrl: true, role: true } }
            }
        })

        // Mark as read
        await prisma.message.updateMany({
            where: {
                senderId: otherUserId,
                receiverId: userId,
                isRead: false
            },
            data: { isRead: true }
        })

        return messages
    } catch (error) {
        console.error('getConversation error:', error)
        return []
    }
}

export async function getRecentConversations() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) return []

        const userId = (session.user as any).id

        // Complex query to get most recent message per conversation
        // Simplification for now: get last 50 messages and group in JS
        const messages = await prisma.message.findMany({
            where: {
                OR: [{ senderId: userId }, { receiverId: userId }]
            },
            orderBy: { createdAt: 'desc' },
            include: {
                sender: { select: { id: true, fullName: true, avatarUrl: true } },
                receiver: { select: { id: true, fullName: true, avatarUrl: true } }
            }
        })

        const conversationsMap = new Map()

        messages.forEach(msg => {
            const otherUser = msg.senderId === userId ? msg.receiver : msg.sender
            if (!conversationsMap.has(otherUser.id)) {
                conversationsMap.set(otherUser.id, {
                    user: otherUser,
                    lastMessage: msg
                })
            }
        })

        return Array.from(conversationsMap.values())
    } catch (error) {
        console.error('getRecentConversations error:', error)
        return []
    }
}
