'use client'

import { useState } from 'react'
import { MessageSquare, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface ConciergeChatButtonProps {
    managerId: string
    propertyId?: string
    managerName?: string
}

export default function ConciergeChatButton({
    managerId,
    propertyId,
    managerName
}: ConciergeChatButtonProps) {
    const router = useRouter()
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)

    const handleStartChat = () => {
        if (!session) {
            toast.error("Authentic communication requires a profile. Please sign in.")
            router.push('/login')
            return
        }

        setLoading(true)
        // Redirect to the chat page with the manager
        router.push(`/concierge/${managerId}${propertyId ? `?propertyId=${propertyId}` : ''}`)
    }

    return (
        <Button
            onClick={handleStartChat}
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-white hover:bg-white/90 text-primary border border-primary/10 font-bold uppercase tracking-widest text-[10px] shadow-sm hover:shadow-md transition-all gap-2"
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <MessageSquare className="w-4 h-4 text-accent" />
            )}
            Direct Inquiry
        </Button>
    )
}
