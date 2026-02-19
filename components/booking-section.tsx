'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar as CalendarIcon, Users, MessageCircle, Star, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DateRange } from 'react-day-picker'
import BookingCalendar from './booking-calendar'
import { createBooking } from '@/lib/actions/bookings'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface BookingSectionProps {
    price: number
    id: string
    title: string
}

export default function BookingSection({ price, id, title }: BookingSectionProps) {
    const { data: session } = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)
    const [dateRange, setDateRange] = useState<DateRange | undefined>()

    const WHATSAPP_NUMBER = '+233207119731'

    const handleInitiateResidency = async () => {
        if (!session) {
            toast.error("Authentic residency requires a profile. Please sign in.")
            router.push('/login')
            return
        }

        if (!showCalendar) {
            setShowCalendar(true)
            return
        }

        if (!dateRange?.from || !dateRange?.to) {
            toast.error("Please select your preferred residency interval.")
            return
        }

        setLoading(true)
        try {
            const nights = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
            const totalPrice = nights * price

            const result = await createBooking({
                propertyId: id,
                checkIn: dateRange.from,
                checkOut: dateRange.to,
                guests: 1, // Default, can be expanded
                totalPrice: totalPrice,
                message: `Luxury Residency Inquiry for ${title}`
            })

            if (result.success) {
                toast.success("Residency application transmitted. Establishing Secure Gateway...")
                setTimeout(() => {
                    router.push(`/checkout/${id}?bookingId=${result.booking?.id}`)
                }, 1000)
            } else {
                toast.error(result.error || "A disruption occurred. Please try again.")
                setLoading(false)
            }
        } catch (error) {
            toast.error("Protocol error. Consult concierge.")
            setLoading(false)
        }
    }

    return (
        <Card className="p-8 border-none shadow-2xl bg-white rounded-[2.5rem] sticky top-32 overflow-hidden group">
            {/* Accent Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="relative space-y-8">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Investment</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-primary">${price.toLocaleString()}</span>
                            <span className="text-muted-foreground font-light">/mo</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full text-green-700 text-[10px] font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {!showCalendar ? (
                        <motion.div
                            key="stats"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4 pt-4 border-t border-primary/5"
                        >
                            <div className="flex items-center gap-4 px-6 py-4 bg-secondary/30 rounded-2xl">
                                <CalendarIcon className="w-5 h-5 text-accent" />
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Availability</p>
                                    <p className="text-sm font-bold">Residency Ready</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 px-6 py-4 bg-secondary/30 rounded-2xl">
                                <Users className="w-5 h-5 text-accent" />
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Service Type</p>
                                    <p className="text-sm font-bold">All-Inclusive Luxury</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="calendar"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <BookingCalendar onRangeSelect={setDateRange} pricePerNight={price} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-4">
                    <Button
                        onClick={handleInitiateResidency}
                        disabled={loading}
                        className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/95 text-white font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : showCalendar ? 'Secure Residency' : 'Check Availability'}
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full h-16 rounded-2xl border-border hover:bg-secondary/50 font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-colors"
                        onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=Concierge Request: I would like a private tour of ${title}.`, '_blank')}
                    >
                        <MessageCircle className="w-5 h-5 text-accent" />
                        Request Private Tour
                    </Button>
                </div>

                <div className="pt-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />)}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.1em]">Authenticated by Circle Point Global</p>
                </div>
            </div>
        </Card>
    )
}
