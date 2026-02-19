import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-secondary/20">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar could go here */}
                <main className="flex-1 overflow-y-auto pt-24 pb-12 px-8">
                    <div className="max-w-screen-2xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
