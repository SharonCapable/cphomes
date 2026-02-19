'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, User, LogOut, Home, Compass, PhoneCall, PlusCircle, Shield } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  const navLinks = [
    { name: 'View Listings', href: '/properties', icon: Compass },
    { name: 'Speak to a Consultant', href: '/concierge', icon: PhoneCall },
  ]

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 px-4 sm:px-6 lg:px-8",
        scrolled
          ? "bg-white/98 backdrop-blur-md border-b border-border shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] py-3"
          : "bg-white border-b border-border/50 py-4"
      )}
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-primary/20">
              <Image
                src="/logo.png.png"
                alt="CPH"
                width={32}
                height={32}
                className="object-contain brightness-0 invert"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight leading-none text-foreground heading-serif">Circle Point</span>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">Residences</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
                </Link>
              ))}
            </div>

            <div className="h-6 w-px bg-border mx-2" />

            <div className="flex items-center gap-4">
              <Link href="/list-property">
                <Button variant="ghost" size="sm" className="font-bold text-xs uppercase tracking-widest hover:bg-primary/5">
                  <PlusCircle className="w-4 h-4 mr-2 text-accent" />
                  Become a Curator
                </Button>
              </Link>

              {user ? (
                <div className="flex items-center gap-4">
                  {(user.role === 'SUPER_ADMIN' || user.role === 'super_admin') && (
                    <Link href="/admin">
                      <Button size="sm" variant="outline" className="rounded-full px-5 border-primary/20 hover:bg-primary/5 text-[10px] font-bold uppercase tracking-widest">Admin Hub</Button>
                    </Link>
                  )}
                  {(user.role === 'PROPERTY_MANAGER' || user.role === 'manager') && (
                    <Link href="/manager">
                      <Button size="sm" variant="outline" className="rounded-full px-5 border-primary/20 hover:bg-primary/5 text-[10px] font-bold uppercase tracking-widest">Manager Hub</Button>
                    </Link>
                  )}

                  <div className="flex items-center gap-2 pl-2 border-l border-border">
                    {/* Hide Profile for special roles as requested, or keep it for regular users */}
                    {!(user.role === 'SUPER_ADMIN' || user.role === 'super_admin' || user.role === 'PROPERTY_MANAGER' || user.role === 'manager') && (
                      <Link href="/profile" className="flex items-center gap-2 group cursor-pointer mr-2">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center transition-all group-hover:bg-accent group-hover:text-white">
                          <User className="w-4 h-4 text-accent group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground group-hover:text-primary transition-colors">Profile</span>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-[10px] uppercase tracking-widest font-bold text-red-500/70 hover:text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <Link href="/login">
                  <Button size="sm" className="rounded-full px-6 bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-[10px]">
                    Resident Login
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors hover:bg-primary/10"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 md:hidden"
          >
            <div className="bg-white rounded-[2rem] shadow-2xl border border-border p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-primary/5 transition-colors font-bold text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="w-5 h-5 text-accent" />
                  {link.name}
                </Link>
              ))}
              <Link href="/list-property" onClick={() => setIsOpen(false)}>
                <Button className="w-full justify-start gap-4 rounded-2xl py-6 border-primary/10" variant="outline">
                  <PlusCircle className="w-5 h-5 text-accent" />
                  Become a Curator
                </Button>
              </Link>

              <div className="pt-4 border-t border-border">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-4 mb-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{user.full_name}</p>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-bold uppercase tracking-widest">{user.role}</span>
                    </div>

                    {(user.role === 'SUPER_ADMIN' || user.role === 'super_admin') && (
                      <Link href="/admin" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start gap-4 rounded-2xl py-6 hover:bg-primary/5" variant="ghost">
                          <Shield className="w-5 h-5 text-accent" />
                          Admin Hub
                        </Button>
                      </Link>
                    )}

                    {(user.role === 'PROPERTY_MANAGER' || user.role === 'manager') && (
                      <Link href="/manager" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start gap-4 rounded-2xl py-6 hover:bg-primary/5" variant="ghost">
                          <Home className="w-5 h-5 text-accent" />
                          Manager Hub
                        </Button>
                      </Link>
                    )}

                    {!(user.role === 'SUPER_ADMIN' || user.role === 'super_admin' || user.role === 'PROPERTY_MANAGER' || user.role === 'manager') && (
                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start gap-4 rounded-2xl py-6 hover:bg-primary/5" variant="ghost">
                          <User className="w-5 h-5 text-accent" />
                          My Profile
                        </Button>
                      </Link>
                    )}

                    <Button className="w-full justify-start gap-4 rounded-2xl py-6 text-red-500 hover:bg-red-50" variant="ghost" onClick={handleLogout}>
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-2xl py-6 bg-primary text-white">
                      <User className="w-5 h-5 mr-3" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
