'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, User, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { sendMessage } from '@/lib/actions/chat'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface ChatTerminalProps {
    initialMessages: any[]
    currentUserId: string
    otherUser: any
    property?: any
}

export default function ChatTerminal({
    initialMessages,
    currentUserId,
    otherUser,
    property
}: ChatTerminalProps) {
    const [messages, setMessages] = useState(initialMessages)
    const [input, setInput] = useState('')
    const [sending, setSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || sending) return

        setSending(true)
        try {
            const result = await sendMessage({
                receiverId: otherUser.id,
                content: input,
                propertyId: property?.id
            })

            if (result.success) {
                setMessages([...messages, result.message])
                setInput('')
            }
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="flex flex-col h-[70vh] bg-white rounded-[3rem] shadow-2xl border border-primary/5 overflow-hidden">
            {/* Chat Header */}
            <div className="p-8 border-b border-primary/5 bg-secondary/20 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <img src={otherUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.id}`} alt={otherUser.fullName} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold heading-serif">{otherUser.fullName}</h3>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-accent">
                            {otherUser.role === 'PROPERTY_MANAGER' ? 'Estate Manager' : 'Resident'}
                        </p>
                    </div>
                </div>

                {property && (
                    <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-primary/5 shadow-sm">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={property.images?.[0]?.url || '/placeholder.jpg'} className="object-cover w-full h-full" alt="" />
                        </div>
                        <div>
                            <p className="text-xs font-bold truncate max-w-[150px]">{property.title}</p>
                            <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase font-bold">
                                <MapPin className="w-3 h-3" /> {property.city}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Messages Feed */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth"
            >
                {messages.map((msg, i) => {
                    const isMe = msg.senderId === currentUserId
                    return (
                        <div
                            key={msg.id || i}
                            className={cn(
                                "flex flex-col",
                                isMe ? "items-end" : "items-start"
                            )}
                        >
                            <div className={cn(
                                "max-w-[80%] p-6 rounded-3xl text-sm leading-relaxed shadow-sm",
                                isMe
                                    ? "bg-primary text-white rounded-tr-none"
                                    : "bg-secondary text-primary rounded-tl-none"
                            )}>
                                {msg.content}
                            </div>
                            <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground mt-3 px-2">
                                {format(new Date(msg.createdAt), 'hh:mm a')}
                            </span>
                        </div>
                    )
                })}
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30 italic">
                        <MessageSquare className="w-12 h-12" />
                        <p className="font-light">Initiate your private consultation...</p>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form
                onSubmit={handleSend}
                className="p-8 border-t border-primary/5 bg-white"
            >
                <div className="relative flex items-center">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Compose your inquiry..."
                        className="h-16 pl-8 pr-20 rounded-2xl border-primary/5 bg-secondary/30 focus:bg-white focus:ring-accent/20 transition-all font-light"
                    />
                    <Button
                        type="submit"
                        disabled={sending || !input.trim()}
                        className="absolute right-2 h-12 w-12 rounded-xl bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20 flex items-center justify-center p-0"
                    >
                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                </div>
            </form>
        </div>
    )
}

function MessageSquare(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    )
}
