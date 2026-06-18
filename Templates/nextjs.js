'use strict';

module.exports = function getNextjsFiles(projectName) {
  return {

// ─────────────────────────────────────────────────────────────────────────────
// package.json - Next.js 15 + Auth.js v5 + NO PrismaAdapter (JWT strategy)
// ─────────────────────────────────────────────────────────────────────────────
'package.json': `{
  "name": "${projectName}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "next": "15.3.2",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "next-auth": "5.0.0-beta.25",
    "@prisma/client": "6.8.2",
    "stripe": "17.7.0",
    "tailwindcss": "3.4.17",
    "clsx": "2.1.1",
    "tailwind-merge": "2.6.0",
    "lucide-react": "0.511.0",
    "zod": "3.24.4",
    "sonner": "2.0.3"
  },
  "devDependencies": {
    "typescript": "5.8.3",
    "@types/node": "22.15.21",
    "@types/react": "19.1.4",
    "@types/react-dom": "19.1.3",
    "prisma": "6.8.2",
    "autoprefixer": "10.4.21",
    "postcss": "8.5.3"
  }
}`,

// ─────────────────────────────────────────────────────────────────────────────
// tsconfig.json
// ─────────────────────────────────────────────────────────────────────────────
'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,

// ─────────────────────────────────────────────────────────────────────────────
// next.config.ts
// ─────────────────────────────────────────────────────────────────────────────
'next.config.ts': `import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
}

export default nextConfig`,

// ─────────────────────────────────────────────────────────────────────────────
// postcss.config.mjs
// ─────────────────────────────────────────────────────────────────────────────
'postcss.config.mjs': `const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
export default config`,

// ─────────────────────────────────────────────────────────────────────────────
// tailwind.config.ts
// ─────────────────────────────────────────────────────────────────────────────
'tailwind.config.ts': `import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out both',
      },
    },
  },
  plugins: [],
}
export default config`,

// ─────────────────────────────────────────────────────────────────────────────
// styles/globals.css
// ─────────────────────────────────────────────────────────────────────────────
'styles/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { box-sizing: border-box; }
  body { @apply bg-slate-50 text-slate-900 antialiased; }
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm
           font-medium transition-all duration-150 focus-visible:outline-none
           focus-visible:ring-2 focus-visible:ring-offset-2
           disabled:opacity-50 disabled:pointer-events-none cursor-pointer;
  }
  .btn-primary   { @apply btn bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500 shadow-sm; }
  .btn-secondary { @apply btn border border-slate-200 bg-white hover:bg-slate-50 focus-visible:ring-slate-400 text-slate-700; }
  .btn-ghost     { @apply btn hover:bg-slate-100 focus-visible:ring-slate-400 text-slate-600; }
  .btn-danger    { @apply btn bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500; }

  .input {
    @apply w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
           placeholder:text-slate-400 focus:outline-none focus:ring-2
           focus:ring-brand-500 focus:border-transparent transition-all
           disabled:opacity-50 disabled:cursor-not-allowed;
  }
  .label { @apply block text-sm font-medium text-slate-700 mb-1.5; }

  .card        { @apply rounded-xl border border-slate-200 bg-white shadow-sm; }
  .card-header { @apply px-6 py-4 border-b border-slate-200; }
  .card-body   { @apply px-6 py-5; }

  .badge       { @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium; }
  .badge-green { @apply badge bg-brand-100 text-brand-700; }
  .badge-red   { @apply badge bg-red-100 text-red-700; }
  .badge-gray  { @apply badge bg-slate-100 text-slate-600; }
}`,

// ─────────────────────────────────────────────────────────────────────────────
// auth.ts - JWT strategy (no PrismaAdapter, Edge Runtime safe)
// ─────────────────────────────────────────────────────────────────────────────
'auth.ts': `import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId:     process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id    = user.id
        token.email = user.email
        token.name  = user.name
        token.image = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id    = token.id    as string
        session.user.email = token.email as string
        session.user.name  = token.name  as string
        session.user.image = token.image as string
      }
      return session
    },
  },
})`,

// ─────────────────────────────────────────────────────────────────────────────
// middleware.ts - Edge-safe JWT check (does NOT import lib/db.ts)
// ─────────────────────────────────────────────────────────────────────────────
'middleware.ts': `import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PROTECTED = ['/dashboard', '/settings', '/billing']

