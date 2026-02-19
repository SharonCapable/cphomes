import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'
import { MessageSquare, ChevronRight, User, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getRecentConversations } from '@/lib/actions/chat'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

export default async function ConciergeInboxPage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/login')

    const conversations = await getRecentConversations()

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFCFB]">
            <Navigation />

            <main className="flex-1 pt-20 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="flex justify-between items-end">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-bold heading-serif">Communication Hub</h1>
                            <p className="text-lg text-muted-foreground font-light">
                                Review and manage your curated connections.
                            </p>
                        </div>
                        <div className="px-6 py-3 bg-accent/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            {conversations.length} Active Dialogues
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {conversations.map((conv: any) => (
                            <Link key={conv.user.id} href={`/concierge/${conv.user.id}`}>
                                <Card className="group p-8 border-none shadow-sm hover:shadow-xl bg-white rounded-[2.5rem] transition-all duration-500 flex items-center gap-8">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-secondary shadow-md">
                                            <img src={conv.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.user.id}`} alt="" />
                                        </div>
                                        {conv.lastMessage.senderId !== (session.user as any).id && !conv.lastMessage.isRead && (
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full border-4 border-white animate-pulse" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold heading-serif truncate group-hover:text-accent transition-colors">
                                                {conv.user.fullName}
                                            </h3>
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                <Clock className="w-3.5 h-3.5" />
                                                {formatDistanceToNow(new Date(conv.lastMessage.createdAt))} ago
                                            </div>
                                        </div>
                                        <p className={cn(
                                            "text-sm font-light truncate max-w-lg",
                                            conv.lastMessage.senderId !== (session.user as any).id && !conv.lastMessage.isRead
                                                ? "text-primary font-bold"
                                                : "text-muted-foreground"
                                        )}>
                                            {conv.lastMessage.senderId === (session.user as any).id ? 'You: ' : ''}
                                            {conv.lastMessage.content}
                                        </p>
                                    </div>

                                    <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-500">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </Card>
                            </Link>
                        ))}

                        {conversations.length === 0 && (
                            <div className="py-24 text-center space-y-6 bg-white rounded-[3rem] border border-dashed border-primary/10">
                                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto text-primary/30">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold heading-serif italic">Silence is Golden</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto font-light leading-relaxed">
                                    You haven't initiated any private consultations yet. Reach out to an estate manager to begin your journey.
                                </p>
                                <Link href="/properties">
                                    <Button className="rounded-2xl h-14 px-8 bg-primary text-white font-bold uppercase tracking-widest text-xs">Discover Estates</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

