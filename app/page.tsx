import { ArrowRight, CheckCircle2, Clock, Lock } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import Hero from '@/components/hero'
import PropertyCard from '@/components/property-card'
import { getFeaturedProperties } from '@/lib/actions/properties'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import { serializePrisma } from '@/lib/utils'

const benefits = [
  {
    icon: CheckCircle2,
    title: 'Curated Excellence',
    description: 'Every property in our portfolio meets rigorous quality standards for your peace of mind.',
  },
  {
    icon: Clock,
    title: 'Consultant Support',
    description: "Our dedicated team is available 24/7 to ensure your stay is absolutely seamless.",
  },
  {
    icon: Lock,
    title: 'Secure Haven',
    description: 'Bank-grade security for all transactions and verified host protocols.',
  },
]

export default async function Home() {
  const featuredProperties = await getFeaturedProperties(6)

  // Fetch latest property by a Super Admin for the Hero, otherwise any available property
  let heroPropertyRaw = await prisma.property.findFirst({
    where: {
      manager: {
        role: 'SUPER_ADMIN'
      },
      status: 'AVAILABLE'
    },
    include: {
      images: {
        orderBy: {
          displayOrder: 'asc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  if (!heroPropertyRaw) {
    heroPropertyRaw = await prisma.property.findFirst({
      where: {
        status: 'AVAILABLE'
      },
      include: {
        images: {
          orderBy: {
            displayOrder: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  const heroProperty = heroPropertyRaw ? serializePrisma(heroPropertyRaw) : null

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-accent/30">
      <Navigation />

      <main>
        <Hero heroProperty={heroProperty} />

        {/* Categories / Quick Filters */}
        <section className="py-12 bg-secondary/30 border-y border-primary/5">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-between items-center gap-8">
              {['Villas', 'Penthouses', 'Apartments', 'Studio Lofts', 'Beach Homes'].map((cat) => (
                <button key={cat} className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors hover:scale-105">
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Properties Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
              <div>
                <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Our Portfolio</span>
                <h2 className="text-4xl sm:text-6xl font-bold text-foreground heading-serif italic">Signature Residences</h2>
              </div>
              <Link href="/properties">
                <Button variant="link" className="text-primary font-bold gap-2 group p-0 text-lg hover:no-underline">
                  Browse All Listings
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {featuredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {featuredProperties.map((property, idx) => (
                  <PropertyCard key={property.id} property={property} index={idx} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-primary/5 rounded-[3rem] border border-dashed border-primary/20">
                <p className="text-muted-foreground text-xl font-light italic">Curating exceptional listings for you...</p>
                <div className="mt-6">
                  <Link href="/properties">
                    <Button variant="outline" className="rounded-full px-8">View All Properties</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground rounded-[4rem] mx-4 mb-32 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="max-w-screen-2xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-12 mb-16">
              <div className="max-w-2xl space-y-4 text-center lg:text-left">
                <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs">Standard of Excellence</span>
                <h2 className="text-4xl sm:text-5xl font-bold heading-serif text-balance">Why Circle Point?</h2>
                <p className="text-primary-foreground/70 text-lg font-light">
                  We bridge the gap between discerning clients and extraordinary properties in West Africa.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link href="/list-property">
                  <Button className="bg-accent text-white hover:bg-accent/90 rounded-2xl h-14 px-10 font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-accent/20">
                    Become a Curator
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-16">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="space-y-4 text-center md:text-left">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 mx-auto md:mx-0">
                      <Icon className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold heading-serif">{benefit.title}</h3>
                    <p className="text-primary-foreground/60 leading-relaxed font-light text-sm">{benefit.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
