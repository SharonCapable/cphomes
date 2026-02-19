'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Edit2, Trash2, MapPin, Loader2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { deleteProperty } from '@/lib/actions/manager'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ManagerPropertyCardProps {
    property: any
}

export default function ManagerPropertyCard({ property }: ManagerPropertyCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteProperty(property.id)
            if (result.success) {
                toast.success("Listing removed from collection.")
            } else {
                toast.error(result.error || "Failed to remove listing.")
            }
        } catch (error) {
            toast.error("Protocol error during removal.")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Card className="group overflow-hidden border-none shadow-lg bg-white rounded-[2.5rem] flex flex-col hover:shadow-2xl transition-all duration-500">
            <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                    src={property.images[0]?.url || "/placeholder.jpg"}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm">
                    {property.status}
                </div>
            </div>

            <div className="p-8 flex-1 flex flex-col space-y-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold line-clamp-1">{property.title}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        {property.city}, {property.country}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-primary/5">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pricing</p>
                        <p className="text-lg font-bold text-primary">
                            {property.currency === 'GHS' ? '₵' : '$'}
                            {property.pricePerMonth?.toString()}
                            <span className="text-[10px] opacity-60 font-normal ml-1">
                                {property.billingPeriod === 'PER_NIGHT' ? '/night' : '/mo'}
                            </span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Bookings</p>
                        <p className="text-lg font-bold text-accent">{property._count?.bookings || 0}</p>
                    </div>
                </div>

                <div className="flex gap-2 pt-4">
                    <Link href={`/properties/${property.slug}`} className="flex-1">
                        <Button variant="outline" className="w-full rounded-xl border-border h-12 text-[10px] font-bold uppercase tracking-widest gap-2">
                            <Eye className="w-4 h-4" /> View
                        </Button>
                    </Link>
                    <Link href={`/manager/properties/${property.id}/edit`}>
                        <Button variant="secondary" className="rounded-xl h-12 w-12 flex items-center justify-center bg-secondary hover:bg-primary/5 p-0">
                            <Edit2 className="w-4 h-4 text-primary" />
                        </Button>
                    </Link>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" className="rounded-xl h-12 w-12 flex items-center justify-center text-red-500 hover:bg-red-50 p-0">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[2rem] p-8 border-none shadow-2xl">
                            <AlertDialogHeader>
                                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-4">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <AlertDialogTitle className="text-2xl heading-serif italic font-bold">Remove Listing?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground font-light text-base">
                                    This action will permanently retire <span className="font-bold text-primary">{property.title}</span> from our active collection. This selection cannot be reversed.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-8 gap-3">
                                <AlertDialogCancel className="rounded-xl border-border h-12 font-bold uppercase tracking-widest text-[10px]">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="rounded-xl bg-red-600 hover:bg-red-700 text-white h-12 font-bold uppercase tracking-widest text-[10px]"
                                >
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Removal'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </Card>
    )
}
