import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const createPrismaClient = () => {
    const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
    console.log('--- REBOOTING PRISMA CLIENT v2 ---')
    console.log('Target Connection:', connectionString?.split('@')[1] || 'NOT_FOUND')

    const pool = new Pool({
        connectionString,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
        ssl: {
            rejectUnauthorized: false
        }
    })

    const adapter = new PrismaPg(pool)

    return new PrismaClient({
        adapter: adapter as any,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
}

declare global {
    var prisma: undefined | ReturnType<typeof createPrismaClient>
}

const prisma = globalThis.prisma ?? createPrismaClient()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
