'use client'

import { SessionProvider, useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react'
import { ReactNode } from 'react'

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

// Bridging hook for legacy usage
export function useAuth() {
  const { data: session, status } = useSession()

  const user = session?.user ? {
    id: (session.user as any).id,
    email: session.user.email,
    full_name: session.user.name,
    role: (session.user as any).role,
    phone: (session.user as any).phone,
  } : null

  return {
    user,
    loading: status === 'loading',
    login: async (email: string, password: string) => {
      const result = await nextAuthSignIn('credentials', {
        email,
        password,
        redirect: false
      })
      if (result?.error) {
        return { success: false, message: result.error }
      }
      return { success: true, message: 'Login successful' }
    },
    logout: async () => {
      await nextAuthSignOut({ redirect: false })
      window.location.href = '/'
    },
    refreshUser: async () => {
      // In NextAuth, useSession handle updates automatically or we can call update()
    }
  }
}
