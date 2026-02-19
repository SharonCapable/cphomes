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
    Loader2
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { updateProperty } from '@/lib/actions/manager'
import { getPropertyById } from '@/lib/actions/properties'
import { PropertyType } from '@prisma/client'
import React from 'react'

const AMENITIES_OPTIONS = [
    'WiFi', 'Air Conditioning', 'Pool', 'Gym', 'Parking',
    'Kitchen', 'Security', 'Ocean View', 'Garden', 'Balcony'
]

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'APARTMENT' as PropertyType,
        address: '',
        city: '',
        country: 'Ghana',
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 0,
        pricePerMonth: 0,
        currency: 'USD' as 'USD' | 'GHS',
        billingPeriod: 'PER_MONTH' as 'PER_NIGHT' | 'PER_MONTH',
        amenities: [] as string[],
    })

    const [images, setImages] = useState<{ url: string; isPrimary: boolean; file?: File }[]>([])
    const [propertyId, setPropertyId] = useState<string>('')

    useEffect(() => {
        params.then(p => {
            setPropertyId(p.id)
            fetchProperty(p.id)
        })
    }, [params])

    const fetchProperty = async (id: string) => {
        try {
            const property = await getPropertyById(id) as any
            if (property) {
                setFormData({
                    title: property.title,
                    description: property.description,
                    type: property.type,
                    address: property.address,
                    city: property.city,
                    country: property.country || 'Ghana',
                    bedrooms: property.bedrooms,
                    bathrooms: property.bathrooms,
                    squareFeet: property.squareFeet ? Number(property.squareFeet) : 0,
                    pricePerMonth: Number(property.pricePerMonth),
                    currency: property.currency || 'USD',
                    billingPeriod: property.billingPeriod || 'PER_MONTH',
                    amenities: property.amenities || [],
                })
                setImages(property.images.map((img: any) => ({
                    url: img.url,
                    isPrimary: img.isPrimary
                })))
            } else {
                toast.error("Listing not found")
                router.push('/manager/properties')
            }
        } catch (error) {
            toast.error("Failed to load listing details")
        } finally {
            setFetching(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        const isNumeric = ['price', 'bedrooms', 'bathrooms', 'squareFeet'].some(k => name.toLowerCase().includes(k))
        setFormData(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }))
    }

    const toggleAmenity = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }))
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const newImages = Array.from(files).map(file => ({
            url: URL.createObjectURL(file),
            isPrimary: images.length === 0,
            file: file
        }))

        setImages(prev => [...prev, ...newImages])
    }

    const removeImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const processImages = await Promise.all(images.map(async (img) => {
                if (img.file) {
                    return new Promise<{ url: string; isPrimary: boolean }>((resolve) => {
                        const reader = new FileReader()
                        reader.onloadend = () => resolve({ url: reader.result as string, isPrimary: img.isPrimary })
                        reader.readAsDataURL(img.file!)
                    })
                }
                return { url: img.url, isPrimary: img.isPrimary }
            }))

            const result = await updateProperty(propertyId, {
                ...formData,
                images: processImages
            })

            if (result.success) {
                toast.success("Listing successfully updated.")
                router.push('/manager/properties')
            } else {
                toast.error(result.error || "A disruption occurred during update.")
            }
        } catch (error) {
            toast.error("Protocol error during update.")
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-accent" />
            </div>
        )
    }

    return (
        <div className="space-y-12">
            <div className="flex items-center gap-4">
                <Link href="/manager/properties" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-4xl font-bold heading-serif italic">Edit Listing</h1>
                    <p className="text-sm text-muted-foreground font-light uppercase tracking-widest mt-1">Refine the details of your property</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Details */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="p-8 sm:p-10 border-none shadow-xl bg-white rounded-[2.5rem] space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold heading-serif border-b border-primary/5 pb-4">Listing Basics</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Listing Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g. The Azure Horizon Penthouse"
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
                                        rows={5}
                                        placeholder="Describe the architectural soul and living experience of this masterpiece..."
                                        className="w-full px-6 py-4 bg-secondary/30 rounded-2xl border-none outline-none focus:ring-1 focus:ring-primary font-medium resize-none leading-relaxed"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold heading-serif border-b border-primary/5 pb-4">Property Details</h3>
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
                                        min="0"
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
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold heading-serif border-b border-primary/5 pb-4">Location Info</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Physical Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Street, District"
                                            className="w-full pl-14 pr-6 py-4 bg-secondary/30 rounded-2xl border-none outline-none focus:ring-1 focus:ring-primary font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Accra"
                                        className="w-full px-6 py-4 bg-secondary/30 rounded-2xl border-none outline-none focus:ring-1 focus:ring-primary font-medium"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 sm:p-10 border-none shadow-xl bg-white rounded-[2.5rem] space-y-8">
                        <h3 className="text-xl font-bold heading-serif border-b border-primary/5 pb-4">Gallery & Media</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <AnimatePresence>
                                {images.map((img, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="relative aspect-square rounded-2xl overflow-hidden group shadow-md"
                                    >
                                        <img src={img.url} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        {img.isPrimary && (
                                            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-accent text-white text-[8px] font-bold uppercase tracking-widest rounded-md">Primary</div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <label className="aspect-square rounded-2xl border-2 border-dashed border-primary/10 flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary/30 hover:border-primary/30 transition-all gap-2 cursor-pointer">
                                <PlusCircle className="w-6 h-6 text-accent" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Add Perspective</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Pricing & Amenities */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="p-8 border-none shadow-xl bg-primary text-primary-foreground rounded-[2.5rem] space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold heading-serif italic">Pricing & Terms</h3>
                            <div className="flex bg-white/10 rounded-xl p-1">
                                {(['USD', 'GHS'] as const).map((curr) => (
                                    <button
                                        key={curr}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, currency: curr }))}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                                            formData.currency === curr ? "bg-accent text-white" : "hover:bg-white/5"
                                        )}
                                    >
                                        {curr}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Price Amount ({formData.currency})</label>
                                    <select
                                        className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest text-accent"
                                        value={formData.billingPeriod}
                                        onChange={(e) => setFormData(prev => ({ ...prev, billingPeriod: e.target.value as any }))}
                                    >
                                        <option value="PER_MONTH" className="text-primary text-[12px]">Per Month</option>
                                        <option value="PER_NIGHT" className="text-primary text-[12px]">Per Night</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    {formData.currency === 'USD' ? (
                                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
                                    ) : (
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold opacity-60">₵</span>
                                    )}
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
                                <label className="text-[10px] uppercase font-bold tracking-widest opacity-60 ml-2">Overall Area (SQ FT)</label>
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
                        <h3 className="text-xl font-bold heading-serif">Amenities</h3>
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

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-20 rounded-[2rem] bg-accent hover:bg-accent/95 text-white font-bold uppercase tracking-[0.2em] text-xs shadow-2xl shadow-accent/20 transition-all active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Update Listing'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
