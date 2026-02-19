'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, X, Loader2, Calendar } from 'lucide-react'
import { updateBookingStatus } from '@/lib/actions/manager'
import { toast } from 'sonner'

interface BookingRowProps {
    booking: any
}

export default function BookingRow({ booking }: BookingRowProps) {
    const [loading, setLoading] = useState(false)
    const [currentStatus, setCurrentStatus] = useState(booking.status)

    const handleStatusUpdate = async (newStatus: string) => {
        setLoading(true)
        try {
            const result = await updateBookingStatus(booking.id, newStatus)
            if (result.success) {
                setCurrentStatus(newStatus)
                toast.success(`Residency status updated to ${newStatus}.`)
            } else {
                toast.error(result.error || "Failed to update status.")
            }
        } catch (error) {
            toast.error("Protocol error during status update.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-3xl bg-secondary/30 border border-primary/5 hover:bg-secondary/50 transition-colors gap-6 group">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                    <Calendar className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-bold text-lg">{booking.property.title}</h4>
                    <p className="text-sm text-muted-foreground font-light">
                        Resident: <span className="font-bold text-primary">{booking.user.fullName || booking.user.email}</span>
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="text-center sm:text-right">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Interval</p>
                    <p className="text-sm font-bold text-primary">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {currentStatus === 'PENDING' ? (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                            <Button
                                onClick={() => handleStatusUpdate('CONFIRMED')}
                                disabled={loading}
                                variant="outline"
                                className="h-10 w-10 rounded-full border-green-200 text-green-600 hover:bg-green-50 p-0"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            </Button>
                            <Button
                                onClick={() => handleStatusUpdate('CANCELLED')}
                                disabled={loading}
                                variant="outline"
                                className="h-10 w-10 rounded-full border-red-200 text-red-600 hover:bg-red-50 p-0"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full">Pending</span>
                        </div>
                    ) : (
                        <div className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm",
                            currentStatus === 'CONFIRMED' ? "bg-green-100 text-green-700" :
                                currentStatus === 'CANCELLED' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                        )}>
                            {currentStatus}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
