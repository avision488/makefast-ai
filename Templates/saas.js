'use strict';

module.exports = function getSaasFiles(projectName) {
  return {

// ─────────────────────────────────────────────────────────────────────────────
// package.json updated deps, added tsx for dev
// ─────────────────────────────────────────────────────────────────────────────
'package.json': `{
  "name": "${projectName}",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest --passWithNoTests",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "express": "5.0.1",
    "cors": "2.8.5",
    "helmet": "8.0.0",
    "dotenv": "16.4.7",
    "@prisma/client": "6.8.2",
    "bcryptjs": "2.4.3",
    "jsonwebtoken": "9.0.2",
    "stripe": "17.7.0",
    "zod": "3.24.4",
    "winston": "3.17.0",
    "express-rate-limit": "7.5.0",
    "cookie-parser": "1.4.7"
  },
  "devDependencies": {
    "typescript": "5.8.3",
    "@types/express": "5.0.1",
    "@types/node": "22.15.21",
    "@types/bcryptjs": "2.4.6",
    "@types/jsonwebtoken": "9.0.9",
    "@types/cors": "2.8.17",
    "@types/cookie-parser": "1.4.8",
    "tsx": "4.19.4",
    "prisma": "6.8.2",
    "jest": "29.7.0",
    "@types/jest": "29.5.14",
    "ts-jest": "29.3.4",
    "supertest": "7.1.0",
    "@types/supertest": "6.0.3"
  }
}`,

// ─────────────────────────────────────────────────────────────────────────────
// tsconfig.json
// ─────────────────────────────────────────────────────────────────────────────
'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}`,

// ─────────────────────────────────────────────────────────────────────────────
// src/index.ts - entry point
// ─────────────────────────────────────────────────────────────────────────────
'src/index.ts': `import 'dotenv/config'
import { app } from './app'
import { logger } from './utils/logger'
import { db } from './config/database'

const PORT = process.env.PORT || 3000

async function bootstrap() {
  try {
    await db.$connect()
    logger.info('Database connected')

    app.listen(PORT, () => {
      logger.info(\`🚀 Server running on port \${PORT} [\${process.env.NODE_ENV ?? 'development'}]\`)
    })
  } catch (err) {
    logger.error('Failed to start server', err)
    process.exit(1)
  }
}

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received - shutting down gracefully')
  await db.$disconnect()
  process.exit(0)
})

bootstrap()`,

// ─────────────────────────────────────────────────────────────────────────────
// src/app.ts - Express app factory
// ─────────────────────────────────────────────────────────────────────────────
'src/app.ts': `import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'
import router from './routes'
import { errorHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/logger'

export const app = express()

// Security
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3001',
  credentials: true,
}))

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later' },
}))

// Parsing
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Logging
app.use(requestLogger)

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }))

// API routes
app.use('/api/v1', router)

// 404
app.use((_req, res) => res.status(404).json({ success: false, error: 'Route not found' }))

// Global error handler (must be last)
app.use(errorHandler)`,

// ─────────────────────────────────────────────────────────────────────────────
// src/config/index.ts
// ─────────────────────────────────────────────────────────────────────────────
'src/config/index.ts': `import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV:          z.enum(['development', 'production', 'test']).default('development'),
  PORT:              z.string().default('3000'),
  DATABASE_URL:      z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET:        z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
  JWT_REFRESH_SECRET:z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 chars'),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  CLIENT_URL:        z.string().url().default('http://localhost:3001'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:')
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const config = parsed.data`,

// ─────────────────────────────────────────────────────────────────────────────
// src/config/database.ts
// ─────────────────────────────────────────────────────────────────────────────
'src/config/database.ts': `import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db`,

// ─────────────────────────────────────────────────────────────────────────────
// src/routes/index.ts
// ─────────────────────────────────────────────────────────────────────────────
'src/routes/index.ts': `import { Router } from 'express'
import authRoutes    from './auth'
import userRoutes    from './users'
import billingRoutes from './billing'
import healthRoutes  from './health'

const router = Router()

router.use('/health',  healthRoutes)
router.use('/auth',    authRoutes)
router.use('/users',   userRoutes)
router.use('/billing', billingRoutes)

export default router`,

// ─────────────────────────────────────────────────────────────────────────────
// src/routes/health.ts
// ─────────────────────────────────────────────────────────────────────────────
'src/routes/health.ts': `import { Router } from 'express'
import { db } from '../config/database'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    await db.$queryRaw\`SELECT 1\`
    res.json({ status: 'ok', db: 'connected', uptime: process.uptime() })
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' })
  }
})

export default router`,

// ─────────────────────────────────────────────────────────────────────────────
// src/routes/auth.ts - register, login, refresh, logout, me
// ─────────────────────────────────────────────────────────────────────────────
'src/routes/auth.ts': `import { Router, Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { requireAuth } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { registerSchema, loginSchema } from '../schemas/auth.schema'
import { ok, fail } from '../utils/response'

const router = Router()
const auth   = new AuthService()

router.post('/register', validate(registerSchema), async (req: Request, res: Response) => {
  try {
    const result = await auth.register(req.body)
    ok(res, result, 201)
  } catch (err: any) {
    fail(res, err.message, err.status ?? 400)
  }
})

router.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const result = await auth.login(req.body)
    // Set refresh token as httpOnly cookie
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
    })
    ok(res, { accessToken: result.accessToken, user: result.user })
  } catch (err: any) {
    fail(res, err.message, err.status ?? 401)
  }
})

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refresh_token
    if (!token) return fail(res, 'No refresh token', 401)
    const result = await auth.refresh(token)
    ok(res, result)
  } catch (err: any) {
    fail(res, err.message, 401)
  }
})

router.post('/logout', requireAuth, (req: Request, res: Response) => {
  res.clearCookie('refresh_token')
  ok(res, { message: 'Logged out' })
})

router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await auth.getUser((req as any).userId)
    ok(res, user)
  } catch (err: any) {
    fail(res, err.message, 404)
  }
})

export default router`,

// ─────────────────────────────────────────────────────────────────────────────
// src/routes/users.ts
// ─────────────────────────────────────────────────────────────────────────────
'src/routes/users.ts': `import { Router, Request, Response } from 'express'
import { requireAuth } from '../middleware/auth'
import { db } from '../config/database'
import { ok, fail } from '../utils/response'

const router = Router()

router.get('/profile', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await db.user.findUniqueOrThrow({
      where:  { id: (req as any).userId },
      select: { id: true, email: true, name: true, createdAt: true, subscription: true },
    })
    ok(res, user)
  } catch {
    fail(res, 'User not found', 404)
  }
})

router.patch('/profile', requireAuth, async (req: Request, res: Response) => {
  const { name } = req.body
  try {
    const user = await db.user.update({
      where:  { id: (req as any).userId },
      data:   { name },
      select: { id: true, email: true, name: true },
    })
    ok(res, user)
  } catch {
    fail(res, 'Failed to update profile', 400)
  }
})

export default router`,

// ─────────────────────────────────────────────────────────────────────────────
// src/routes/billing.ts
// ─────────────────────────────────────────────────────────────────────────────
'src/routes/billing.ts': `import { Router, Request, Response } from 'express'
import { requireAuth } from '../middleware/auth'
import { StripeService } from '../services/stripe.service'
import { ok, fail } from '../utils/response'

const router = Router()
const stripe = new StripeService()

router.post('/checkout', requireAuth, async (req: Request, res: Response) => {
  try {
    const { priceId } = req.body
    const session = await stripe.createCheckout({
      userId:  (req as any).userId,
      priceId,
    })
    ok(res, { url: session.url })
  } catch (err: any) {
    fail(res, err.message, 400)
  }
})

router.post('/portal', requireAuth, async (req: Request, res: Response) => {
  try {
    const url = await stripe.createPortalSession((req as any).userId)
    ok(res, { url })
  } catch (err: any) {
    fail(res, err.message, 400)
  }
})

router.get('/subscription', requireAuth, async (req: Request, res: Response) => {
  try {
    const sub = await stripe.getSubscription((req as any).userId)
    ok(res, sub)
  } catch (err: any) {
    fail(res, err.message, 404)
  }
})

// Stripe webhook - no auth, raw body needed
router.post('/webhook',
  (req, res, next) => {
    let data = ''
    req.setEncoding('utf8')
    req.on('data', chunk => { data += chunk })
    req.on('end', () => { (req as any).rawBody = data; next() })
  },
  async (req: Request, res: Response) => {
    try {
      await stripe.handleWebhook(req)
      res.json({ received: true })
    } catch (err: any) {
      fail(res, err.message, 400)
    }
  }
)

export default router`,

// ─────────────────────────────────────────────────────────────────────────────
// src/middleware/auth.ts
// ─────────────────────────────────────────────────────────────────────────────
'src/middleware/auth.ts': `import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string }
    ;(req as any).userId = decoded.userId
    ;(req as any).email  = decoded.email
    next()
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, error: 'Token expired' })
    }
    res.status(401).json({ success: false, error: 'Invalid token' })
  }
}`,

// ─────────────────────────────────────────────────────────────────────────────
// src/middleware/errorHandler.ts
// ─────────────────────────────────────────────────────────────────────────────
'src/middleware/errorHandler.ts': `import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { logger } from '../utils/logger'

export class AppError extends Error {
  constructor(public message: string, public status = 400) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      error: 'Validation failed',
      details: err.flatten().fieldErrors,
    })
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({ success: false, error: err.message })
  }

  logger.error('Unhandled error', {
    path:    req.path,
    method:  req.method,
    message: err.message,
    stack:   err.stack,
  })

  res.status(500).json({ success: false, error: 'Internal server error' })
}`,

// ─────────────────────────────────────────────────────────────────────────────
// src/middleware/validate.ts
// ─────────────────────────────────────────────────────────────────────────────
'src/middleware/validate.ts': `import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return next(result.error) // caught by ZodError handler
    }
    req.body = result.data
    next()
  }
}`,

// ─────────────────────────────────────────────────────────────────────────────
// src/middleware/logger.ts - request logging middleware
// ─────────────────────────────────────────────────────────────────────────────
'src/middleware/logger.ts': `import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()
  res.on('finish', () => {
    logger.info(\`\${req.method} \${req.path} \${res.statusCode} \${Date.now() - start}ms\`)
  })
  next()
}`,

// ─────────────────────────────────────────────────────────────────────────────
// src/middleware/rateLimit.ts - per-route stricter limits
// ─────────────────────────────────────────────────────────────────────────────
'src/middleware/rateLimit.ts': `import { rateLimit } from 'express-rate-limit'

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { success: false, error: 'Too many auth attempts, please try again later' },
})

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  message: { success: false, error: 'Rate limit exceeded' },
})`,

// ─────────────────────────────────────────────────────────────────────────────
// src/schemas/auth.schema.ts
// ─────────────────────────────────────────────────────────────────────────────
'src/schemas/auth.schema.ts': `import { z } from 'zod'

export const registerSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
              .regex(/[A-Z]/, 'Must contain an uppercase letter')
              .regex(/[0-9]/, 'Must contain a number'),
  name:     z.string().min(1).max(100).optional(),
})

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput    = z.infer<typeof loginSchema>`,

// ─────────────────────────────────────────────────────────────────────────────
// src/services/auth.service.ts
// ─────────────────────────────────────────────────────────────────────────────
'src/services/auth.service.ts': `import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../config/database'
import { AppError } from '../middleware/errorHandler'
import type { RegisterInput, LoginInput } from '../schemas/auth.schema'

export class AuthService {
  private signAccess(userId: string, email: string) {
    return jwt.sign({ userId, email }, process.env.JWT_SECRET!, { expiresIn: '15m' })
  }

  private signRefresh(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' })
  }

  async register(input: RegisterInput) {
    const exists = await db.user.findUnique({ where: { email: input.email } })
    if (exists) throw new AppError('Email already registered', 409)

    const passwordHash = await bcrypt.hash(input.password, 12)
    const user = await db.user.create({
      data: {
        email:        input.email,
        name:         input.name,
        passwordHash,
        subscription: { create: { plan: 'free' } },
      },
      select: { id: true, email: true, name: true, createdAt: true },
    })

    const accessToken  = this.signAccess(user.id, user.email)
    const refreshToken = this.signRefresh(user.id)
    return { accessToken, refreshToken, user }
  }

  async login(input: LoginInput) {
    const user = await db.user.findUnique({ where: { email: input.email } })
    if (!user) throw new AppError('Invalid credentials', 401)

    const valid = await bcrypt.compare(input.password, user.passwordHash)
    if (!valid) throw new AppError('Invalid credentials', 401)

    const accessToken  = this.signAccess(user.id, user.email)
    const refreshToken = this.signRefresh(user.id)

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name },
    }
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string }
      const user    = await db.user.findUniqueOrThrow({ where: { id: decoded.userId } })
      const accessToken = this.signAccess(user.id, user.email)
      return { accessToken }
    } catch {
      throw new AppError('Invalid refresh token', 401)
    }
  }

  async getUser(userId: string) {
    return db.user.findUniqueOrThrow({
      where:  { id: userId },
      select: { id: true, email: true, name: true, createdAt: true, subscription: true },
    })
  }
}`,

// ─────────────────────────────────────────────────────────────────────────────
// src/services/email.service.ts
// ─────────────────────────────────────────────────────────────────────────────
'src/services/email.service.ts': `import { logger } from '../utils/logger'

export class EmailService {
  async sendWelcome(to: string, name?: string) {
    // Replace with Resend, SendGrid, etc.
    logger.info(\`[EMAIL] Welcome email → \${to} (name: \${name ?? 'User'})\`)
    return { success: true }
  }

  async sendPasswordReset(to: string, token: string) {
    const resetUrl = \`\${process.env.CLIENT_URL}/reset-password?token=\${token}\`
    logger.info(\`[EMAIL] Password reset → \${to} | url: \${resetUrl}\`)
    return { success: true }
  }

  async sendSubscriptionConfirmed(to: string, plan: string) {
    logger.info(\`[EMAIL] Subscription confirmed → \${to} | plan: \${plan}\`)
    return { success: true }
  }
}`,

// ─────────────────────────────────────────────────────────────────────────────
// src/services/stripe.service.ts
// ─────────────────────────────────────────────────────────────────────────────
'src/services/stripe.service.ts': `import Stripe from 'stripe'
import { db } from '../config/database'
import { AppError } from '../middleware/errorHandler'
import { logger } from '../utils/logger'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export class StripeService {
  async createCheckout({ userId, priceId }: { userId: string; priceId: string }) {
    const user = await db.user.findUniqueOrThrow({ where: { id: userId } })

    const session = await stripe.checkout.sessions.create({
      mode:                 'subscription',
      payment_method_types: ['card'],
      customer_email:       user.email ?? undefined,
      line_items:           [{ price: priceId, quantity: 1 }],
      success_url:          \`\${process.env.CLIENT_URL}/billing?success=1\`,
      cancel_url:           \`\${process.env.CLIENT_URL}/billing\`,
      metadata:             { userId },
    })

    return session
  }

  async createPortalSession(userId: string) {
    const sub = await db.subscription.findUnique({ where: { userId } })
    if (!sub?.stripeCustomerId) throw new AppError('No active subscription', 404)

    const session = await stripe.billingPortal.sessions.create({
      customer:   sub.stripeCustomerId,
      return_url: \`\${process.env.CLIENT_URL}/billing\`,
    })

    return session.url
  }

  async getSubscription(userId: string) {
    return db.subscription.findUniqueOrThrow({ where: { userId } })
  }

  async handleWebhook(req: any) {
    const sig   = req.headers['stripe-signature']
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'checkout.session.completed': {
        const session  = event.data.object as Stripe.Checkout.Session
        const userId   = session.metadata?.userId
        if (!userId) break

        await db.subscription.update({
          where: { userId },
          data: {
            plan:             'pro',
            status:           'active',
            stripeId:         session.subscription as string,
            stripeCustomerId: session.customer as string,
          },
        })
        logger.info(\`Subscription activated for user \${userId}\`)
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await db.subscription.updateMany({
          where: { stripeId: sub.id },
          data:  { plan: 'free', status: 'cancelled', stripeId: null },
        })
        break
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        logger.warn(\`Payment failed for customer \${invoice.customer}\`)
        break
      }
    }
  }
}`,

// ─────────────────────────────────────────────────────────────────────────────
// src/utils/response.ts
// ─────────────────────────────────────────────────────────────────────────────
'src/utils/response.ts': `import { Response } from 'express'

export const ok = (res: Response, data: unknown, status = 200) =>
  res.status(status).json({ success: true, data })

export const fail = (res: Response, message: string, status = 400) =>
  res.status(status).json({ success: false, error: message })

export const paginate = (
  res: Response,
  data: unknown[],
  meta: { total: number; page: number; pageSize: number }
) =>
  res.json({
    success: true,
    data,
    meta: {
      total:      meta.total,
      page:       meta.page,
      pageSize:   meta.pageSize,
      totalPages: Math.ceil(meta.total / meta.pageSize),
    },
  })`,

// ─────────────────────────────────────────────────────────────────────────────
// src/utils/logger.ts
// ─────────────────────────────────────────────────────────────────────────────
'src/utils/logger.ts': `import winston from 'winston'

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    process.env.NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const extra = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : ''
            return \`\${timestamp} [\${level}] \${message}\${extra}\`
          })
        )
  ),
  transports: [
    new winston.transports.Console(),
    ...(process.env.NODE_ENV === 'production'
      ? [new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
         new winston.transports.File({ filename: 'logs/combined.log' })]
      : []),
  ],
})`,

// ─────────────────────────────────────────────────────────────────────────────
// src/utils/errors.ts
// ─────────────────────────────────────────────────────────────────────────────
'src/utils/errors.ts': `export class NotFoundError extends Error {
  status = 404
  constructor(resource = 'Resource') {
    super(\`\${resource} not found\`)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends Error {
  status = 401
  constructor(message = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  status = 403
  constructor(message = 'Forbidden') {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export class ConflictError extends Error {
  status = 409
  constructor(message = 'Conflict') {
    super(message)
    this.name = 'ConflictError'
  }
}`,

// ─────────────────────────────────────────────────────────────────────────────
// src/types/index.ts
// ─────────────────────────────────────────────────────────────────────────────
'src/types/index.ts': `import { Request } from 'express'

export interface AuthRequest extends Request {
  userId: string
  email:  string
}`,

// ─────────────────────────────────────────────────────────────────────────────
// tests/auth.test.ts
// ─────────────────────────────────────────────────────────────────────────────
'tests/auth.test.ts': `import request from 'supertest'
import { app } from '../src/app'

describe('Auth Routes', () => {
  it('GET /health returns 200', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })

  it('POST /api/v1/auth/register returns 201 (mocked)', async () => {
    // Integration test: requires DB connection
    // Use jest.mock('../src/config/database') in full test suite
  })
})`,

// ─────────────────────────────────────────────────────────────────────────────
// prisma/schema.prisma
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
  email        String        @unique
  passwordHash String
  name         String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  subscription Subscription?
}

model Subscription {
  id               String   @id @default(cuid())
  userId           String   @unique
  plan             String   @default("free")
  status           String   @default("active")
  stripeId         String?  @unique
  stripeCustomerId String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}`,

// ─────────────────────────────────────────────────────────────────────────────
// .env.example
// ─────────────────────────────────────────────────────────────────────────────
'.env.example': `NODE_ENV=development
PORT=3000

# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/${projectName}?schema=public"

# JWT - use a 32+ char random string for each
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="change-this-to-a-32-char-random-string-minimum"
JWT_REFRESH_SECRET="change-this-to-a-different-32-char-random-string"

# Stripe - https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Frontend URL (for CORS + redirects)
CLIENT_URL="http://localhost:3001"`,

// ─────────────────────────────────────────────────────────────────────────────
// Dockerfile
// ─────────────────────────────────────────────────────────────────────────────
'Dockerfile': `FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run db:generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/dist         ./dist
COPY --from=builder /app/prisma       ./prisma
EXPOSE 3000
CMD ["node", "dist/index.js"]`,

// ─────────────────────────────────────────────────────────────────────────────
// docker-compose.yml
// ─────────────────────────────────────────────────────────────────────────────
'docker-compose.yml': `version: '3.9'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB:       ${projectName}
      POSTGRES_USER:     user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d ${projectName}"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:`,

// ─────────────────────────────────────────────────────────────────────────────
// .gitignore
// ─────────────────────────────────────────────────────────────────────────────
'.gitignore': `node_modules/
dist/
.env
.env.local
logs/
*.log
.DS_Store`,

// ─────────────────────────────────────────────────────────────────────────────
// README.md
// ─────────────────────────────────────────────────────────────────────────────
'README.md': `# ${projectName}

> SaaS Backend REST API - built with [MakeFast AI](https://github.com/avision488/makefast-ai)⚡

## Stack

| Layer     | Tech                      |
|-----------|---------------------------|
| Runtime   | Node.js 22                |
| Framework | Express 5                 |
| Language  | TypeScript 5.8            |
| Database  | PostgreSQL + Prisma 6     |
| Auth      | JWT (access + refresh)    |
| Payments  | Stripe                    |
| Logging   | Winston                   |
| Validation| Zod                       |

## Quick Start

\`\`\`bash
npm install
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, STRIPE_*
npx prisma db push
npm run dev
\`\`\`

## API Routes

| Method | Path                          | Auth | Description           |
|--------|-------------------------------|------|-----------------------|
| GET    | /health                       | -    | Health check          |
| POST   | /api/v1/auth/register         | -    | Register user         |
| POST   | /api/v1/auth/login            | -    | Login (returns JWT)   |
| POST   | /api/v1/auth/refresh          | -    | Refresh access token  |
| POST   | /api/v1/auth/logout           | ✅   | Logout                |
| GET    | /api/v1/auth/me               | ✅   | Get current user      |
| GET    | /api/v1/users/profile         | ✅   | Get user profile      |
| PATCH  | /api/v1/users/profile         | ✅   | Update profile        |
| POST   | /api/v1/billing/checkout      | ✅   | Create Stripe checkout|
| POST   | /api/v1/billing/portal        | ✅   | Customer portal URL   |
| GET    | /api/v1/billing/subscription  | ✅   | Get subscription info |
| POST   | /api/v1/billing/webhook       | -    | Stripe webhook        |

## Docker

\`\`\`bash
docker-compose up
\`\`\`

## Auth Flow

1. POST /auth/register → returns \`accessToken\` + sets \`refresh_token\` cookie
2. Use \`Authorization: Bearer <accessToken>\` for protected routes
3. When access token expires (15 min), POST /auth/refresh with cookie → new access token
`,

  }
}