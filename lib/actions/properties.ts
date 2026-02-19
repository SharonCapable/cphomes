'use server'

import prisma from '@/lib/prisma'
import { PropertyStatus, PropertyType } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { serializePrisma } from '@/lib/utils'

export async function getFeaturedProperties(limit: number = 3) {
    try {
        const properties = await prisma.property.findMany({
            where: {
                status: 'AVAILABLE' as PropertyStatus,
            },
            include: {
                images: {
                    where: { isPrimary: true },
                    take: 1
                },
                manager: {
                    select: {
                        fullName: true,
                        avatarUrl: true
                    }
                }
            },
            take: limit,
            orderBy: [
                { isFeatured: 'desc' },
                { createdAt: 'desc' }
            ]
        })
        return serializePrisma(properties)
    } catch (error) {
        console.error('getFeaturedProperties error:', error)
        return []
    }
}

export async function getPropertyById(id: string) {
    try {
        const property = await prisma.property.findUnique({
            where: { id },
            include: {
                images: {
                    orderBy: {
                        displayOrder: 'asc'
                    }
                },
                manager: true,
                reviews: {
                    include: {
                        user: true
                    }
                }
            }
        })
        return serializePrisma(property)
    } catch (error) {
        console.error('getPropertyById error:', error)
        return null
    }
}

export async function getPropertyBySlug(slug: string) {
    try {
        const property = await prisma.property.findUnique({
            where: { slug },
            include: {
                images: true,
                manager: true,
                reviews: {
                    include: {
                        user: true
                    }
                }
            }
        })
        return serializePrisma(property)
    } catch (error) {
        console.error('getPropertyBySlug error:', error)
        return null
    }
}

export async function searchProperties(params: {
    location?: string
    type?: PropertyType
    minPrice?: number
    maxPrice?: number
    bedrooms?: number | string
    amenities?: string[]
}) {
    try {
        console.log('searchProperties params:', params)
        const where: any = {
            status: 'AVAILABLE' as PropertyStatus,
        }

        if (params.location) {
            const searchLocation = params.location.trim()
            where.OR = [
                { city: { contains: searchLocation, mode: 'insensitive' } },
                { address: { contains: searchLocation, mode: 'insensitive' } },
                { state: { contains: searchLocation, mode: 'insensitive' } },
                { title: { contains: searchLocation, mode: 'insensitive' } },
            ]
        }

        if (params.type) {
            where.type = params.type
        }

        if (params.minPrice || params.maxPrice) {
            where.pricePerMonth = {}
            if (params.minPrice) where.pricePerMonth.gte = Number(params.minPrice)
            if (params.maxPrice) where.pricePerMonth.lte = Number(params.maxPrice)
        }

        if (params.bedrooms) {
            const bedCount = typeof params.bedrooms === 'string' && params.bedrooms.includes('+')
                ? parseInt(params.bedrooms)
                : Number(params.bedrooms)

            if (!isNaN(bedCount)) {
                where.bedrooms = { gte: bedCount }
            }
        }

        if (params.amenities && params.amenities.length > 0) {
            where.amenities = {
                hasSome: params.amenities
            }
        }

        const properties = await prisma.property.findMany({
            where,
            include: {
                images: {
                    where: { isPrimary: true },
                    take: 1
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return serializePrisma(properties)
    } catch (error) {
        console.error('searchProperties error:', error)
        return []
    }
}
