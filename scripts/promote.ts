import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

const envPath = path.resolve(process.cwd(), '.env')
console.log('Checking for .env at:', envPath)
if (fs.existsSync(envPath)) {
    console.log('.env file found.')
}

dotenv.config({ path: envPath })
console.log('DATABASE_URL from process.env:', process.env.DATABASE_URL ? 'FOUND' : 'MISSING')

async function main() {
    const email = process.argv[2]
    const role = (process.argv[3] || 'SUPER_ADMIN') as any

    if (!email) {
        console.error('Usage: npx tsx scripts/promote.ts <email> [role]')
        process.exit(1)
    }

    try {
        // Dynamic import to ensure env is loaded first
        const { default: prisma } = await import('../lib/prisma')

        const user = await prisma.user.update({
            where: { email },
            data: { role }
        })
        console.log(`Successfully promoted ${user.email} to ${user.role}`)
    } catch (error: any) {
        if (error.code === 'P2025') {
            console.error(`Error: User with email "${email}" not found. Have you signed up yet?`)
        } else {
            console.error('Promotion failed:', error.message)
        }
    }
}

main().catch(console.error)
