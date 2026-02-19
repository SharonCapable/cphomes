'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    ArrowLeft,
    X,
    MapPin,
    DollarSign,
    Check,
    PlusCircle,
    Loader2,
    Save
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { updateProperty } from '@/lib/actions/manager'
import { PropertyType } from '@prisma/client'

const AMENITIES_OPTIONS = [
    'WiFi', 'Air Conditioning', 'Pool', 'Gym', 'Parking',
    'Kitchen', 'Security', 'Ocean View', 'Garden', 'Balcony'
]

interface EditPropertyFormProps {
    property: any
}

export default function EditPropertyForm({ property }: EditPropertyFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: property.title,
        description: property.description,
        type: property.type as PropertyType,
        address: property.address,
        city: property.city,
        country: property.country,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.squareFeet || 0,
        pricePerMonth: Number(property.pricePerMonth),
        amenities: property.amenities || [],
    })

    const [images, setImages] = useState<{ url: string; isPrimary: boolean }[]>(
        property.images.map((img: any) => ({ url: img.url, isPrimary: img.isPrimary }))
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: ['pricePerMonth', 'bedrooms', 'bathrooms', 'squareFeet'].includes(name) ? Number(value) : value
        }))
    }

    const toggleAmenity = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter((a: string) => a !== amenity)
                : [...prev.amenities, amenity]
        }))
    }

    const handleAddImage = () => {
        const url = prompt("Enter image URL (Unsplash or similar):")
        if (url) {
            setImages(prev => [...prev, { url, isPrimary: false }])
        }
    }

    const removeImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx))
    }

    const setPrimaryImage = (idx: number) => {
        setImages(prev => prev.map((img, i) => ({ ...img, isPrimary: i === idx })))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await updateProperty(property.id, {
                ...formData,
                images: images.map(img => ({ url: img.url, isPrimary: img.isPrimary }))
            })

            if (result.success) {
                toast.success("Estate credentials updated effectively.")
                router.push('/manager/properties')
            } else {
                toast.error(result.error || "A disruption occurred during the update.")
            }
        } catch (error) {
            toast.error("Protocol error. Contact concierge.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-12">
            <div className="flex items-center gap-4">
                <Link href="/manager/properties" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-4xl font-bold heading-serif italic">Refine Estate</h1>
                    <p className="text-sm text-muted-foreground font-light uppercase tracking-widest mt-1">Enhance the attributes of your curated property</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Details */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="p-8 sm:p-10 border-none shadow-xl bg-white rounded-[2.5rem] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold heading-serif border-b border-primary/5 pb-4">Principal Identity</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Estate Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 bg-secondary/30 rounded-2xl border-none outline-none focus:ring-1 focus:ring-primary font-bold text-lg"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Narrative Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={8}
                                        className="w-full px-6 py-4 bg-secondary/30 rounded-2xl border-none outline-none focus:ring-1 focus:ring-primary font-medium resize-none leading-relaxed"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold heading-serif border-b border-primary/5 pb-4">Architectural Specs</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Property Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 bg-secondary/30 rounded-2xl border-none outline-none focus:ring-1 focus:ring-primary font-bold appearance-none cursor-pointer"
                                    >
                                        {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Bedrooms</label>
                                    <input
                                        type="number"
                                        name="bedrooms"
                                        value={formData.bedrooms}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 bg-secondary/30 rounded-2xl border-none outline-none focus:ring-1 focus:ring-primary font-bold"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Bathrooms</label>
                                    <input
                                        type="number"
                                        name="bathrooms"
                                        value={formData.bathrooms}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 bg-secondary/30 rounded-2xl border-none outline-none focus:ring-1 focus:ring-primary font-bold"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 sm:p-10 border-none shadow-xl bg-white rounded-[2.5rem] space-y-8">
                        <div className="flex justify-between items-center border-b border-primary/5 pb-4">
                            <h3 className="text-xl font-bold heading-serif">Imagery & Perspectives</h3>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Click an image to set as primary</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <AnimatePresence>
                                {images.map((img, i) => (
                                    <motion.div
                                        key={i}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className={cn(
                                            "relative aspect-square rounded-2xl overflow-hidden group shadow-md cursor-pointer border-2 transition-all",
                                            img.isPrimary ? "border-accent scale-[1.02] shadow-accent/20" : "border-transparent"
                                        )}
                                        onClick={() => setPrimaryImage(i)}
                                    >
                                        <img src={img.url} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        {img.isPrimary && (
                                            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-accent text-white text-[8px] font-bold uppercase tracking-widest rounded-md">Primary Selection</div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <button
                                type="button"
                                onClick={handleAddImage}
                                className="aspect-square rounded-2xl border-2 border-dashed border-primary/10 flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary/30 hover:border-primary/30 transition-all gap-2"
                            >
                                <PlusCircle className="w-6 h-6 text-accent" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Add Horizon</span>
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Investment & Controls */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="p-8 border-none shadow-xl bg-primary text-primary-foreground rounded-[2.5rem] space-y-6">
                        <h3 className="text-xl font-bold heading-serif italic text-accent">Investment Audit</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest opacity-60 ml-2">Monthly Investment (USD)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
                                    <input
                                        type="number"
                                        name="pricePerMonth"
                                        value={formData.pricePerMonth}
                                        onChange={handleInputChange}
                                        className="w-full pl-14 pr-6 py-5 bg-white/10 rounded-2xl border-none outline-none focus:ring-1 focus:ring-accent font-bold text-2xl"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest opacity-60 ml-2">Interior Area (SQFT)</label>
                                <input
                                    type="number"
                                    name="squareFeet"
                                    value={formData.squareFeet}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-5 bg-white/10 rounded-2xl border-none outline-none focus:ring-1 focus:ring-accent font-bold text-xl"
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 border-none shadow-xl bg-white rounded-[2.5rem] space-y-6">
                        <h3 className="text-xl font-bold heading-serif">Refined Amenities</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {AMENITIES_OPTIONS.map(amenity => (
                                <button
                                    key={amenity}
                                    type="button"
                                    onClick={() => toggleAmenity(amenity)}
                                    className={cn(
                                        "px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all text-left flex items-center justify-between",
                                        formData.amenities.includes(amenity) ? "bg-accent text-white shadow-lg shadow-accent/20" : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
                                    )}
                                >
                                    {amenity}
                                    {formData.amenities.includes(amenity) && <Check className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>
                    </Card>

                    <div className="space-y-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-20 rounded-[2rem] bg-primary hover:bg-primary/95 text-white font-bold uppercase tracking-[0.2em] text-xs shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-5 h-5 text-accent" />}
                            {loading ? 'Committing Changes...' : 'Save Refinements'}
                        </Button>

                        <Link href="/manager/properties" className="block">
                            <Button variant="ghost" className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
                                Discard Changes
                            </Button>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
