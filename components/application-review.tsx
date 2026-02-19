'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { reviewApplication } from '@/lib/actions/applications'
import { toast } from 'sonner'
import { Check, X, Clock, Briefcase, Phone, User as UserIcon, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'

interface ApplicationReviewProps {
    initialApplications: any[]
}

export default function ApplicationReview({ initialApplications }: ApplicationReviewProps) {
    const [applications, setApplications] = useState(initialApplications)
    const [processing, setProcessing] = useState<string | null>(null)

    const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        let reason = ''
        if (status === 'REJECTED') {
            reason = window.prompt('Please provide a reason for rejection (optional):') || ''
        } else if (!window.confirm('Are you sure you want to approve this curator? They will be granted property management privileges.')) {
            return
        }

        setProcessing(id)
        try {
            const result = await reviewApplication(id, status, reason)
            if (result.success) {
                toast.success(`Application ${status.toLowerCase()} successfully.`)
                setApplications(applications.filter(app => app.id !== id))
            } else {
                toast.error(result.error || "Failed to process application.")
            }
        } catch (error) {
            toast.error("An error occurred.")
        } finally {
            setProcessing(null)
        }
    }

    if (applications.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-primary/5 shadow-sm">
                <Clock className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-20" />
                <h3 className="text-2xl font-bold heading-serif text-muted-foreground">All Current Applications Curated</h3>
                <p className="text-sm text-muted-foreground mt-2">The estate list is up to date.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {applications.map((app) => (
                <Card key={app.id} className="p-8 bg-white border-primary/5 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
                    <div className="flex flex-col lg:flex-row gap-10 items-start">
                        {/* User Profile Info */}
                        <div className="flex items-center gap-6 lg:w-1/3">
                            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-accent overflow-hidden">
                                {app.user.avatarUrl ? (
                                    <img src={app.user.avatarUrl} alt={app.user.fullName} className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-8 h-8" />
                                )}
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold heading-serif">{app.user.fullName}</h4>
                                <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground mt-1">{app.user.email}</p>
                                <div className="flex items-center gap-2 mt-3 p-2 bg-secondary/30 rounded-lg w-fit">
                                    <Phone className="w-3 h-3 text-accent" />
                                    <span className="text-[10px] font-bold">{app.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Professional Details */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 py-6 lg:py-0 border-y lg:border-y-0 lg:border-x border-primary/5 lg:px-10">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-accent italic">Experience</p>
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-primary opacity-40" />
                                        <span className="text-sm font-medium">{app.yearsExperience || 'Not specified'} years</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-accent italic">Portfolio</p>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-primary opacity-40" />
                                        <span className="text-sm font-medium">{app.propertyCount || 'Not specified'} properties</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-accent italic">Curator Statement</p>
                                <div className="flex items-start gap-2">
                                    <MessageSquare className="w-4 h-4 text-primary opacity-40 mt-1" />
                                    <p className="text-xs text-muted-foreground leading-relaxed italic line-clamp-3">
                                        "{app.description}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-row lg:flex-col gap-3 lg:w-fit w-full">
                            <Button
                                onClick={() => handleReview(app.id, 'APPROVED')}
                                disabled={processing === app.id}
                                className="flex-1 lg:w-32 h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white gap-2 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-green-600/20"
                            >
                                {processing === app.id ? <Clock className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Approve
                            </Button>
                            <Button
                                onClick={() => handleReview(app.id, 'REJECTED')}
                                disabled={processing === app.id}
                                variant="outline"
                                className="flex-1 lg:w-32 h-14 rounded-2xl border-red-200 text-red-600 hover:bg-red-50 gap-2 font-bold uppercase tracking-widest text-[10px]"
                            >
                                <X className="w-4 h-4" />
                                Reject
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}