export async function middleware(req: NextRequest) {
  const token     = await getToken({ req, secret: process.env.AUTH_SECRET })
  const isAuth    = !!token
  const { pathname } = req.nextUrl

  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  const isAuthPage  = pathname.startsWith('/login') || pathname.startsWith('/register')

  if (isAuthPage && isAuth)
    return NextResponse.redirect(new URL('/dashboard', req.url))

  if (isProtected && !isAuth)
    return NextResponse.redirect(new URL('/login', req.url))

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/billing/:path*', '/login', '/register'],
}`,

// ─────────────────────────────────────────────────────────────────────────────
// lib/db.ts - Prisma singleton (server-side only, never import in middleware)
// ─────────────────────────────────────────────────────────────────────────────
'lib/db.ts': `import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db`,

// ─────────────────────────────────────────────────────────────────────────────
// lib/auth.ts - server-side session helper (Server Components / Route Handlers)
// ─────────────────────────────────────────────────────────────────────────────
'lib/auth.ts': `import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  return session
}

export { auth as getSession }`,

// ─────────────────────────────────────────────────────────────────────────────
// lib/stripe.ts
// ─────────────────────────────────────────────────────────────────────────────
'lib/stripe.ts': `import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})`,

// ─────────────────────────────────────────────────────────────────────────────
// lib/utils.ts
// ─────────────────────────────────────────────────────────────────────────────
'lib/utils.ts': `import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(date))
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100)
}`,

// ─────────────────────────────────────────────────────────────────────────────
// app/layout.tsx - root layout (NO SessionProvider needed with JWT strategy)
// ─────────────────────────────────────────────────────────────────────────────
'app/layout.tsx': `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: '${projectName}',
    template: \`%s | ${projectName}\`,
  },
  description: 'Built with MakeFast AI ⚡',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}`,

// ─────────────────────────────────────────────────────────────────────────────
// app/api/auth/[...nextauth]/route.ts
// ─────────────────────────────────────────────────────────────────────────────
'app/api/auth/[...nextauth]/route.ts': `import { handlers } from '@/auth'
export const { GET, POST } = handlers`,

// ─────────────────────────────────────────────────────────────────────────────
// app/page.tsx - public landing
// ─────────────────────────────────────────────────────────────────────────────
'app/page.tsx': `import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-slate-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-xl">${projectName}</span>
          <div className="flex items-center gap-3">
            <Link href="/login"    className="btn-ghost px-4 py-2 text-sm">Login</Link>
            <Link href="/register" className="btn-primary px-4 py-2 text-sm">Get started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 py-28">
        <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100
                        text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
          ✦ Built with MakeFast AI
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Ship your SaaS <span className="text-brand-600">faster</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          ${projectName} - full-stack SaaS starter with auth, billing, and database ready to go.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register"  className="btn-primary text-base px-8 py-3">Start for free →</Link>
          <Link href="/dashboard" className="btn-secondary text-base px-8 py-3">View dashboard</Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        {[
          { icon: '🔐', title: 'Auth ready',       desc: 'Google OAuth via Auth.js v5. JWT sessions and protected routes - zero config.' },
          { icon: '💳', title: 'Billing built in',  desc: 'Stripe subscriptions and webhooks wired up out of the box.' },
          { icon: '🗄️', title: 'DB + ORM',          desc: 'Prisma + PostgreSQL schema ready. Just push and go.' },
        ].map(f => (
          <div key={f.title} className="card p-6">
            <div className="text-2xl mb-3">{f.icon}</div>
            <h3 className="font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  )
}`,

