import { Card } from '@/components/ui/card'
import { Shield, User, Clock, Activity, Search, Filter, History, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export default async function AdminLogsPage() {
    const logs = await prisma.activityLog.findMany({
        include: {
            user: {
                select: {
                    fullName: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 100
    })

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-4">
                    <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Governance
                    </Link>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold heading-serif">Audit Logs</h1>
                        <p className="text-muted-foreground font-light text-lg">Detailed history of system actions and administrative changes.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter logs..."
                            className="h-12 w-64 pl-12 pr-4 bg-white rounded-2xl border-none shadow-sm focus:ring-1 focus:ring-accent outline-none text-sm transition-all"
                        />
                    </div>
                </div>
            </div>

            <Card className="border-none shadow-2xl bg-white/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-primary/5">
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Timestamp</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Actor</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Action</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Entity</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {logs.length > 0 ? logs.map((log) => (
                                <tr key={log.id} className="group hover:bg-white/40 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">{format(log.createdAt, 'MMM d, yyyy')}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase">{format(log.createdAt, 'HH:mm:ss')}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                                <User className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="flex flex-col text-sm">
                                                <span className="font-bold">{log.user?.fullName || 'System'}</span>
                                                <span className="text-[10px] text-muted-foreground">{log.user?.email || 'automated@system'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            log.action.includes('CREATE') ? "bg-green-100 text-green-700" :
                                                log.action.includes('DELETE') ? "bg-red-100 text-red-700" :
                                                    log.action.includes('UPDATE') ? "bg-blue-100 text-blue-700" :
                                                        "bg-secondary text-primary"
                                        )}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{log.entityType || '---'}</span>
                                            <span className="text-[10px] text-muted-foreground font-mono">{log.entityId || ''}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm text-muted-foreground max-w-xs truncate" title={log.details || ''}>
                                            {log.details || 'No additional data'}
                                        </p>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <History className="w-12 h-12 text-muted-foreground opacity-20" />
                                            <p className="text-muted-foreground font-light text-lg italic">No audit history found...</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
