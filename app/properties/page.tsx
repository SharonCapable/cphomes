import { Suspense } from 'react'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import PropertyCard from '@/components/property-card'
import ListingFilters from '@/components/listing-filters'
import { searchProperties } from '@/lib/actions/properties'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { PropertyType } from '@prisma/client'
import { MapPin, Info } from 'lucide-react'

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  const location = typeof params.location === 'string' ? params.location : undefined
  const type = (typeof params.type === 'string' && params.type !== 'all' ? params.type : undefined) as PropertyType | undefined
  const bedrooms = typeof params.bedrooms === 'string' && params.bedrooms !== 'all' ? params.bedrooms : undefined
  const minPrice = typeof params.minPrice === 'string' ? parseInt(params.minPrice) : undefined
  const maxPrice = typeof params.maxPrice === 'string' ? parseInt(params.maxPrice) : undefined
  const amenities = typeof params.amenities === 'string' ? params.amenities.split(',') : undefined

  const properties = await searchProperties({
    location,
    type,
    bedrooms,
    minPrice,
    maxPrice,
    amenities
  })

  // Check favorites if logged in
  const session = await getServerSession(authOptions)
  let favoritedIds: Set<string> = new Set()

  if (session?.user) {
    const favorites = await prisma.favorite.findMany({
      where: { userId: (session.user as any).id },
      select: { propertyId: true }
    })
    favoritedIds = new Set(favorites.map(f => f.propertyId))
  }

  const propertiesWithFavorites = properties.map(p => ({
    ...p,
    isFavorited: favoritedIds.has(p.id)
  }))

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFB] selection:bg-accent/30">
      <Navigation />

      <main className="flex-1 pt-20 pb-24">
        {/* Header Section */}
        <section className="mb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3 text-accent font-bold text-xs uppercase tracking-[0.3em]">
              <span className="w-12 h-px bg-accent/30" />
              Curated Collections
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold heading-serif leading-tight">
              Discover Your <br />
              <span className="italic text-accent">Signature Stay.</span>
            </h1>
            <p className="text-lg text-muted-foreground font-light max-w-2xl leading-relaxed">
              Explore our hand-picked portfolio of properties, each offering a unique blend of architectural elegance and sanctuary-level comfort.
            </p>
          </div>
        </section>

        {/* Dynamic Filters */}
        <ListingFilters />

        {/* Results Section */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Showing {properties.length} {properties.length === 1 ? 'Masterpiece' : 'Masterpieces'}
              </div>

              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                <div className="flex items-center gap-2 px-4 py-2 bg-accent/5 rounded-full">
                  <MapPin className="w-3 h-3" />
                  {location || 'Global View'}
                </div>
                {type && (
                  <div className="px-4 py-2 bg-accent/5 rounded-full">
                    {type}
                  </div>
                )}
              </div>
            </div>

            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <Suspense fallback={
                  <div className="col-span-full py-20 text-center animate-pulse">
                    <p className="heading-serif text-2xl italic">Elegance is loading...</p>
                  </div>
                }>
                  {propertiesWithFavorites.map((property: any, idx: number) => (
                    <PropertyCard key={property.id} property={property} index={idx} />
                  ))}
                </Suspense>
              </div>
            ) : (
              <div className="py-32 px-12 text-center bg-white rounded-[3rem] border border-dashed border-primary/10 shadow-sm max-w-4xl mx-auto">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8">
                  <Info className="w-8 h-8 text-primary/40" />
                </div>
                <h3 className="text-3xl font-bold heading-serif mb-4">No Matches in Our Current Collection</h3>
                <p className="text-muted-foreground font-light text-lg mb-10 max-w-lg mx-auto">
                  While we couldn't find exactly what you were looking for, our portfolio is constantly expanding with new architectural gems.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/properties" className="px-8 py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                    View All Collections
                  </a>
                  <a href="/contact" className="px-8 py-4 border border-border rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-secondary/50 transition-colors">
                    Consult Concierge
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
