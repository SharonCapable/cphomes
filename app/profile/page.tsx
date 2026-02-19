import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ProfileClient from '@/components/profile-client'
import { getUserFavorites } from '@/lib/actions/favorites'

export default async function UserProfilePage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/login')

    const userId = (session.user as any).id

    // Fetch Real Bookings
    const bookings = await prisma.booking.findMany({
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

    // Fetch Real Favorites
    const favorites = await getUserFavorites()

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFCFB]">
            <Navigation />

            <main className="flex-1 pt-20 pb-24">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ProfileClient
                        user={session.user}
                        initialBookings={JSON.parse(JSON.stringify(bookings))}
                        initialFavorites={JSON.parse(JSON.stringify(favorites))}
                    />
                </div>
            </main>

            <Footer />
        </div>
    )
}
