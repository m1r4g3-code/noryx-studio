'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { loginSchema, type LoginFormValues } from '@/lib/validations'
import { createClient } from '@/lib/supabase'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function AdminLoginPage() {
  const router = useRouter()
  const [authError, setAuthError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError('')
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setAuthError('Invalid email or password.')
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-baseline gap-1 group">
            <span className="font-display text-3xl tracking-[0.15em] text-text-primary group-hover:text-gold transition-colors">
              NORYX
            </span>
            <span className="font-display text-base tracking-[0.2em] text-gold">STUDIO</span>
          </Link>
          <p className="text-[11px] text-text-muted tracking-[0.2em] uppercase font-body mt-2">
            Admin Portal
          </p>
        </div>

        <div className="bg-surface border border-border rounded-sm p-8">
          <h1 className="font-display text-2xl tracking-widest text-text-primary mb-6">
            SIGN IN
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="admin@example.com"
              required
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              error={errors.password?.message}
              {...register('password')}
            />

            {authError && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-sm px-3 py-2">
                <p className="text-red-400 text-sm font-body">{authError}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-[11px] text-text-muted font-body mt-6">
          <Link href="/" className="hover:text-gold transition-colors">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  )
}
