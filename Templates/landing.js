'use strict';

module.exports = function getLandingFiles(projectName) {
  return {

// ─────────────────────────────────────────────────────────────────────────────
// package.json
// ─────────────────────────────────────────────────────────────────────────────
'package.json': `{
  "name": "${projectName}",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.16.0",
    "@astrojs/tailwind": "^5.1.5",
    "@astrojs/sitemap": "^3.1.6",
    "@astrojs/image": "^0.18.0",
    "tailwindcss": "^3.4.3",
    "sharp": "^0.33.5"
  }
}`,

// ─────────────────────────────────────────────────────────────────────────────
// astro.config.mjs
// ─────────────────────────────────────────────────────────────────────────────
'astro.config.mjs': `import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://${projectName}.com',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  compressHTML: true,
})`,

// ─────────────────────────────────────────────────────────────────────────────
// tailwind.config.ts
// ─────────────────────────────────────────────────────────────────────────────
'tailwind.config.ts': `import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', ...defaultTheme.fontFamily.sans],
        display: ['Cal Sans', 'Inter Variable', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out both',
        'slide-up': 'slideUp 0.6s ease-out both',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
      },
    },
  },
  plugins: [],
} satisfies Config`,

// ─────────────────────────────────────────────────────────────────────────────
// tsconfig.json
// ─────────────────────────────────────────────────────────────────────────────
'tsconfig.json': `{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strictNullChecks": true,
    "allowJs": true
  }
}`,

// ─────────────────────────────────────────────────────────────────────────────
// src/styles/global.css
// ─────────────────────────────────────────────────────────────────────────────
'src/styles/global.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-bg: 255 255 255;
    --color-text: 15 23 42;
    --color-muted: 100 116 139;
    --color-border: 226 232 240;
    --color-surface: 248 250 252;
  }
  .dark {
    --color-bg: 3 7 18;
    --color-text: 241 245 249;
    --color-muted: 148 163 184;
    --color-border: 30 41 59;
    --color-surface: 15 23 42;
  }
  html { scroll-behavior: smooth; }
  body { @apply bg-white dark:bg-gray-950 text-slate-900 dark:text-slate-100 antialiased; }
  ::selection { @apply bg-brand-500/20 text-brand-700 dark:text-brand-300; }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white
           font-semibold px-6 py-3 rounded-full transition-all duration-200
           shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2;
  }
  .btn-secondary {
    @apply inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700
           hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold px-6 py-3 rounded-full
           transition-all duration-200 focus-visible:outline-none focus-visible:ring-2
           focus-visible:ring-slate-400 focus-visible:ring-offset-2;
  }
  .card {
    @apply bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800
           rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300;
  }
  .section { @apply py-24 px-4; }
  .container { @apply max-w-6xl mx-auto; }
  .section-tag {
    @apply inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest
           uppercase text-brand-600 dark:text-brand-400 mb-4;
  }
  .gradient-text {
    @apply bg-gradient-to-r from-brand-600 to-emerald-400 bg-clip-text text-transparent;
  }
}`,

// ─────────────────────────────────────────────────────────────────────────────
// src/layouts/Layout.astro
// ─────────────────────────────────────────────────────────────────────────────
'src/layouts/Layout.astro': `---
import '../styles/global.css'
import Nav from '../components/Nav.astro'

interface Props {
  title: string
  description?: string
  ogImage?: string
}

const {
  title,
  description = '${projectName} - the fastest way to get started.',
  ogImage = '/og-image.png',
} = Astro.props
---
<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:type" content="website" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="sitemap" href="/sitemap-index.xml" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap" rel="stylesheet" />

    <title>{title}</title>

    <!-- Dark mode script (prevent flash) -->
    <script is:inline>
      const theme = localStorage.getItem('theme') ?? 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', theme === 'dark')
    </script>
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
  </body>
</html>`,

// ─────────────────────────────────────────────────────────────────────────────
// src/components/Nav.astro
// ─────────────────────────────────────────────────────────────────────────────
'src/components/Nav.astro': `---
const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#pricing',  label: 'Pricing' },
  { href: '#faq',      label: 'FAQ' },
]
---
<header
  id="navbar"
  class="fixed top-0 inset-x-0 z-50 transition-all duration-300"
