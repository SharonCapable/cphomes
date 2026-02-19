'use client'

import { Search, SlidersHorizontal, ChevronDown, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PropertyType } from '@prisma/client'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const PROPERTY_TYPES = Object.values(PropertyType) as string[]
const BEDROOM_OPTIONS = ['all', '0', '1', '2', '3', '4+']

export default function ListingFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [location, setLocation] = useState(searchParams.get('location') || '')
    const [type, setType] = useState(searchParams.get('type') || 'all')
    const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'all')
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
        searchParams.get('amenities')?.split(',').filter(Boolean) || []
    )
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 100)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (location) params.append('location', location)
        if (type !== 'all') params.append('type', type)
        if (bedrooms !== 'all') params.append('bedrooms', bedrooms)
        if (minPrice) params.append('minPrice', minPrice)
        if (maxPrice) params.append('maxPrice', maxPrice)
        if (selectedAmenities.length > 0) params.append('amenities', selectedAmenities.join(','))
        router.push(`/properties?${params.toString()}`)
    }

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
        )
    }

    return (
        <div className={cn(
            "sticky top-28 z-40 w-full transition-all duration-300 mb-12",
            isScrolled ? "scale-95 translate-y-[-10px]" : "scale-100"
        )}>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="glass-card p-2 rounded-[2.5rem] shadow-2xl border-white/40 flex flex-col items-stretch gap-2">
                    <div className="flex flex-col lg:flex-row items-center gap-2">
                        {/* Location Search */}
                        <div className="flex-1 w-full lg:w-auto px-8 py-4 rounded-[2rem] hover:bg-black/5 transition-colors flex items-center gap-4">
                            <Search className="w-5 h-5 text-accent" />
                            <div className="flex-1">
                                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-0.5">Location</label>
                                <input
                                    type="text"
                                    placeholder="Where would you like to reside?"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:text-muted-foreground/40"
                                />
                            </div>
                        </div>

                        <div className="hidden lg:block w-px h-10 bg-border/50" />

                        {/* Property Type */}
                        <div className="w-full lg:w-48 px-8 py-4 rounded-[2rem] hover:bg-black/5 transition-colors group relative cursor-pointer">
                            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-0.5">Type</label>
                            <div className="flex justify-between items-center">
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="bg-transparent border-none outline-none text-sm font-bold appearance-none w-full cursor-pointer pr-4"
                                >
                                    <option value="all">Every Type</option>
                                    {PROPERTY_TYPES.map(t => (
                                        <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-3 h-3 text-accent absolute right-6 top-[2.4rem]" />
                            </div>
                        </div>

                        <div className="hidden lg:block w-px h-10 bg-border/50" />

                        {/* Advanced Toggle */}
                        <Button
                            variant="ghost"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="bg-secondary/50 hover:bg-secondary/80 rounded-[2rem] px-6 h-16 flex items-center gap-2"
                        >
                            <SlidersHorizontal className="w-4 h-4 text-accent" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Adjust</span>
                        </Button>

                        <Button
                            onClick={handleSearch}
                            size="lg"
                            className="w-full lg:w-auto px-10 h-16 rounded-[2rem] bg-primary hover:bg-primary/95 text-white shadow-xl shadow-primary/20 flex items-center gap-3 active:scale-95 transition-all ml-auto"
                        >
                            <span className="font-bold uppercase tracking-widest text-xs">Search</span>
                        </Button>
                    </div>

                    <AnimatePresence>
                        {showAdvanced && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-secondary/20 rounded-[2rem] mt-2 p-8 space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                    {/* Price Range */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-accent">Price Budget</h4>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                                className="w-full h-12 px-6 rounded-xl bg-white border border-primary/5 outline-none focus:ring-1 focus:ring-accent text-sm font-medium"
                                            />
                                            <span className="text-muted-foreground opacity-30">to</span>
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                                className="w-full h-12 px-6 rounded-xl bg-white border border-primary/5 outline-none focus:ring-1 focus:ring-accent text-sm font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Bedrooms */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-accent">Capacity</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {BEDROOM_OPTIONS.map(b => (
                                                <button
                                                    key={b}
                                                    onClick={() => setBedrooms(b)}
                                                    className={cn(
                                                        "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                                        bedrooms === b ? "bg-primary text-white" : "bg-white hover:bg-primary/5 text-muted-foreground"
                                                    )}
                                                >
                                                    {b === 'all' ? 'Any' : b === '0' ? 'Studio' : b}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Amenities Dropdown or Grid */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-accent">Amenities</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['WiFi', 'Pool', 'Gym', 'Parking', 'Security'].map(a => (
                                                <button
                                                    key={a}
                                                    onClick={() => toggleAmenity(a)}
                                                    className={cn(
                                                        "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                                        selectedAmenities.includes(a) ? "bg-accent text-white" : "bg-white hover:bg-accent/5 text-muted-foreground"
                                                    )}
                                                >
                                                    {a}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
