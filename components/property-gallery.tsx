'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertyGalleryProps {
    images: { url: string; caption?: string | null }[]
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
    const [index, setIndex] = useState(0)
    const [isFullView, setIsFullView] = useState(false)

    if (!images || images.length === 0) {
        return (
            <div className="w-full aspect-video rounded-[2.5rem] bg-secondary flex items-center justify-center border border-dashed border-primary/20">
                <p className="text-muted-foreground font-light italic">Imagery is being curated...</p>
            </div>
        )
    }

    const next = () => setIndex((index + 1) % images.length)
    const prev = () => setIndex((index - 1 + images.length) % images.length)

    return (
        <div className="space-y-6">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-[2.5rem] overflow-hidden group shadow-2xl">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={index}
                        src={images[index].url}
                        alt={images[index].caption || 'Property Image'}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>

                {/* Overlays */}
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
                    <p className="text-white/80 text-sm font-medium tracking-wide">
                        {images[index].caption || `${index + 1} of ${images.length} Perspectives`}
                    </p>
                </div>

                {/* Navigation */}
                {images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={prev} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={next} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                )}

                <button
                    onClick={() => setIsFullView(true)}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Maximize2 className="w-4 h-4" />
                </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={cn(
                                "relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300",
                                index === i ? "border-accent scale-105 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                            )}
                        >
                            <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
