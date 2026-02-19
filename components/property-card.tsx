'use client'

import { MapPin, Bed, Bath } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import FavoriteButton from './favorite-button'

interface PropertyCardProps {
    property: any // Using any for now to handle combined Prisma types
    index: number
}

import { useState, useEffect } from 'react'

export default function PropertyCard({ property, index }: PropertyCardProps) {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    const primaryImage = property.images?.find((img: any) => img.isPrimary) || property.images?.[0]
    const imageUrl = primaryImage?.url || '/luxury-apartment-exterior-modern.jpg'

    const content = (
        <Link href={`/properties/${property.slug}`}>
            <div className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-6 shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                    <img
                        src={imageUrl}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 right-6 flex flex-col gap-3 items-end">
                        <div className="glass-card px-4 py-2 rounded-full font-bold text-sm">
                            {property.currency === 'GHS' ? '₵' : '$'}
                            {Number(property.pricePerMonth).toLocaleString()}
                            <span className="opacity-60 font-normal ml-1">
                                {property.billingPeriod === 'PER_NIGHT' ? '/night' : '/mo'}
                            </span>
                        </div>
                        <FavoriteButton
                            propertyId={property.id}
                            initialIsFavorited={property.isFavorited}
                        />
                    </div>
                </div>
                <div className="space-y-3 px-2">
                    <div className="flex items-center gap-2 text-accent font-bold text-[10px] uppercase tracking-widest">
                        <MapPin className="w-3 h-3" />
                        {property.city}, {property.country}
                    </div>
                    <h3 className="text-2xl font-bold heading-serif line-clamp-1 group-hover:text-primary transition-colors">
                        {property.title}
                    </h3>
                    <div className="flex gap-6 text-sm text-muted-foreground font-medium border-t border-primary/5 pt-4">
                        <div className="flex items-center gap-2">
                            <Bed className="w-4 h-4 text-primary" />
                            <span>{property.bedrooms} Bed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Bath className="w-4 h-4 text-primary" />
                            <span>{property.bathrooms} Bath</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )

    if (!mounted) return <div className="opacity-0">{content}</div>

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
        >
            {content}
        </motion.div>
    )
}
