'use client'

import { submitApplication } from '@/lib/actions/applications'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, User, Briefcase, Mail, Send, ArrowRight, ShieldCheck, Clock, Check, PhoneCall, Loader2, Lock } from 'lucide-react'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import Image from 'next/image'
import { cn } from '@/lib/utils'

import { useAuth } from '@/lib/auth-context'

export default function ListPropertyPage() {
  const { user, loading: authLoading } = useAuth()
  const [formStep, setFormStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    countryCode: '+233',
    managedCount: '',
    experienceYears: '',
    description: '',
  })

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user && !submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-secondary/20 relative overflow-hidden">
        {/* Background Decor mirrors Login/Signup */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

        <main className="flex-1 flex items-center justify-center p-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            <div className="mb-8 text-center">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Sanctuary
              </Link>
            </div>

            <Card className="p-12 border-none shadow-2xl bg-white rounded-[3rem] text-center space-y-8">
              <div className="w-20 h-20 bg-accent/10 rounded-[2rem] flex items-center justify-center mx-auto">
                <Lock className="w-10 h-10 text-accent" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold heading-serif leading-tight">Identity Verification Required</h1>
                <p className="text-lg text-muted-foreground font-light max-w-md mx-auto leading-relaxed">
                  To participate in our elite curator network, you must first establish your identity as a verified resident.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={() => window.location.href = `/login?callbackUrl=${encodeURIComponent('/list-property')}`}
                  className="h-16 px-10 rounded-2xl bg-primary text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
                >
                  Enter Sanctuary
                </Button>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    className="h-16 px-10 rounded-2xl border-border font-bold uppercase tracking-widest text-xs w-full sm:w-auto"
                  >
                    Register Identity
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formStep < 3) {
      setFormStep(formStep + 1)
      window.scrollTo(0, 0)
    } else {
      setLoading(true)
      try {
        const result = await submitApplication({
          phone: `${formData.countryCode} ${formData.contactPhone}`,
          yearsExperience: formData.experienceYears,
          propertyCount: formData.managedCount,
          description: formData.description,
          // Note: contactName and contactEmail are ignored for now as they should come from the user session, 
          // but we could use them if we wanted to support guest context (though schema requires userId)
        })

        if (result.success) {
          setSubmitted(true)
          toast.success("Application transmitted successfully.")
        } else {
          toast.error(result.error || "An error occurred during transmission.")
        }
      } catch (error) {
        toast.error("An error occurred during transmission.")
      } finally {
        setLoading(false)
      }
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFCFB]">
        <Navigation />
        <main className="flex-1 flex items-center justify-center p-6 pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl text-center space-y-8"
          >
            <div className="relative w-32 h-32 mx-auto mb-12">
              <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
              <div className="relative w-full h-full bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/30">
                <ShieldCheck className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-bold heading-serif italic">Application Under Curation</h1>
              <p className="text-lg text-muted-foreground font-light max-w-lg mx-auto leading-relaxed">
                Your credentials have been securely transmitted to our executive review committee. We prioritize excellence and will contact you within 24 standard hours.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-8">
              <Button onClick={() => window.location.href = '/'} className="h-14 rounded-2xl bg-primary text-white font-bold uppercase tracking-widest text-xs">
                Return to Sanctuary
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/properties'} className="h-14 rounded-2xl border-border font-bold uppercase tracking-widest text-xs">
                Browse Collections
              </Button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFB]">
      <Navigation />

      <main className="flex-1 pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left Content Section */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold tracking-[0.3em] uppercase">
                  Become a Curator
                </span>
                <h1 className="text-5xl sm:text-7xl font-bold heading-serif leading-[1.1]">
                  Expand Your <br />
                  <span className="italic text-accent">Real Estate Empire.</span>
                </h1>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  Circle Point is more than a platform; it's a gatekeeper to Ghana's most prestigious homes. Join our elite curator network to reach discerning residents.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: ShieldCheck, title: "Curated Network", desc: "Join an elite collection of property managers." },
                  { icon: Clock, title: "24-Hour Appraisal", desc: "Rapid review of your professional credentials." },
                  { icon: Send, title: "Seamless Integration", desc: "Instant access to listing tools upon approval." }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex gap-6 items-start group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-primary/5 flex flex-shrink-0 items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground font-light">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Form Section */}
            <div className="lg:col-span-7">
              <Card className="p-8 sm:p-12 border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] bg-white rounded-[3rem] relative overflow-hidden">
                {/* Step Progress */}
                <div className="flex justify-between items-center mb-12 relative z-10">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500",
                        step === formStep ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" :
                          step < formStep ? "bg-green-500 text-white" : "bg-secondary text-muted-foreground"
                      )}>
                        {step < formStep ? <Check className="w-5 h-5" /> : step}
                      </div>
                      <span className={cn(
                        "hidden sm:block text-[10px] uppercase tracking-[0.2em] font-bold transition-colors",
                        step === formStep ? "text-primary" : "text-muted-foreground"
                      )}>
                        {step === 1 ? 'Identity' : step === 2 ? 'Experience' : 'Confirmation'}
                      </span>
                      {step < 3 && <div className="hidden sm:block w-8 h-px bg-border mx-2" />}
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.form
                    key={formStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleSubmit}
                    className="space-y-8 relative z-10"
                  >
                    {formStep === 1 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Full Legal Name</label>
                          <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                            <input
                              type="text"
                              name="contactName"
                              value={formData.contactName}
                              onChange={handleInputChange}
                              placeholder="Mr/Ms. Full Name"
                              className="w-full pl-14 pr-6 py-5 bg-secondary/30 rounded-2xl border-none outline-none focus:ring-1 focus:ring-primary font-medium"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Executive Email</label>
                          <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                            <input
                              type="email"
                              name="contactEmail"
                              value={formData.contactEmail}
                              onChange={handleInputChange}
                              placeholder="professional@firm.com"
                              className="w-full pl-14 pr-6 py-5 bg-secondary/30 rounded-2xl border-none outline-none focus:ring-1 focus:ring-primary font-medium"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Direct Contact Number</label>
                          <div className="flex gap-2">
                            <select
                              name="countryCode"
                              value={formData.countryCode}
                              onChange={handleInputChange}
                              className="w-24 px-4 py-5 bg-secondary/30 rounded-2xl border-none outline-none focus:ring-1 focus:ring-primary font-bold text-sm appearance-none"
                            >
                              <option value="+233">+233 (GH)</option>
                              <option value="+234">+234 (NG)</option>
                              <option value="+1">+1 (US)</option>
                              <option value="+44">+44 (UK)</option>
                            </select>
                            <div className="relative flex-1">
                              <PhoneCall className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                              <input
                                type="tel"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleInputChange}
                                placeholder="000 000 0000"
                                className="w-full pl-14 pr-6 py-5 bg-secondary/30 rounded-2xl border-none outline-none focus:ring-1 focus:ring-primary font-medium"
                                required
                              />
                            </div>
                          </div>
                          <p className="text-[9px] text-muted-foreground ml-4 italic">Our admissions team may call to verify your credentials.</p>
                        </div>
                        <Button type="submit" className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/95 text-white font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                          Next Portfolio Step <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {formStep === 2 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Portfolio Volume</label>
                          <select
                            name="managedCount"
                            value={formData.managedCount}
                            onChange={handleInputChange}
                            className="w-full px-6 py-5 bg-secondary/30 rounded-2xl border-none outline-none focus:ring-1 focus:ring-primary font-bold appearance-none cursor-pointer"
                            required
                          >
                            <option value="">Select Managed Count...</option>
                            <option value="1">1 Premier Property</option>
                            <option value="2-5">2 - 5 Collections</option>
                            <option value="5+">5+ Luxury Estates</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Professional Experience</label>
                          <select
                            name="experienceYears"
                            value={formData.experienceYears}
                            onChange={handleInputChange}
                            className="w-full px-6 py-5 bg-secondary/30 rounded-2xl border-none outline-none focus:ring-1 focus:ring-primary font-bold appearance-none cursor-pointer"
                            required
                          >
                            <option value="">Select Tenure...</option>
                            <option value="1-3">1 - 3 Dedicated Years</option>
                            <option value="3-7">3 - 7 Proven Years</option>
                            <option value="7+">7+ Expert Years</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Portfolio Description</label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Describe the architectural uniqueness and service standards of your managed properties..."
                            className="w-full px-6 py-5 bg-secondary/30 rounded-2xl border-none outline-none focus:ring-1 focus:ring-primary font-medium resize-none"
                            required
                          />
                        </div>
                        <div className="flex gap-4">
                          <Button type="button" variant="ghost" onClick={() => setFormStep(1)} className="h-16 rounded-2xl px-8 font-bold text-xs uppercase tracking-widest">Back</Button>
                          <Button type="submit" className="flex-1 h-16 rounded-2xl bg-primary hover:bg-primary/95 text-white font-bold uppercase tracking-widest text-xs">Final Review</Button>
                        </div>
                      </div>
                    )}

                    {formStep === 3 && (
                      <div className="space-y-8">
                        <div className="p-8 bg-accent/5 rounded-[2rem] border border-accent/10 space-y-6">
                          <h4 className="font-bold heading-serif text-xl italic text-primary">Credential Summary</h4>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-primary/5">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Expert</span>
                              <span className="text-sm font-bold">{formData.contactName}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-primary/5">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Tenure</span>
                              <span className="text-sm font-bold">{formData.experienceYears} Years</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Direct Link</span>
                              <span className="text-sm font-bold">{formData.contactEmail}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground italic font-light px-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          By transmitting, you verify the architectural integrity of your portfolio.
                        </div>

                        <div className="flex gap-4">
                          <Button type="button" variant="ghost" onClick={() => setFormStep(2)} className="h-16 rounded-2xl px-8 font-bold text-xs uppercase tracking-widest">Edit</Button>
                          <Button type="submit" disabled={loading} className="flex-1 h-16 rounded-2xl bg-accent hover:bg-accent/95 text-white font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-accent/20 transition-all active:scale-95">
                            {loading ? 'Transmitting Credentials...' : 'Certify & Submit Application'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.form>
                </AnimatePresence>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
