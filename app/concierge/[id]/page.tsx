import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ChatTerminal from '@/components/chat-terminal'
import { getConversation } from '@/lib/actions/chat'
import { serializePrisma } from '@/lib/utils'

export default async function ConciergeChatPage(props: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ propertyId?: string }>
}) {
    const params = await props.params
    const searchParams = await props.searchParams

    const session = await getServerSession(authOptions)
    if (!session) redirect('/login')

    const otherUserId = params.id
    const currentUserId = (session.user as any).id
    const propertyId = searchParams.propertyId

    // Fetch the other user details
    const otherUser = await prisma.user.findUnique({
        where: { id: otherUserId },
        select: { id: true, fullName: true, avatarUrl: true, role: true }
    })

    if (!otherUser) notFound()

    // Fetch property context if exists
    let property = null
    if (propertyId) {
        property = await prisma.property.findUnique({
            where: { id: propertyId },
            include: { images: { where: { isPrimary: true }, take: 1 } }
        })
    }

    const initialMessages = await getConversation(otherUserId)

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFCFB]">
            <Navigation />

            <main className="flex-1 pt-20 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold heading-serif">Private Consultation</h1>
                        <p className="text-lg text-muted-foreground font-light">
                            Secure, end-to-end communication with your personal estate curator.
                        </p>
                    </div>

                    <ChatTerminal
                        initialMessages={serializePrisma(initialMessages)}
                        currentUserId={currentUserId}
                        otherUser={otherUser}
                        property={serializePrisma(property)}
                    />
                </div>
            </main>

            <Footer />
        </div>
    )
}
