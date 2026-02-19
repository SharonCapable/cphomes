import { notFound } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import PropertyGallery from '@/components/property-gallery'
import ReviewSection from '@/components/review-section'
import { serializePrisma } from '@/lib/utils'
import BookingSection from '@/components/booking-section'
import { getPropertyById, getPropertyBySlug } from '@/lib/actions/properties'
import { MapPin, Bed, Bath, Square, Share2, ShieldCheck, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FavoriteButton from '@/components/favorite-button'
import ConciergeChatButton from '@/components/concierge-chat-button'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Try finding by ID first, then slug
  let property = await prisma.property.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      manager: { select: { id: true, fullName: true, avatarUrl: true } },
      images: true,
      reviews: {
        include: {
          user: { select: { fullName: true, avatarUrl: true } }
        },
        orderBy: { createdAt: 'desc' }
      },
      _count: { select: { favorites: true, reviews: true } }
    }
  })

  if (!property) {
    notFound()
  }

  const session = await getServerSession(authOptions)
  let isFavorited = false
  if (session?.user) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: (session.user as any).id,
          propertyId: property.id
        }
      }
    })
    isFavorited = !!favorite
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFB]">
      <Navigation />

      <main className="flex-1 pt-20 pb-24">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Layout */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-[0.3em]">
                <span className="px-3 py-1 bg-accent/10 rounded-md">Premier Collection</span>
                <span className="w-8 h-px bg-accent/30" />
                {property.type}
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold heading-serif leading-[1.1]">
                {property.title}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5 opacity-80">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>{property.address}, {property.city}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              <Button variant="outline" className="flex-1 lg:flex-none h-14 rounded-2xl gap-2 border-border font-bold uppercase tracking-widest text-[10px]">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <FavoriteButton
                propertyId={property.id}
                initialIsFavorited={isFavorited}
                className="lg:h-14 lg:w-14"
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Content Col */}
            <div className="lg:col-span-8 space-y-16">
              {/* Image Gallery */}
              <PropertyGallery images={property.images.map((img: any) => ({ url: img.url, caption: img.caption }))} />

              {/* Property Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-10 bg-white rounded-[2.5rem] shadow-sm border border-primary/5">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold italic">Dimensions</p>
                  <div className="flex items-center gap-3 text-primary">
                    <Square className="w-5 h-5 text-accent" />
                    <span className="text-xl font-bold">{property.squareFeet || '---'} <span className="text-xs">sqft</span></span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold italic">Bedrooms</p>
                  <div className="flex items-center gap-3 text-primary">
                    <Bed className="w-5 h-5 text-accent" />
                    <span className="text-xl font-bold">{property.bedrooms} <span className="text-xs">Units</span></span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold italic">Bathrooms</p>
                  <div className="flex items-center gap-3 text-primary">
                    <Bath className="w-5 h-5 text-accent" />
                    <span className="text-xl font-bold">{property.bathrooms} <span className="text-xs">Baths</span></span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold italic">Verification</p>
                  <div className="flex items-center gap-3 text-green-600">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xl font-bold text-sm">Certified</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <article className="space-y-8">
                <h3 className="text-3xl font-bold heading-serif relative inline-block">
                  About the Residency
                  <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full" />
                </h3>
                <div className="prose prose-lg max-w-none text-muted-foreground font-light leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </div>
              </article>

              {/* Amenities */}
              <div className="space-y-10">
                <h3 className="text-3xl font-bold heading-serif uppercase tracking-wider">Features & Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  {property.amenities.length > 0 ? property.amenities.map((amenity: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                        <Check className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-medium text-foreground">{amenity}</span>
                    </div>
                  )) : (
                    <p className="text-muted-foreground italic font-light">Custom features curated upon request.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Booking Col */}
            <div className="lg:col-span-4 lg:relative">
              <BookingSection
                price={Number(property.pricePerMonth)}
                id={property.id}
                title={property.title}
              />

              <div className="mt-12 p-8 rounded-[2rem] bg-secondary/50 border border-primary/5 space-y-6">
                <h4 className="font-bold heading-serif text-xl italic text-primary">Concierge Access</h4>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  Our private estate managers are available 24/7 to facilitate your transition to {property.city}.
                </p>
                <ConciergeChatButton
                  managerId={property.managerId}
                  propertyId={property.id}
                  managerName={property.manager?.fullName}
                />
              </div>
            </div>
          </div>

          <div className="mt-24 pt-24 border-t border-primary/5">
            <ReviewSection
              propertyId={property.id}
              initialReviews={serializePrisma(property.reviews)}
              isLoggedIn={!!session?.user}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