>
  <nav class="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
    <!-- Logo -->
    <a href="/" class="font-display text-xl font-bold tracking-tight">
      ${projectName}
    </a>

    <!-- Desktop links -->
    <ul class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
      {navLinks.map(l => (
        <li>
          <a href={l.href} class="hover:text-slate-900 dark:hover:text-white transition-colors">
            {l.label}
          </a>
        </li>
      ))}
    </ul>

    <div class="flex items-center gap-3">
      <!-- Dark mode toggle -->
      <button
        id="theme-toggle"
        aria-label="Toggle dark mode"
        class="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white
               hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <svg id="icon-sun" class="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        <svg id="icon-moon" class="w-5 h-5 block dark:hidden" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

      <a href="#pricing" class="btn-primary text-sm py-2">
        Get started →
      </a>
    </div>
  </nav>
</header>

<script>
  // Sticky nav shadow on scroll
  const navbar = document.getElementById('navbar')!
  window.addEventListener('scroll', () => {
    navbar.classList.toggle(
      'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-sm border-b border-slate-200/60 dark:border-slate-800/60',
      window.scrollY > 20
    )
  })

  // Dark mode toggle
  document.getElementById('theme-toggle')!.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  })
</script>`,

// ─────────────────────────────────────────────────────────────────────────────
// src/components/Hero.astro
// ─────────────────────────────────────────────────────────────────────────────
'src/components/Hero.astro': `---
---
<section class="relative min-h-screen flex items-center justify-center text-center px-4 pt-20 overflow-hidden">

  <!-- Background gradient blobs -->
  <div class="absolute inset-0 -z-10 overflow-hidden">
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px]
                bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-[400px] h-[400px]
                bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full blur-3xl"></div>
  </div>

  <!-- Grid pattern overlay -->
  <div class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:72px_72px] dark:opacity-30 opacity-40"></div>

  <div class="max-w-4xl mx-auto animate-slide-up">
    <!-- Badge -->
    <div class="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800
                text-brand-700 dark:text-brand-300 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
      <span class="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
      Now in public beta
    </div>

    <!-- Headline -->
    <h1 class="text-5xl md:text-7xl font-display font-bold leading-[1.1] tracking-tight mb-6">
      The fastest way to
      <span class="gradient-text"> launch your idea</span>
    </h1>

    <!-- Subheadline -->
    <p class="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
      ${projectName} helps founders and developers ship products faster.
      Go from idea to live in minutes, not months.
    </p>

    <!-- CTAs -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="#pricing" class="btn-primary text-base px-8 py-4">
        Start for free →
      </a>
      <a href="#features" class="btn-secondary text-base px-8 py-4">
        See how it works
      </a>
    </div>

    <!-- Social proof -->
    <p class="mt-8 text-sm text-slate-400">
      Trusted by <span class="font-semibold text-slate-700 dark:text-slate-300">2,000+</span> founders worldwide · No credit card required
    </p>
  </div>
