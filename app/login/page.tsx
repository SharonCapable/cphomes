'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Lock, Mail, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid credentials. Please try again.')
      } else {
        toast.success('Welcome back!')
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      toast.error('An unexpected error occurred.')
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
        className="w-full max-w-md relative z-10"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary mb-8 group transition-colors">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Sanctuary
        </Link>

        <Card className="p-10 border-none shadow-2xl bg-white rounded-[3rem]">
          <div className="text-center mb-10">
            <div className="inline-flex w-16 h-16 rounded-[1.5rem] bg-primary items-center justify-center shadow-xl shadow-primary/20 mb-6">
              <Image src="/logo.png.png" alt="Logo" width={32} height={32} className="brightness-0 invert" />
            </div>
            <h1 className="text-4xl font-bold heading-serif">Welcome Back</h1>
            <p className="text-muted-foreground mt-3 font-light text-balance text-sm uppercase tracking-widest">Access your premium resident portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest font-bold ml-1 text-muted-foreground">Professional Email</Label>
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

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest font-bold ml-1 text-muted-foreground">Digital Signature</Label>
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
              <div className="text-right">
                <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-accent/80 transition-colors">
                  Forgotten Key?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/95 text-white font-bold uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Enter Sanctuary'
              )}
            </Button>

            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground font-light">
                New to Circle Point? {' '}
                <Link href="/signup" className="text-primary font-bold hover:underline">
                  Apply for Residency
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
