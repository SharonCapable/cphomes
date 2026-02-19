import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ApplicationReview from '@/components/application-review'
import { getPendingApplications } from '@/lib/actions/applications'
import { serializePrisma } from '@/lib/utils'

export default async function AdminApplicationsPage() {
    const session = await getServerSession(authOptions)
    if (!session || ((session.user as any).role !== 'SUPER_ADMIN' && (session.user as any).role !== 'super_admin')) {
        redirect('/login')
    }

    const applications = await getPendingApplications()

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFCFB]">
            <Navigation />

            <main className="flex-1 pt-20 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-screen-2xl mx-auto space-y-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-bold heading-serif">Curator Applications</h1>
                            <p className="text-lg text-muted-foreground font-light">
                                Authentic candidates seeking to join the Circle Point excellence network.
                            </p>
                        </div>
                    </div>

                    <ApplicationReview initialApplications={serializePrisma(applications)} />
                </div>
            </main>

            <Footer />
        </div>
    )
}
