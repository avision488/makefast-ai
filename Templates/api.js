'use strict';

module.exports = function getApiFiles(projectName) {
  return {

// ─── package.json ────────────────────────────────────────────────────────────
'package.json': `{
  "name": "${projectName}",
  "version": "1.0.0",
  "scripts": {
    "dev":   "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test":  "jest --passWithNoTests"
  },
  "dependencies": {
    "express": "5.0.1",
    "cors":    "2.8.5",
    "helmet":  "8.0.0",
    "dotenv":  "16.4.7",
    "zod":     "3.24.4",
    "winston": "3.17.0"
  },
  "devDependencies": {
    "typescript":       "5.8.3",
    "@types/express":   "5.0.1",
    "@types/node":      "22.15.21",
    "@types/cors":      "2.8.17",
    "tsx":              "4.19.4",
    "jest":             "29.7.0",
    "@types/jest":      "29.5.14",
    "ts-jest":          "29.3.4",
    "supertest":        "7.1.0",
    "@types/supertest": "6.0.3"
  }
}`,

// ─── tsconfig.json ───────────────────────────────────────────────────────────
'tsconfig.json': `{
  "compilerOptions": {
    "target":                           "ES2022",
    "module":                           "commonjs",
    "lib":                              ["ES2022"],
    "outDir":                           "./dist",
    "rootDir":                          "./src",
    "strict":                           true,
    "esModuleInterop":                  true,
    "skipLibCheck":                     true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule":                true,
    "sourceMap":                        true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}`,

// ─── src/index.ts ─────────────────────────────────────────────────────────────
'src/index.ts': `import 'dotenv/config'
import { app } from './app'
import { logger } from './utils/logger'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  logger.info(\`🚀 Server running on port \${PORT} [\${process.env.NODE_ENV ?? 'development'}]\`)
})`,

// ─── src/app.ts ───────────────────────────────────────────────────────────────
'src/app.ts': `import express from 'express'
import cors    from 'cors'
import helmet  from 'helmet'
import router  from './router'
import { errorHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/logger'

export const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger)

app.use('/api/v1', router)

// 404
app.use((_req, res) => res.status(404).json({ success: false, error: 'Route not found' }))

// Global error handler (must be last)
app.use(errorHandler)`,

// ─── src/router.ts ────────────────────────────────────────────────────────────
'src/router.ts': `import { Router } from 'express'
import healthRoutes from './routes/health'

const router = Router()

router.use('/health', healthRoutes)

// Add more route groups here:
// router.use('/users', userRoutes)

export default router`,

// ─── src/routes/health.ts ─────────────────────────────────────────────────────
'src/routes/health.ts': `import { Router } from 'express'

const router = Router()

router.get('/', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})

export default router`,

// ─── src/controllers/health.controller.ts ────────────────────────────────────
'src/controllers/health.controller.ts': `import { Request, Response } from 'express'

export function getHealth(_req: Request, res: Response) {
  res.json({ status: 'ok', uptime: process.uptime() })
}`,

// ─── src/middleware/errorHandler.ts ───────────────────────────────────────────
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
      error:   'Validation failed',
      details: err.flatten().fieldErrors,
    })
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({ success: false, error: err.message })
  }

  logger.error('Unhandled error', { path: req.path, method: req.method, message: err.message })

  res.status(500).json({ success: false, error: 'Internal server error' })
}`,

// ─── src/middleware/validate.ts ───────────────────────────────────────────────
'src/middleware/validate.ts': `import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) return next(result.error)
    req.body = result.data
    next()
  }
}`,

// ─── src/middleware/logger.ts ─────────────────────────────────────────────────
'src/middleware/logger.ts': `import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()
  res.on('finish', () => {
    logger.info(\`\${req.method} \${req.path} \${res.statusCode} \${Date.now() - start}ms\`)
  })
  next()
}`,

// ─── src/schemas/example.schema.ts ────────────────────────────────────────────
'src/schemas/example.schema.ts': `import { z } from 'zod'

export const exampleSchema = z.object({
  name:    z.string().min(1).max(100),
  message: z.string().min(1),
})

export type ExampleInput = z.infer<typeof exampleSchema>`,

// ─── src/utils/logger.ts ──────────────────────────────────────────────────────
'src/utils/logger.ts': `import winston from 'winston'

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    process.env.NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message }) =>
            \`\${timestamp} [\${level}] \${message}\`
          )
        )
  ),
  transports: [new winston.transports.Console()],
})`,

// ─── src/utils/response.ts ────────────────────────────────────────────────────
'src/utils/response.ts': `import { Response } from 'express'

export const ok   = (res: Response, data: unknown, status = 200) =>
  res.status(status).json({ success: true, data })

export const fail = (res: Response, message: string, status = 400) =>
  res.status(status).json({ success: false, error: message })`,

// ─── src/types/index.ts ───────────────────────────────────────────────────────
'src/types/index.ts': `export interface ApiResponse<T = unknown> {
  success: boolean
  data?:   T
  error?:  string
}`,

// ─── tests/health.test.ts ────────────────────────────────────────────────────
'tests/health.test.ts': `import request from 'supertest'
import { app }  from '../src/app'

describe('Health', () => {
  it('GET /api/v1/health returns 200', async () => {
    const res = await request(app).get('/api/v1/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})`,

// ─── .env.example ─────────────────────────────────────────────────────────────
'.env.example': `NODE_ENV=development
PORT=3000`,

// ─── .gitignore ───────────────────────────────────────────────────────────────
'.gitignore': `node_modules/
dist/
.env
logs/
*.log
.DS_Store`,

// ─── README.md ────────────────────────────────────────────────────────────────
'README.md': `# ${projectName}

> REST API - built with [MakeFast AI](https://github.com/avision488/makefast-ai) ⚡

## Stack

| Layer      | Tech            |
|------------|-----------------|
| Runtime    | Node.js 22      |
| Framework  | Express 5       |
| Language   | TypeScript 5.8  |
| Validation | Zod             |
| Logging    | Winston         |

## Quick Start

\`\`\`bash
npm install
cp .env.example .env
npm run dev
\`\`\`

## Routes

| Method | Path            | Description  |
|--------|-----------------|--------------|
| GET    | /api/v1/health  | Health check |
`,

  }
}