</section>`,

// ─────────────────────────────────────────────────────────────────────────────
// src/components/Features.astro
// ─────────────────────────────────────────────────────────────────────────────
'src/components/Features.astro': `---
const features = [
  {
    icon: '⚡',
    title: 'Blazing Fast',
    description: 'Built for performance from day one. Ship features your users will love in record time.',
  },
  {
    icon: '🔒',
    title: 'Secure by Default',
    description: 'Enterprise-grade security baked in. Your data stays safe without extra configuration.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered',
    description: 'Let AI do the heavy lifting. Generate, automate, and iterate at the speed of thought.',
  },
  {
    icon: '📊',
    title: 'Real-time Analytics',
    description: 'Know exactly what is working. Get insights that drive growth and reduce churn.',
  },
  {
    icon: '🔌',
    title: 'Easy Integrations',
    description: 'Connect to any tool in your stack. Stripe, Slack, Notion, and 100+ more out of the box.',
  },
  {
    icon: '🚀',
    title: 'One-click Deploy',
    description: 'Go live instantly. Deploy to Vercel, Netlify, or any CDN with a single command.',
  },
]
---
<section id="features" class="section">
  <div class="container">

    <div class="text-center mb-16">
      <p class="section-tag">✦ Features</p>
      <h2 class="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
        Everything you need to ship
      </h2>
      <p class="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
        Stop duct-taping tools together. ${projectName} gives you a complete platform built for speed.
      </p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((f, i) => (
        <div class="card group" style={\`animation-delay: \${i * 80}ms\`}>
          <div class="text-3xl mb-4 animate-float" style={\`animation-delay: \${i * 400}ms\`}>
            {f.icon}
          </div>
          <h3 class="text-lg font-semibold mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {f.title}
          </h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            {f.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>`,

// ─────────────────────────────────────────────────────────────────────────────
// src/components/SocialProof.astro
// ─────────────────────────────────────────────────────────────────────────────
'src/components/SocialProof.astro': `---
const stats = [
  { value: '10k+',  label: 'Founders' },
  { value: '99.9%', label: 'Uptime' },
  { value: '< 2s',  label: 'Load time' },
  { value: '4.9★',  label: 'Rating' },
]

const testimonials = [
  {
    quote: "I launched my SaaS in a weekend. ${projectName} is genuinely the fastest way to ship.",
    name: 'Alex M.',
    role: 'Indie Hacker',
    avatar: 'AM',
  },
  {
    quote: "Replaced three tools with one. The AI features alone are worth 10x the price.",
    name: 'Sarah K.',
    role: 'Founder @ Flowly',
    avatar: 'SK',
  },
  {
    quote: "My team went from idea to production in 3 days. Absolutely game-changing.",
    name: 'James R.',
    role: 'CTO @ Stackly',
    avatar: 'JR',
  },
]
---
<section class="section bg-slate-50 dark:bg-slate-900/50">
  <div class="container">

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
      {stats.map(s => (
        <div class="text-center">
          <div class="text-4xl font-display font-bold text-brand-600 dark:text-brand-400 mb-1">{s.value}</div>
          <div class="text-sm text-slate-500 dark:text-slate-400 font-medium">{s.label}</div>
        </div>
      ))}
    </div>

    <!-- Testimonials -->
    <div class="text-center mb-12">
      <p class="section-tag">✦ Testimonials</p>
      <h2 class="text-4xl font-display font-bold tracking-tight">Loved by founders</h2>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      {testimonials.map(t => (
        <div class="card flex flex-col gap-4">
          <div class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            "{t.quote}"
          </div>
          <div class="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
            <div class="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300
                        flex items-center justify-center text-xs font-bold flex-shrink-0">
              {t.avatar}
            </div>
            <div>
              <div class="text-sm font-semibold">{t.name}</div>
              <div class="text-xs text-slate-400">{t.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>`,

// ─────────────────────────────────────────────────────────────────────────────
// src/components/Pricing.astro
// ─────────────────────────────────────────────────────────────────────────────
'src/components/Pricing.astro': `---
const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/mo',
    description: 'Perfect for side projects and early validation.',
    features: [
      '3 projects',
      '1,000 AI generations/mo',
      'Community support',
      'Basic analytics',
    ],
    cta: 'Get started free',
    href: '#',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'For founders who are serious about shipping.',
    features: [
      'Unlimited projects',
      '50,000 AI generations/mo',
      'Priority support',
      'Advanced analytics',
      'Custom domain',
      'Team members (up to 5)',
    ],
    cta: 'Start free trial →',
    href: '#',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$99',
    period: '/mo',
    description: 'For fast-moving teams building at scale.',
    features: [
      'Everything in Pro',
      'Unlimited AI generations',
      'Dedicated support',
      'SSO & SAML',
      'Audit logs',
      'Unlimited team members',
    ],
    cta: 'Contact sales',
    href: '#',
    highlighted: false,
  },
]
---
<section id="pricing" class="section">
  <div class="container">

    <div class="text-center mb-16">
      <p class="section-tag">✦ Pricing</p>
      <h2 class="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
        Simple, transparent pricing
      </h2>
      <p class="text-lg text-slate-500 dark:text-slate-400">
        Start for free. Upgrade when you are ready. Cancel anytime.
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-6 items-start">
      {plans.map(plan => (
        <div class={[
          'relative rounded-2xl p-8 border transition-all duration-300',
          plan.highlighted
            ? 'bg-brand-600 dark:bg-brand-600 border-brand-500 text-white shadow-2xl shadow-brand-500/25 scale-105'
            : 'card hover:-translate-y-1'
        ].join(' ')}>

          {plan.highlighted && (
            <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900
                        text-xs font-bold px-4 py-1.5 rounded-full tracking-wide">
              MOST POPULAR
            </div>
          )}

          <div class="mb-6">
            <h3 class={['text-lg font-bold mb-1', plan.highlighted ? 'text-white' : ''].join(' ')}>
              {plan.name}
            </h3>
            <div class="flex items-end gap-1 mb-2">
              <span class={['text-4xl font-display font-bold', plan.highlighted ? 'text-white' : ''].join(' ')}>
                {plan.price}
              </span>
              <span class={['text-sm mb-1.5', plan.highlighted ? 'text-brand-200' : 'text-slate-400'].join(' ')}>
                {plan.period}
              </span>
            </div>
            <p class={['text-sm', plan.highlighted ? 'text-brand-100' : 'text-slate-500 dark:text-slate-400'].join(' ')}>
              {plan.description}
            </p>
          </div>

          <ul class="space-y-3 mb-8">
            {plan.features.map(f => (
              <li class={['flex items-center gap-2.5 text-sm', plan.highlighted ? 'text-brand-50' : 'text-slate-600 dark:text-slate-300'].join(' ')}>
                <svg class={['w-4 h-4 flex-shrink-0', plan.highlighted ? 'text-brand-200' : 'text-brand-500'].join(' ')} fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                {f}
              </li>
            ))}
          </ul>

          <a
            href={plan.href}
            class={[
              'block text-center font-semibold py-3 rounded-full transition-all duration-200 text-sm',
              plan.highlighted
                ? 'bg-white text-brand-700 hover:bg-brand-50 shadow-lg'
                : 'btn-secondary w-full justify-center'
            ].join(' ')}
          >
            {plan.cta}
          </a>
        </div>
      ))}
    </div>

    <p class="text-center text-sm text-slate-400 mt-8">
      All plans include a 14-day free trial · No credit card required
    </p>
  </div>
</section>`,

// ─────────────────────────────────────────────────────────────────────────────
// src/components/FAQ.astro
// ─────────────────────────────────────────────────────────────────────────────
'src/components/FAQ.astro': `---
const faqs = [
  {
    q: 'Do I need a credit card to sign up?',
    a: 'No. You can start for free with no credit card required. Upgrade when you are ready.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. Cancel anytime from your account settings. No questions asked.',
  },
  {
    q: 'What happens when I hit my generation limit?',
    a: 'You will get a notification before you hit the limit. Upgrading takes under 30 seconds.',
  },
  {
    q: 'Do you offer discounts for students or nonprofits?',
    a: 'Yes! Reach out to us at hello@${projectName}.com with proof of eligibility.',
  },
  {
    q: 'Is my data secure?',
    a: 'Your data is encrypted at rest and in transit. We are SOC 2 compliant and never sell your data.',
  },
]
---
<section id="faq" class="section bg-slate-50 dark:bg-slate-900/50">
  <div class="container max-w-3xl">

    <div class="text-center mb-12">
      <p class="section-tag">✦ FAQ</p>
      <h2 class="text-4xl font-display font-bold tracking-tight">Frequently asked questions</h2>
    </div>

    <div class="space-y-4">
      {faqs.map((faq, i) => (
        <details class="card group cursor-pointer" id={\`faq-\${i}\`}>
          <summary class="flex items-center justify-between gap-4 font-semibold cursor-pointer list-none">
            {faq.q}
            <svg class="w-5 h-5 flex-shrink-0 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <p class="mt-4 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            {faq.a}
          </p>
        </details>
      ))}
    </div>

  </div>
</section>`,

// ─────────────────────────────────────────────────────────────────────────────
// src/components/CTA.astro
// ─────────────────────────────────────────────────────────────────────────────
'src/components/CTA.astro': `---
---
<section class="section">
  <div class="container">
    <div class="relative rounded-3xl bg-brand-600 dark:bg-brand-700 overflow-hidden px-8 py-20 text-center text-white">

      <!-- Background decoration -->
      <div class="absolute inset-0 -z-0">
        <div class="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10">
        <p class="text-brand-200 text-sm font-semibold tracking-widest uppercase mb-4">✦ Get started today</p>
        <h2 class="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
          Ready to ship your idea?
        </h2>
        <p class="text-brand-100 text-lg max-w-xl mx-auto mb-10">
          Join 10,000+ founders who use ${projectName} to build and launch faster.
          Your first project is completely free.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#pricing"
             class="bg-white text-brand-700 hover:bg-brand-50 font-semibold px-8 py-4 rounded-full
                    transition-all duration-200 shadow-lg text-base">
            Start for free →
          </a>
          <a href="#features"
             class="border border-white/30 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-full
                    transition-all duration-200 text-base">
            Learn more
          </a>
        </div>
      </div>
    </div>
  </div>
</section>`,

// ─────────────────────────────────────────────────────────────────────────────
// src/components/Footer.astro
// ─────────────────────────────────────────────────────────────────────────────
'src/components/Footer.astro': `---
const links = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  Company:  ['About', 'Blog', 'Careers', 'Press'],
  Legal:    ['Privacy', 'Terms', 'Security'],
}
---
<footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-950">
  <div class="container section">

    <div class="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
      <!-- Brand -->
      <div class="col-span-2 md:col-span-1">
        <a href="/" class="font-display text-xl font-bold tracking-tight mb-3 block">
          ${projectName}
        </a>
        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          The fastest way to go from idea to live product.
        </p>
      </div>

      <!-- Links -->
      {Object.entries(links).map(([category, items]) => (
        <div>
          <h4 class="text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-4">
            {category}
          </h4>
          <ul class="space-y-3">
            {items.map(item => (
              <li>
                <a href="#" class="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div class="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row
                items-center justify-between gap-4 text-sm text-slate-400">
      <p>© {new Date().getFullYear()} ${projectName}. All rights reserved.</p>
      <p>Built with MakeFast AI ⚡</p>
    </div>

  </div>
</footer>`,

// ─────────────────────────────────────────────────────────────────────────────
// src/pages/index.astro
// ─────────────────────────────────────────────────────────────────────────────
'src/pages/index.astro': `---
import Layout from '../layouts/Layout.astro'
import Hero from '../components/Hero.astro'
import Features from '../components/Features.astro'
import SocialProof from '../components/SocialProof.astro'
import Pricing from '../components/Pricing.astro'
import FAQ from '../components/FAQ.astro'
import CTA from '../components/CTA.astro'
import Footer from '../components/Footer.astro'
---
<Layout
  title="${projectName} - Ship faster, launch smarter"
  description="${projectName} helps founders ship products faster. Go from idea to live in minutes."
>
  <Hero />
  <Features />
  <SocialProof />
  <Pricing />
  <FAQ />
  <CTA />
  <Footer />
</Layout>`,

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

> Landing page built with [MakeFast AI](https://github.com/yourname/makefast-ai) ⚡

## Stack

- [Astro](https://astro.build) - static site framework
- [Tailwind CSS](https://tailwindcss.com) - utility-first styling
- Dark mode, SEO, sitemap, Open Graph - all included

## Getting Started

\`\`\`bash
npm install
npm run dev        # → http://localhost:4321
\`\`\`

## Build & Deploy

\`\`\`bash
npm run build      # output in ./dist
npm run preview    # preview prod build locally
\`\`\`

Deploy instantly to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).

## Sections

| Section | File |
|---|---|
| Navigation | \`src/components/Nav.astro\` |
| Hero | \`src/components/Hero.astro\` |
| Features | \`src/components/Features.astro\` |
| Social Proof + Testimonials | \`src/components/SocialProof.astro\` |
| Pricing | \`src/components/Pricing.astro\` |
| FAQ | \`src/components/FAQ.astro\` |
| CTA | \`src/components/CTA.astro\` |
| Footer | \`src/components/Footer.astro\` |

## Customise

1. Edit text/colors in each \`.astro\` component
2. Update brand colors in \`tailwind.config.ts\` → \`colors.brand\`
3. Replace placeholder links in \`Footer.astro\` and \`Nav.astro\`
`,

  };
};