'use client'

import { useState } from 'react'
import { Star, MessageSquare, Send, Clock, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createReview } from '@/lib/actions/reviews'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface ReviewSectionProps {
    propertyId: string
    initialReviews: any[]
    isLoggedIn: boolean
}

export default function ReviewSection({ propertyId, initialReviews, isLoggedIn }: ReviewSectionProps) {
    const [reviews, setReviews] = useState(initialReviews)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoggedIn) {
            toast.error("Please login to leave a review.")
            return
        }

        setSubmitting(true)
        try {
            const result = await createReview({
                propertyId,
                rating,
                comment
            })

            if (result.success) {
                toast.success("Review submitted. Thank you for your feedback.")
                // Note: result.review might need more fields from the DB to display correctly with user info
                // For simplicity, we'll suggest a refresh or manually add a placeholder
                setComment('')
                setRating(5)
            } else {
                toast.error(result.error || "Failed to submit review.")
            }
        } catch (error) {
            toast.error("An error occurred.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="space-y-12">
            <h3 className="text-3xl font-bold heading-serif italic">Resident Testimonials</h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Review Form */}
                <div className="lg:col-span-4">
                    <Card className="p-8 border-none shadow-xl bg-white rounded-[2.5rem] sticky top-32">
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold heading-serif text-xl">Share Your Experience</h4>
                                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">Contribute to our legacy of excellence</p>
                            </div>

                            <form onSubmit={handleSubmitReview} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-accent italic">Elite Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="transition-transform active:scale-90"
                                            >
                                                <Star
                                                    className={cn(
                                                        "w-6 h-6 transition-colors",
                                                        rating >= star ? "text-accent fill-accent" : "text-muted-foreground opacity-20"
                                                    )}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-accent italic">Testimonial</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Describe your residency experience..."
                                        rows={4}
                                        className="w-full px-5 py-4 bg-secondary/30 rounded-2xl border-none outline-none focus:ring-1 focus:ring-accent text-sm font-medium resize-none leading-relaxed"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={submitting || !isLoggedIn}
                                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/95 text-white gap-3 font-bold uppercase tracking-widest text-[10px]"
                                >
                                    {submitting ? <Clock className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Transmit Review
                                </Button>

                                {!isLoggedIn && (
                                    <p className="text-[9px] text-center text-muted-foreground uppercase font-bold tracking-tighter">Login required to curate reviews</p>
                                )}
                            </form>
                        </div>
                    </Card>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-8 space-y-8">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <Card key={review.id} className="p-8 border-none shadow-sm bg-white rounded-[2.5rem] group hover:shadow-lg transition-all duration-500">
                                <div className="flex gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary shrink-0 overflow-hidden">
                                        {review.user?.avatarUrl ? (
                                            <img src={review.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <UserIcon className="w-6 h-6 opacity-30" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h5 className="font-bold heading-serif">{review.user?.fullName || 'Distinguished Citizen'}</h5>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest italic">{format(new Date(review.createdAt), 'MMMM yyyy')}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={cn(
                                                            "w-3 h-3",
                                                            review.rating >= star ? "text-accent fill-accent" : "text-muted-foreground opacity-20"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground font-light leading-relaxed italic">
                                            "{review.comment}"
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="py-24 text-center bg-white/50 rounded-[3rem] border border-dashed border-primary/5">
                            <MessageSquare className="w-12 h-12 text-primary/10 mx-auto mb-6" />
                            <h4 className="text-2xl font-bold heading-serif text-muted-foreground opacity-40 italic">Awaiting First Impression</h4>
                            <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">Be the first to curate a testimonial for this estate.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
