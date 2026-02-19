'use client'

import { useState, useTransition } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { toggleFavorite } from '@/lib/actions/favorites'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
    propertyId: string
    initialIsFavorited?: boolean
    className?: string
}

export default function FavoriteButton({
    propertyId,
    initialIsFavorited = false,
    className
}: FavoriteButtonProps) {
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
    const [isPending, startTransition] = useTransition()

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        startTransition(async () => {
            try {
                const result = await toggleFavorite(propertyId)
                if (result.success) {
                    setIsFavorited(result.action === 'added')
                    toast.success(
                        result.action === 'added'
                            ? "Estate added to your curated collection."
                            : "Estate removed from your collection."
                    )
                } else {
                    toast.error(result.error || "Authentication required to curate your collection.")
                }
            } catch (error) {
                toast.error("Protocol error during collection update.")
            }
        })
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                isFavorited
                    ? "bg-accent text-white"
                    : "bg-white/90 backdrop-blur-md text-primary hover:scale-110",
                isPending && "opacity-70 scale-95",
                className
            )}
        >
            {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
            )}
        </button>
    )
}