// ─────────────────────────────────────────────────────────────────────────────
// app/(auth)/login/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
'app/(auth)/login/page.tsx': `'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  async function handleGoogle() {
    setLoading(true)
    await signIn('google', { redirectTo: '/dashboard' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">${projectName}</h1>
          <p className="text-slate-500 mt-1 text-sm">Welcome back</p>
        </div>
        <div className="card">
          <div className="card-body space-y-4">
            <h2 className="text-lg font-semibold">Sign in to your account</h2>
            <button onClick={handleGoogle} disabled={loading} className="btn-secondary w-full py-2.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Signing in...' : 'Continue with Google'}
            </button>
          </div>
        </div>
        <p className="text-center text-sm text-slate-500 mt-6">
          No account?{' '}
          <Link href="/register" className="text-brand-600 hover:text-brand-700 font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  )
}`,

// ─────────────────────────────────────────────────────────────────────────────
// app/(auth)/register/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
'app/(auth)/register/page.tsx': `'use client'

import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">${projectName}</h1>
          <p className="text-slate-500 mt-1 text-sm">Create your free account</p>
        </div>
        <div className="card">
          <div className="card-body space-y-4">
            <h2 className="text-lg font-semibold">Get started for free</h2>
            <button
              onClick={() => signIn('google', { redirectTo: '/dashboard' })}
              className="btn-secondary w-full py-2.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <p className="text-xs text-slate-400 text-center">
              By signing up you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}`,

// ─────────────────────────────────────────────────────────────────────────────
// app/(dashboard)/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
'app/(dashboard)/layout.tsx': `import { requireAuth } from '@/lib/auth'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth()
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}`,

// ─────────────────────────────────────────────────────────────────────────────
// app/(dashboard)/dashboard/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
'app/(dashboard)/dashboard/page.tsx': `import { requireAuth } from '@/lib/auth'

const stats = [
  { label: 'Total Revenue', value: '$12,450', change: '+12.5%', up: true  },
  { label: 'Active Users',  value: '1,234',   change: '+8.2%',  up: true  },
  { label: 'Churn Rate',    value: '2.4%',    change: '-0.3%',  up: false },
  { label: 'MRR',           value: '$4,150',  change: '+18.1%', up: true  },
]

export default async function DashboardPage() {
  const session  = await requireAuth()
  const firstName = session.user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Good morning, {firstName} 👋</h1>
        <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening today.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="card p-5">
            <p className="text-sm font-medium text-slate-500">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
            <p className={\`text-xs mt-1 font-medium \${s.up ? 'text-brand-600' : 'text-red-500'}\`}>
              {s.change} vs last month
            </p>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header"><h2 className="font-semibold">Quick Actions</h2></div>
        <div className="card-body flex flex-wrap gap-3">
          <button className="btn-primary px-5 py-2">New project</button>
          <button className="btn-secondary px-5 py-2">Invite team</button>
          <button className="btn-ghost px-5 py-2">View docs</button>
        </div>
      </div>
    </div>
  )
}`,

// ─────────────────────────────────────────────────────────────────────────────
// app/(dashboard)/settings/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
'app/(dashboard)/settings/page.tsx': `import { requireAuth } from '@/lib/auth'

export default async function SettingsPage() {
  const session = await requireAuth()
  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account.</p>
      </div>
      <div className="card">
        <div className="card-header"><h2 className="font-semibold">Profile</h2></div>
        <div className="card-body space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" defaultValue={session.user?.name ?? ''} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" defaultValue={session.user?.email ?? ''} disabled />
          </div>
          <button className="btn-primary px-6 py-2">Save changes</button>
        </div>
      </div>
      <div className="card border-red-200">
        <div className="card-header border-red-200">
          <h2 className="font-semibold text-red-600">Danger Zone</h2>
        </div>
        <div className="card-body">
          <p className="text-sm text-slate-500 mb-4">Once deleted, your account cannot be recovered.</p>
          <button className="btn-danger px-6 py-2">Delete account</button>
        </div>
      </div>
    </div>
  )
}`,

