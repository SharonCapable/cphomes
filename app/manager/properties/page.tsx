import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Home } from 'lucide-react'
import Link from 'next/link'
import ManagerPropertyCard from '@/components/manager-property-card'
import { serializePrisma } from '@/lib/utils'

export default async function ManagerPropertiesPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  const managerId = user?.id
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'super_admin'

  const properties = await prisma.property.findMany({
    where: isAdmin ? {} : { managerId },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1
      },
      _count: {
        select: { bookings: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold heading-serif text-primary">Managed Listings</h1>
          <p className="text-muted-foreground mt-2 font-light">Oversee your collection of premium residencies.</p>
        </div>
        <Link href="/manager/properties/new">
          <Button className="rounded-2xl h-14 px-8 bg-primary hover:bg-primary/95 text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 flex items-center gap-3">
            <PlusCircle className="w-5 h-5" />
            Add New Listing
          </Button>
        </Link>
      </div>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <ManagerPropertyCard key={property.id} property={serializePrisma(property)} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-6 bg-white rounded-[3rem] border border-dashed border-primary/10">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto text-primary/30">
            <Home className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold heading-serif italic">No Listings Found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto font-light leading-relaxed">
            Start building your legacy by adding your first premium property to the Circle Point collection.
          </p>
          <Link href="/manager/properties/new" className="inline-block">
            <Button className="rounded-2xl h-14 px-8 bg-accent text-white font-bold uppercase tracking-widest text-xs">Begin Your Portfolio</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
