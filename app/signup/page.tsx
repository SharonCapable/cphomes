'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signup } from '@/lib/actions/auth'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import Image from 'next/image'
import { ArrowLeft, User, Mail, Lock, Phone, Loader2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const result = await signup({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone,
      })

      if (result.success) {
        toast.success("Residency established successfully.")
        router.push('/')
        router.refresh()
      } else {
        toast.error(result.message || 'Signup failed. Please try again.')
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl relative z-10 my-8"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary mb-8 group transition-colors">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Sanctuary
        </Link>

        <Card className="p-10 border-none shadow-2xl bg-white rounded-[3rem]">
          <div className="text-center mb-10">
            <div className="inline-flex w-16 h-16 rounded-[1.5rem] bg-accent items-center justify-center shadow-xl shadow-accent/20 mb-6">
              <Image src="/logo.png.png" alt="Logo" width={32} height={32} className="brightness-0 invert" />
            </div>
            <h1 className="text-4xl font-bold heading-serif">Apply for Residency</h1>
            <p className="text-muted-foreground mt-3 font-light text-balance text-sm uppercase tracking-widest">Join the Circle Point community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest font-bold ml-1 text-muted-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    className="pl-11 h-14 rounded-2xl bg-secondary/30 border-none outline-none focus-visible:ring-primary focus-visible:ring-1"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest font-bold ml-1 text-muted-foreground">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+233..."
                    className="pl-11 h-14 rounded-2xl bg-secondary/30 border-none outline-none focus-visible:ring-primary focus-visible:ring-1"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest font-bold ml-1 text-muted-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="name@company.com"
                  className="pl-11 h-14 rounded-2xl bg-secondary/30 border-none outline-none focus-visible:ring-primary focus-visible:ring-1"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest font-bold ml-1 text-muted-foreground">Key Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-11 h-14 rounded-2xl bg-secondary/30 border-none outline-none focus-visible:ring-primary focus-visible:ring-1"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest font-bold ml-1 text-muted-foreground">Confirm Key</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-11 h-14 rounded-2xl bg-secondary/30 border-none outline-none focus-visible:ring-primary focus-visible:ring-1"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/95 text-white font-bold uppercase tracking-widest shadow-xl shadow-accent/20 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Establishing Residency...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground font-light">
                Already part of the Circle? {' '}
                <Link href="/login" className="text-primary font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