// ─────────────────────────────────────────────────────────────────────────────
// app/(dashboard)/billing/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
'app/(dashboard)/billing/page.tsx': `import { requireAuth } from '@/lib/auth'

const plans = [
  { name: 'Starter', price: '$0',  features: ['3 projects', '1k AI gen/mo', 'Community support'], popular: false },
  { name: 'Pro',     price: '$29', features: ['Unlimited projects', '50k AI gen/mo', 'Priority support', 'Custom domain'], popular: true },
  { name: 'Team',    price: '$99', features: ['Everything in Pro', 'Unlimited AI gen', 'Dedicated support', 'SSO'], popular: false },
]

export default async function BillingPage() {
  await requireAuth()
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-slate-500 mt-1">Manage your subscription.</p>
      </div>
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="font-semibold">Current plan</h2>
          <span className="badge-green">Active</span>
        </div>
        <div className="card-body flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">Starter</p>
            <p className="text-sm text-slate-500">Free forever</p>
          </div>
          <button className="btn-primary px-6 py-2">Upgrade</button>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map(plan => (
          <div key={plan.name} className={\`card p-6 flex flex-col \${plan.popular ? 'ring-2 ring-brand-500' : ''}\`}>
            {plan.popular && <span className="badge-green mb-3 self-start">Most Popular</span>}
            <h3 className="font-bold text-lg">{plan.name}</h3>
            <p className="text-3xl font-bold mt-1 mb-4">
              {plan.price}<span className="text-sm font-normal text-slate-400">/mo</span>
            </p>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button className={plan.popular ? 'btn-primary py-2' : 'btn-secondary py-2'}>
              {plan.price === '$0' ? 'Current plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}`,

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/Sidebar.tsx
// ─────────────────────────────────────────────────────────────────────────────
'components/layout/Sidebar.tsx': `'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard',          label: 'Dashboard', icon: '⊞' },
  { href: '/dashboard/billing',  label: 'Billing',   icon: '💳' },
  { href: '/dashboard/settings', label: 'Settings',  icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex flex-col w-56 border-r border-slate-200 bg-white p-4 shrink-0">
      <div className="px-2 py-3 mb-6">
        <span className="text-lg font-bold">${projectName}</span>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={\`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                \${active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }\`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 px-3 py-2">
        ⚡ MakeFast AI
      </div>
    </aside>
  )
}`,

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/TopBar.tsx
// ─────────────────────────────────────────────────────────────────────────────
'components/layout/TopBar.tsx': `'use client'

import { signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import Image from 'next/image'

interface Props { user: Session['user'] }

export default function TopBar({ user }: Props) {
  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500 hidden sm:block">{user?.email}</span>
        {user?.image ? (
          <Image src={user.image} alt="avatar" width={32} height={32} className="rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold">
            {user?.name?.[0] ?? '?'}
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="btn-ghost text-xs px-3 py-1.5 text-slate-500"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}`,

// ─────────────────────────────────────────────────────────────────────────────
// app/api/stripe/webhook/route.ts
// ─────────────────────────────────────────────────────────────────────────────
'app/api/stripe/webhook/route.ts': `import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId  = session.metadata?.userId
      if (userId) {
        await db.subscription.upsert({
          where:  { userId },
          update: { stripeId: session.subscription as string, plan: 'pro', status: 'active' },
          create: { userId,  stripeId: session.subscription as string, plan: 'pro', status: 'active' },
        })
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await db.subscription.updateMany({
        where: { stripeId: sub.id },
        data:  { plan: 'free', status: 'cancelled' },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}`,

