'use client'

import { useState, useEffect } from 'react'
import { MapPin, Bed, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function Hero({ heroProperty }: { heroProperty?: any }) {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    const router = useRouter()
    const [searchLocation, setSearchLocation] = useState('')
    const [searchBedrooms, setSearchBedrooms] = useState('all')

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (searchLocation) params.append('location', searchLocation)
        if (searchBedrooms !== 'all') params.append('bedrooms', searchBedrooms)
        router.push(`/properties?${params.toString()}`)
    }

    const heroImage = heroProperty?.images?.[0]?.url || "/luxury-apartment-exterior-modern.jpg"
    const heroTitle = heroProperty?.title || "The Peninsula Mansion"
    const heroLocation = heroProperty ? `${heroProperty.city}, ${heroProperty.state || heroProperty.country}` : "East Legon, Accra"

    if (!mounted) return <div className="min-h-[90vh] bg-background" />

    return (
        <section className="relative min-h-[90vh] flex items-center pt-12 pb-20 overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl p-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    {/* Hero Content */}
                    <div className="lg:col-span-7 space-y-10">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase mb-4">
                                    Est. 2025 • Premium Real Estate
                                </span>
                                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1] heading-serif">
                                    Elegance in <br />
                                    <span className="text-accent italic">Every Detail.</span>
                                </h1>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-xl text-muted-foreground max-w-xl leading-relaxed font-light"
                            >
                                Discover a curated collection of Ghana's most prestigious homes.
                                Where architectural brilliance meets unparalleled comfort.
                            </motion.p>
                        </div>

                        {/* Search Bar - Glassmorphism */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="glass-card p-2 rounded-[2rem] shadow-2xl overflow-hidden max-w-3xl"
                        >
                            <div className="flex flex-col md:flex-row items-center gap-2 p-2">
                                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="flex items-center gap-3 px-6 py-4 rounded-2xl transition hover:bg-black/5">
                                        <MapPin className="w-5 h-5 text-accent" />
                                        <div className="flex-1">
                                            <label className="block text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-0.5">Location</label>
                                            <input
                                                type="text"
                                                placeholder="Where to?"
                                                value={searchLocation}
                                                onChange={(e) => setSearchLocation(e.target.value)}
                                                className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:text-muted-foreground/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 px-6 py-4 rounded-2xl transition hover:bg-black/5">
                                        <Bed className="w-5 h-5 text-accent" />
                                        <div className="flex-1">
                                            <label className="block text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-0.5">Living Space</label>
                                            <select
                                                value={searchBedrooms}
                                                onChange={(e) => setSearchBedrooms(e.target.value)}
                                                className="bg-transparent border-none outline-none text-sm w-full font-medium appearance-none"
                                            >
                                                <option value="all">Any Capacity</option>
                                                <option value="0">Studio</option>
                                                <option value="1">1 Bedroom</option>
                                                <option value="2">2+ Bedrooms</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSearch}
                                    size="lg"
                                    className="w-full md:w-auto h-full px-8 py-6 rounded-2xl bg-primary hover:bg-primary/95 text-white flex items-center gap-3 shadow-lg shadow-primary/20 transition-all active:scale-95"
                                >
                                    <Search className="w-5 h-5" />
                                    <span className="font-bold tracking-wide">Explore</span>
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hero Image Layout */}
                    <div className="lg:col-span-5 relative hidden lg:block">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative z-10 w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <img
                                src={heroImage}
                                alt={heroTitle}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                                <p className="text-sm font-medium opacity-80 mb-2">Editor's Choice</p>
                                <h3 className="text-2xl font-bold heading-serif">{heroTitle}</h3>
                                <div className="flex items-center gap-2 mt-2 text-sm">
                                    <MapPin className="w-4 h-4 text-accent" />
                                    <span>{heroLocation}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
