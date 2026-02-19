'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2 } from 'lucide-react'
import { initializePaystackPayment } from '@/lib/payment'
import { toast } from 'sonner'

interface PaymentButtonProps {
    bookingId: string
    amount: number
    email: string
    title: string
}

export default function PaymentButton({ bookingId, amount, email, title }: PaymentButtonProps) {
    const [loading, setLoading] = useState(false)

    const handlePayment = async () => {
        setLoading(true)
        try {
            // In a real Paystack flow, we'd initialize on the server or via their popup
            // Here we use our utility which initializes a transaction
            const result = await initializePaystackPayment({
                amount: amount, // lib already handles conversion if needed
                email,
                reference: `CPH-${bookingId}-${Date.now()}`,
                callback_url: `${window.location.origin}/checkout/verify?bookingId=${bookingId}`
            })

            if (result.authorization_url) {
                toast.success("Authenticating security protocols...")
                window.location.href = result.authorization_url
            } else {
                // Fallback for mock or failure
                toast.info("Transitioning to payment environment...")
                // In local/dev we might just simulate success if PAYSTACK_SECRET_KEY is missing
                if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
                    setTimeout(() => {
                        window.location.href = `${window.location.origin}/checkout/verify?bookingId=${bookingId}&status=success`
                    }, 1500)
                } else {
                    toast.error("Financing protocol failure. Please contact concierge.")
                }
            }
        } catch (error) {
            toast.error("Payment transmission error. Consult concierge.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/95 text-white font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
            {loading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Transaction...
                </>
            ) : (
                <>
                    Finalize Investment <ArrowRight className="w-4 h-4" />
                </>
            )}
        </Button>
    )
}
