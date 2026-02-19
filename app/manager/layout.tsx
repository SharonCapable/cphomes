import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Navigation from '@/components/navigation'

export default async function ManagerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session || ((session.user as any).role !== 'PROPERTY_MANAGER' && (session.user as any).role !== 'SUPER_ADMIN')) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB]">
            <Navigation />
            <div className="flex h-screen overflow-hidden pt-20">
                {/* Sidebar Space (Optional) */}
                <main className="flex-1 overflow-y-auto pt-8 pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-screen-2xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
