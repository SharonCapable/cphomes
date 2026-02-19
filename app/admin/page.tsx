import { Card } from '@/components/ui/card'
import {
  Shield,
  Users,
  Home,
  Calendar,
  DollarSign,
  BarChart3,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import BookingRow from '@/components/booking-row'

import { serializePrisma } from '@/lib/utils'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  // Verify Super Admin status
  if (!session || ((session.user as any).role !== 'SUPER_ADMIN' && (session.user as any).role !== 'super_admin')) {
    redirect('/manager') // Fallback if not admin
  }

  // System-wide Aggregations
  const stats = [
    { label: 'Total Listings', value: await prisma.property.count(), icon: Home, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Curators', value: await prisma.user.count({ where: { role: 'PROPERTY_MANAGER' } }), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Residents', value: await prisma.user.count({ where: { role: 'USER' } }), icon: Shield, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'System Booking', value: await prisma.booking.count(), icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  const globalRecentBookings = await prisma.booking.findMany({
    include: {
      property: { select: { title: true } },
      user: { select: { fullName: true, email: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  })

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-bold heading-serif text-primary">Administrative Oversight</h1>
          <p className="text-muted-foreground mt-2 font-light text-lg">Omniscient view of the Circle Point ecosystem.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/logs">
            <Button variant="outline" className="rounded-2xl h-14 px-8 border-primary/10 font-bold uppercase tracking-widest text-[10px]">
              Audit Logs
            </Button>
          </Link>
          <Link href="/manager/properties">
            <Button variant="outline" className="rounded-2xl h-14 px-8 border-primary/10 font-bold uppercase tracking-widest text-[10px]">
              Global Listings
            </Button>
          </Link>
          <Link href="/admin/applications">
            <Button variant="outline" className="rounded-2xl h-14 px-8 border-primary/10 font-bold uppercase tracking-widest text-[10px] relative">
              Curator Applications
              {await prisma.propertyManagerApplication.count({ where: { status: 'PENDING' } }) > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-[8px] flex items-center justify-center text-white animate-pulse">
                  {await prisma.propertyManagerApplication.count({ where: { status: 'PENDING' } })}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="outline" className="rounded-2xl h-14 px-8 border-primary/10 font-bold uppercase tracking-widest text-[10px]">
              Citizen Management
            </Button>
          </Link>
          <Link href="/manager/properties/new">
            <Button className="rounded-2xl h-14 px-8 bg-accent text-white font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-accent/20">
              Add Listing
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-8 border-none shadow-xl bg-white rounded-[2.5rem] group hover:scale-[1.02] transition-all">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <h3 className="text-4xl font-bold tracking-tight text-primary">{stat.value}</h3>
            <p className="text-sm text-muted-foreground mt-2 font-bold uppercase tracking-widest">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <Card className="lg:col-span-8 p-10 border-none shadow-2xl bg-white rounded-[3rem]">
          <h3 className="text-2xl font-bold heading-serif mb-10 flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-accent" />
            Global Booking Activity
          </h3>
          <div className="space-y-6">
            {globalRecentBookings.map((booking) => (
              <BookingRow key={booking.id} booking={serializePrisma(booking)} />
            ))}
          </div>
        </Card>

        <div className="lg:col-span-4 space-y-8">
          <Card className="p-10 border-none shadow-xl bg-primary text-primary-foreground rounded-[3rem]">
            <h4 className="text-2xl font-bold heading-serif italic mb-4">Advisory</h4>
            <p className="text-sm font-light opacity-80 leading-relaxed mb-8">
              As a Super Admin, you have authority over all estate curators and resident transactions. Ensure system integrity through regular audits.
            </p>
            <Button className="w-full h-14 rounded-2xl bg-white text-primary font-bold uppercase tracking-widest text-[10px] gap-2">
              Manage Curators <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>

          <Card className="p-10 border-none shadow-xl bg-secondary rounded-[3rem]">
            <h4 className="text-xl font-bold heading-serif mb-6">System Health</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-medium">
                <span>Database Sync</span>
                <span className="text-green-600 font-bold">Optimal</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span>API Response</span>
                <span className="text-green-600 font-bold">120ms</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
