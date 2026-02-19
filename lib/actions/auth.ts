'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { SignupData } from '@/lib/types'

export async function signup(data: SignupData) {
    try {
        const { email, password, full_name, phone } = data

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return { success: false, message: 'User already exists' }
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                fullName: full_name,
                phone,
                role: 'USER', // Default role
            }
        })

        return { success: true, user: { id: user.id, email: user.email, fullName: user.fullName } }
    } catch (error: any) {
        console.error('Signup action error:', error)
        return { success: false, message: error.message || 'Signup failed' }
    }
}

export async function updateUserRole(email: string, role: 'USER' | 'PROPERTY_MANAGER' | 'SUPER_ADMIN') {
    try {
        await prisma.user.update({
            where: { email },
            data: { role }
        })
        return { success: true }
    } catch (error: any) {
        console.error('updateUserRole error:', error)
        return { success: false, message: error.message }
    }
}
