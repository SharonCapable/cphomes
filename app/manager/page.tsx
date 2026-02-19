import { Card } from '@/components/ui/card'
import {
    Home,
    Calendar,
    DollarSign,
    TrendingUp,
    PlusCircle,
    ChevronRight,
    Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import BookingRow from '@/components/booking-row'

import { serializePrisma } from '@/lib/utils'

export default async function ManagerDashboard() {
    const session = await getServerSession(authOptions)
    const managerId = (session?.user as any).id

    // Fetch Real Data
    const propertyCount = await prisma.property.count({ where: { managerId } })
    const pendingBookings = await prisma.booking.count({
        where: {
            property: { managerId },
            status: 'PENDING'
        }
    })

    const recentBookings = await prisma.booking.findMany({
        where: { property: { managerId } },
        include: {
            property: { select: { title: true } },
            user: { select: { fullName: true, email: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
    })

    const totalRevenue = await prisma.booking.aggregate({
        where: {
            property: { managerId },
            status: 'CONFIRMED'
        },
        _sum: { totalPrice: true }
    })

    const stats = [
        { label: 'Active Listings', value: propertyCount.toString(), icon: Home, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending Books', value: pendingBookings.toString(), icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Total Revenue', value: `$${(totalRevenue._sum.totalPrice || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Occupancy Rate', value: 'Live', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    ]

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold heading-serif">Listing Overview</h1>
                    <p className="text-muted-foreground mt-2 font-light">Manage your curated portfolio and residents.</p>
                </div>
                <Link href="/manager/properties/new">
                    <Button className="rounded-2xl h-14 px-8 bg-primary hover:bg-primary/95 text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 flex items-center gap-3">
                        <PlusCircle className="w-5 h-5" />
                        Add New Listing
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="p-8 border-none shadow-sm bg-white rounded-[2.5rem] group hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                        </div>
                        <h3 className="text-4xl font-bold tracking-tight text-primary">{stat.value}</h3>
                        <p className="text-sm text-muted-foreground mt-2 font-bold uppercase tracking-widest">{stat.label}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Recent Bookings */}
                <Card className="lg:col-span-8 p-10 border-none shadow-xl bg-white rounded-[3rem] overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-bold heading-serif">Recent Residencies</h3>
                        <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-accent">Real-time Feed <ChevronRight className="w-4 h-4 ml-1" /></Button>
                    </div>

                    <div className="space-y-6">
                        {recentBookings.map((booking) => (
                            <BookingRow key={booking.id} booking={serializePrisma(booking)} />
                        ))}
                        {recentBookings.length === 0 && (
                            <div className="py-12 text-center text-muted-foreground italic font-light">
                                No active residency applications found.
                            </div>
                        )}
                    </div>
                </Card>

                {/* Quick Actions / Notifications */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-8 border-none shadow-xl bg-primary text-primary-foreground rounded-[2.5rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 space-y-4">
                            <h4 className="text-xl font-bold heading-serif italic">Management Tip</h4>
                            <p className="text-sm font-light opacity-80 leading-relaxed">
                                High-resolution images increase booking rates by up to 45%. Review your property gallery today.
                            </p>
                            <Link href="/manager/properties">
                                <Button className="w-full rounded-xl bg-white text-primary font-bold uppercase tracking-widest text-[10px] h-12 mt-4">Optimize Collections</Button>
                            </Link>
                        </div>
                    </Card>

                    <Card className="p-8 border-none shadow-xl bg-white rounded-[2.5rem]">
                        <h4 className="text-xl font-bold heading-serif mb-6">Concierge Support</h4>
                        <div className="space-y-6">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">24/7 Priority Line</p>
                                    <p className="text-xs text-muted-foreground">+233 20 711 9731</p>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full rounded-xl border-border text-[10px] font-bold uppercase tracking-widest h-12">Contact Support</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
