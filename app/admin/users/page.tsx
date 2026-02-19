import { Card } from '@/components/ui/card'
import { Shield, User, Mail, Calendar, Clock, MoreVertical, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

async function updateRole(userId: string, role: string) {
    'use server'
    await prisma.user.update({
        where: { id: userId },
        data: { role: role as any }
    })
    revalidatePath('/admin/users')
}

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold heading-serif">Citizen Management</h1>
                    <p className="text-muted-foreground font-light text-lg">Grant privileges and oversee the inhabitants of Circle Point.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                        <input
                            type="text"
                            placeholder="Search citizens..."
                            className="h-12 w-64 pl-12 pr-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-accent outline-none text-sm font-medium transition-all"
                        />
                    </div>
                </div>
            </div>

            <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/30 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                <th className="px-8 py-6">Citizen</th>
                                <th className="px-8 py-6">Status / Role</th>
                                <th className="px-8 py-6">Relationship Age</th>
                                <th className="px-8 py-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {users.map((citizen) => (
                                <tr key={citizen.id} className="group hover:bg-secondary/10 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-all">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-primary heading-serif">{citizen.fullName || 'Anonymous resident'}</span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {citizen.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase",
                                                citizen.role === 'SUPER_ADMIN' ? "bg-red-50 text-red-600 border border-red-100" :
                                                    citizen.role === 'PROPERTY_MANAGER' ? "bg-purple-50 text-purple-600 border border-purple-100" :
                                                        "bg-blue-50 text-blue-600 border border-blue-100"
                                            )}>
                                                {citizen.role.replace('_', ' ')}
                                            </span>
                                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col text-xs space-y-1">
                                            <span className="text-primary font-bold flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-accent" />
                                                Joined {format(new Date(citizen.createdAt), 'MMM d, yyyy')}
                                            </span>
                                            <span className="text-muted-foreground font-light italic">
                                                Member for {Math.floor((new Date().getTime() - new Date(citizen.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            {citizen.role !== 'SUPER_ADMIN' && (
                                                <>
                                                    <form action={updateRole.bind(null, citizen.id, citizen.role === 'PROPERTY_MANAGER' ? 'USER' : 'PROPERTY_MANAGER')}>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-10 rounded-xl px-4 text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all gap-2"
                                                        >
                                                            {citizen.role === 'PROPERTY_MANAGER' ? 'Demote to Guest' : 'Promote to Manager'}
                                                        </Button>
                                                    </form>
                                                </>
                                            )}
                                            <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground hover:text-primary">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