// ─────────────────────────────────────────────────────────────────────────────
// app/api/stripe/checkout/route.ts
// ─────────────────────────────────────────────────────────────────────────────
'app/api/stripe/checkout/route.ts': `import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { requireAuth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session    = await requireAuth()
  const { priceId } = await req.json()

  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: \`\${process.env.AUTH_URL}/dashboard/billing?success=1\`,
    cancel_url:  \`\${process.env.AUTH_URL}/dashboard/billing\`,
    metadata: { userId: session.user?.id ?? '' },
  })

  return NextResponse.json({ url: checkout.url })
}`,

// ─────────────────────────────────────────────────────────────────────────────
// prisma/schema.prisma - lean schema (no adapter tables needed with JWT)
// ─────────────────────────────────────────────────────────────────────────────
'prisma/schema.prisma': `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String        @id @default(cuid())
  name         String?
  email        String?       @unique
  image        String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  subscription Subscription?
}

model Subscription {
  id        String   @id @default(cuid())
  userId    String   @unique
  stripeId  String?
  plan      String   @default("free")
  status    String   @default("active")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}`,

// ─────────────────────────────────────────────────────────────────────────────
// .env.example
// ─────────────────────────────────────────────────────────────────────────────
'.env.example': `# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/${projectName}?schema=public"

# Auth.js v5 - https://authjs.dev
# Run: npx auth secret   to auto-generate AUTH_SECRET
AUTH_SECRET="your-secret-here"
AUTH_URL="http://localhost:3000"

# Google OAuth - https://console.cloud.google.com/apis/credentials
AUTH_GOOGLE_ID="your-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-client-secret"

# Stripe - https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID="price_..."`,

'.env.local': `# Copy from .env.example and fill in real values
# DO NOT commit this file to git`,

// ─────────────────────────────────────────────────────────────────────────────
// public/favicon.svg
// ─────────────────────────────────────────────────────────────────────────────
'public/favicon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#16a34a"/>
  <path d="M9 16.5L14 21.5L23 11" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

// ─────────────────────────────────────────────────────────────────────────────
// README.md
// ─────────────────────────────────────────────────────────────────────────────
'README.md': `# ${projectName}

> Full-stack Next.js 15 SaaS starter - built with [MakeFast AI](https://github.com/al-feel/makefast-ai) ⚡

## Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Framework | Next.js 15 (App Router)       |
| Language  | TypeScript                    |
| Styling   | Tailwind CSS 3                |
| Auth      | Auth.js v5 (Google OAuth/JWT) |
| Database  | PostgreSQL + Prisma 6         |
| Payments  | Stripe                        |

## Quick Start

\`\`\`bash
npm install
cp .env.example .env.local
# Fill in all values in .env.local
npx auth secret       # auto-generates AUTH_SECRET
npx prisma db push    # creates DB tables
npm run dev           # http://localhost:3000
\`\`\`

## Why JWT (not database sessions)?

Auth.js v5 with \`PrismaAdapter\` uses database sessions - which means
\`middleware.ts\` (Edge Runtime) can't call \`auth()\` directly since Prisma is
Node.js-only. Using \`strategy: 'jwt'\` keeps everything Edge-compatible:
middleware uses \`getToken()\`, server components use \`auth()\` directly.

## Project Structure

\`\`\`
app/
├── (auth)/login        ← public auth pages
├── (auth)/register
├── (dashboard)/        ← protected layout (requireAuth)
│   ├── dashboard/
│   ├── settings/
│   └── billing/
├── api/auth/           ← Auth.js v5 handler
└── api/stripe/         ← webhook + checkout

auth.ts                 ← Auth.js config (root level)
middleware.ts           ← Edge-safe route protection
lib/db.ts               ← Prisma singleton
lib/auth.ts             ← requireAuth() helper
lib/stripe.ts           ← Stripe client
prisma/schema.prisma    ← DB schema
\`\`\`
`,

  }
}