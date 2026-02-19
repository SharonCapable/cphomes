import { notFound, redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Users, ShieldCheck, MapPin, ArrowRight, CreditCard, Lock } from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'
import PaymentButton from '@/components/payment-button'

export default async function CheckoutPage({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams: { bookingId?: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/login')

    const bookingId = searchParams.bookingId
    if (!bookingId) return redirect('/properties')

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            property: {
                include: {
                    images: { where: { isPrimary: true }, take: 1 }
                }
            },
            user: true
        }
    })

    if (!booking || !session || booking.userId !== (session.user as any).id) {
        return notFound()
    }

    const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFCFB]">
            <Navigation />

            <main className="flex-1 pt-20 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                        {/* Left Column: Summary */}
                        <div className="lg:col-span-7 space-y-12">
                            <div className="space-y-4">
                                <h1 className="text-5xl font-bold heading-serif">Secure Your Residency</h1>
                                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                                    Review your curated stay details and proceed to our encrypted payment gateway.
                                </p>
                            </div>

                            <Card className="p-10 border-none shadow-xl bg-white rounded-[3rem] space-y-10">
                                <div className="flex flex-col sm:flex-row gap-8 pb-10 border-b border-primary/5">
                                    <div className="relative w-full sm:w-48 aspect-square rounded-2xl overflow-hidden shadow-md">
                                        <Image
                                            src={booking.property.images[0]?.url || "/placeholder.jpg"}
                                            alt={booking.property.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Selected Estate</div>
                                            <h3 className="text-2xl font-bold heading-serif">{booking.property.title}</h3>
                                            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                                <MapPin className="w-4 h-4" />
                                                {booking.property.city}, {booking.property.country}
                                            </div>
                                        </div>
                                        <div className="flex gap-4 pt-2">
                                            <div className="px-4 py-2 bg-secondary/30 rounded-xl text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                                <Users className="w-3.5 h-3.5" />
                                                {booking.guests} Residents
                                            </div>
                                            <div className="px-4 py-2 bg-secondary/30 rounded-xl text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                All-Inclusive
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Arrival Signature</label>
                                        <div className="p-6 bg-secondary/30 rounded-2xl flex items-center gap-4">
                                            <Calendar className="w-5 h-5 text-accent" />
                                            <span className="font-bold">{format(new Date(booking.checkIn), 'MMMM dd, yyyy')}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Departure Signature</label>
                                        <div className="p-6 bg-secondary/30 rounded-2xl flex items-center gap-4">
                                            <Calendar className="w-5 h-5 text-accent" />
                                            <span className="font-bold">{format(new Date(booking.checkOut), 'MMMM dd, yyyy')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-primary text-primary-foreground rounded-[2rem] space-y-6">
                                    <div className="flex justify-between items-center opacity-70 text-[10px] font-bold uppercase tracking-widest">
                                        <span>Stay Valuation</span>
                                        <span>{nights} Nights x ${Number(booking.property.pricePerMonth).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-end border-t border-white/10 pt-6">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest opacity-60">Total Investment</p>
                                            <p className="text-4xl font-bold heading-serif italic">${Number(booking.totalPrice).toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold uppercase tracking-widest bg-accent px-3 py-1 rounded-full text-white">Guaranteed Rate</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Right Column: Payment */}
                        <div className="lg:col-span-5">
                            <Card className="p-10 border-none shadow-2xl bg-white rounded-[3rem] sticky top-32 space-y-8 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                                <div className="relative space-y-8">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold heading-serif italic">Payment Gateway</h3>
                                        <p className="text-sm text-muted-foreground font-light leading-relaxed">
                                            All transactions are processed through our secure, high-encryption servers.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-6 border-2 border-accent bg-accent/5 rounded-2xl">
                                            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold">Standard Payment</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Paystack / Mobile Money</p>
                                            </div>
                                            <div className="w-5 h-5 rounded-full border-2 border-accent flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-4">
                                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground italic font-light px-2">
                                            <Lock className="w-4 h-4 text-accent" />
                                            Your financial data is never stored on our local infrastructure.
                                        </div>

                                        <PaymentButton
                                            bookingId={booking.id}
                                            amount={Number(booking.totalPrice)}
                                            email={booking.user.email}
                                            title={booking.property.title}
                                        />

                                        <div className="flex justify-center gap-6 opacity-30 grayscale contrast-125">
                                            {/* Mock Payment Logo Placeholders */}
                                            <div className="h-6 w-12 bg-black/20 rounded-md" />
                                            <div className="h-6 w-12 bg-black/20 rounded-md" />
                                            <div className="h-6 w-12 bg-black/20 rounded-md" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
