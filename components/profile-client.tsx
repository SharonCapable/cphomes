'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import {
    User as UserIcon,
    Calendar,
    CreditCard,
    Settings,
    LogOut,
    ChevronRight,
    Clock,
    ShieldCheck,
    Star,
    Heart,
    MessageSquare,
    MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import PropertyCard from '@/components/property-card'

interface ProfileClientProps {
    user: any
    initialBookings: any[]
    initialFavorites: any[]
}

export default function ProfileClient({ user, initialBookings, initialFavorites }: ProfileClientProps) {
    const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history')

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-4 space-y-8 animate-in slide-in-from-left duration-700">
                <Card className="p-10 border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden group relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-110" />

                    <div className="relative z-10 space-y-8">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="relative w-32 h-32">
                                <div className="absolute inset-0 bg-accent/10 rounded-full animate-pulse" />
                                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                                    <Image
                                        src={user.image || user.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (user.name || user.email)}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold heading-serif">{user.fullName || user.name || 'Resident'}</h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mt-1">Premium Resident</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-8 border-t border-primary/5">
                            <div className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-secondary/30 transition-colors">
                                <UserIcon className="w-5 h-5 text-accent" />
                                <div className="text-left">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Account Integrity</p>
                                    <p className="text-sm font-bold">Verified Professional</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-secondary/30 transition-colors">
                                <CreditCard className="w-5 h-5 text-accent" />
                                <div className="text-left">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Membership</p>
                                    <p className="text-sm font-bold">Circle Point Gold</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <Link href="/concierge">
                                <Button variant="outline" className="w-full h-14 rounded-2xl border-border gap-2 font-bold uppercase tracking-widest text-[10px]">
                                    <MessageSquare className="w-4 h-4" /> Concierge Inbox
                                </Button>
                            </Link>
                            <Button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                variant="ghost"
                                className="w-full h-14 rounded-2xl text-red-500 hover:bg-red-50 gap-2 font-bold uppercase tracking-widest text-[10px]"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="p-8 border-none shadow-xl bg-primary text-primary-foreground rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-2 text-accent font-bold">
                            <Star className="w-4 h-4 fill-accent" />
                            <span className="text-[10px] uppercase tracking-widest">Exclusive Access</span>
                        </div>
                        <h4 className="text-xl font-bold heading-serif italic leading-tight">Elite Support</h4>
                        <p className="text-sm font-light opacity-80 leading-relaxed">
                            As a Gold member, you have direct priority access to our global network of curators.
                        </p>
                        <Link href="/concierge" className="block">
                            <Button className="w-full h-12 rounded-xl bg-white text-primary font-bold uppercase tracking-widest text-[10px] mt-4">Consult Concierge</Button>
                        </Link>
                    </div>
                </Card>
            </div>

            {/* Right Column: Dynamic Content */}
            <div className="lg:col-span-8 space-y-12 animate-in slide-in-from-right duration-700">
                <div className="flex flex-col sm:flex-row gap-8 items-end justify-between border-b border-primary/5 pb-8">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-bold heading-serif">
                            {activeTab === 'history' ? 'Residency History' : 'Curated Collection'}
                        </h1>
                        <p className="text-lg text-muted-foreground font-light leading-relaxed">
                            {activeTab === 'history'
                                ? 'Your legacy of stays within the Circle Point network.'
                                : 'Estates you have selected for future residency.'}
                        </p>
                    </div>
                    <div className="flex gap-2 p-1.5 bg-secondary/30 rounded-2xl border border-primary/5">
                        <button
                            onClick={() => setActiveTab('history')}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                activeTab === 'history' ? "bg-white shadow-md text-primary" : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            History
                        </button>
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                activeTab === 'favorites' ? "bg-white shadow-md text-primary" : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            Favorites
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'history' ? (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {initialBookings.map((booking, i) => (
                                <Card key={booking.id} className="group overflow-hidden border-none shadow-lg bg-white rounded-[2.5rem] hover:shadow-2xl transition-all duration-500">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="w-full md:w-48 h-48 md:h-auto relative">
                                            <Image
                                                src={booking.property.images[0]?.url || '/placeholder.jpg'}
                                                alt=""
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 p-8 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold text-primary">{booking.property.title}</h3>
                                                    <p className="text-xs text-muted-foreground">{booking.property.city}, {booking.property.country}</p>
                                                </div>
                                                <div className={cn(
                                                    "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm",
                                                    booking.status === 'CONFIRMED' ? "bg-green-100 text-green-700" :
                                                        booking.status === 'PENDING' ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                                                )}>
                                                    {booking.status}
                                                </div>
                                            </div>
                                            <div className="flex gap-8 pt-4 border-t border-primary/5">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-accent" />
                                                    <span className="text-xs font-bold text-primary">
                                                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4 text-accent" />
                                                    <span className="text-xs font-bold text-primary">${Number(booking.totalPrice).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}

                            {initialBookings.length === 0 && (
                                <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-primary/10">
                                    <Clock className="w-12 h-12 text-primary/20 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold heading-serif italic">Your Journey Awaits</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto font-light mt-4">Explore our prestigious estates to begin your legacy.</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="favorites"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {initialFavorites.map((property, i) => (
                                <PropertyCard key={property.id} property={{ ...property, isFavorited: true }} index={i} />
                            ))}

                            {initialFavorites.length === 0 && (
                                <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-dashed border-primary/10">
                                    <Heart className="w-12 h-12 text-red-100 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold heading-serif italic">Curate Your Desires</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto font-light mt-4">Save properties to your collection for effortless future discovery.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
