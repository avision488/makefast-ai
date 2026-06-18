'use strict';

module.exports = function getCliFiles(projectName) {
  return {

// ─── package.json ─────────────────────────────────────────────────────────────
'package.json': `{
  "name": "${projectName}",
  "version": "1.0.0",
  "bin": {
    "${projectName}": "./bin/cli.js"
  },
  "scripts": {
    "dev":   "tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test":  "jest --passWithNoTests"
  },
  "dependencies": {
    "commander":       "12.1.0",
    "inquirer":        "9.3.7",
    "chalk":           "5.4.1",
    "ora":             "8.2.0",
    "gradient-string": "3.0.0",
    "fs-extra":        "11.3.0",
    "dotenv":          "16.4.7"
  },
  "devDependencies": {
    "typescript":      "5.8.3",
    "@types/node":     "22.15.21",
    "@types/fs-extra": "11.0.4",
    "@types/inquirer": "9.0.8",
    "tsx":             "4.19.4",
    "jest":            "29.7.0",
    "@types/jest":     "29.5.14",
    "ts-jest":         "29.3.4"
  }
}`,

// ─── tsconfig.json ────────────────────────────────────────────────────────────
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

// ─── bin/cli.js ───────────────────────────────────────────────────────────────
'bin/cli.js': `#!/usr/bin/env node
require('../dist/index.js')`,

// ─── src/index.ts ─────────────────────────────────────────────────────────────
'src/index.ts': `import 'dotenv/config'
import { program }    from 'commander'
import { initCommand } from './commands/init'
import { runCommand }  from './commands/run'

const { version } = require('../package.json')

program
  .name('${projectName}')
  .description('${projectName} CLI')
  .version(version)
  .addHelpCommand(false)

program
  .command('init')
  .description('Initialize a new project')
  .option('-n, --name <name>', 'Project name')
  .action(initCommand)

program
  .command('run')
  .description('Run a task')
  .argument('<task>', 'Task name to run')
  .action(runCommand)

// Show help (exit 0) when no command is given
if (process.argv.length <= 2) {
  program.outputHelp()
  process.exit(0)
}

program.parse()`,

// ─── src/commands/init.ts ─────────────────────────────────────────────────────
'src/commands/init.ts': `import inquirer from 'inquirer'
import chalk    from 'chalk'
import ora      from 'ora'
import fs       from 'fs-extra'
import path     from 'path'

interface InitOptions { name?: string }

export async function initCommand(options: InitOptions) {
  console.log(chalk.bold.cyan('\\n  Initializing project...\\n'))

  const { projectName } = await inquirer.prompt([
    {
      type:     'input',
      name:     'projectName',
      message:  'Project name:',
      default:  options.name || 'my-project',
      validate: (v: string) => /^[a-z0-9-_]+$/i.test(v) || 'Alphanumeric and hyphens only',
    },
  ])

  const spinner = ora('Creating project...').start()

  try {
    await fs.ensureDir(path.resolve(process.cwd(), projectName))
    spinner.succeed(chalk.green(\`Project "\${projectName}" created!\`))
    console.log(chalk.gray(\`\\n  cd \${projectName}\\n\`))
  } catch (err: any) {
    spinner.fail(chalk.red(\`Failed: \${err.message}\`))
    process.exit(1)
  }
}`,

// ─── src/commands/run.ts ──────────────────────────────────────────────────────
'src/commands/run.ts': `import chalk from 'chalk'
import ora   from 'ora'

export async function runCommand(task: string) {
  const spinner = ora(\`Running "\${task}"...\`).start()
  try {
    // TODO: implement task logic here
    await new Promise(r => setTimeout(r, 800))
    spinner.succeed(chalk.green(\`Task "\${task}" completed!\`))
  } catch (err: any) {
    spinner.fail(chalk.red(\`Task "\${task}" failed: \${err.message}\`))
    process.exit(1)
  }
}`,

// ─── src/utils/display.ts ─────────────────────────────────────────────────────
'src/utils/display.ts': `import chalk    from 'chalk'
import gradient from 'gradient-string'

export const display = {
  section(title: string) {
    console.log('\\n' + gradient.cristal(\`  ◆ \${title}\`))
    console.log(chalk.gray('  ' + '─'.repeat(48)))
  },
  ok(msg: string) {
    console.log(chalk.green('  ✓ ') + msg)
  },
  hint(msg: string) {
    console.log(chalk.gray('  → ') + msg)
  },
  showError(msg: string) {
    console.log(chalk.red('  ✗ ') + msg)
  },
}`,

// ─── src/utils/config.ts ──────────────────────────────────────────────────────
'src/utils/config.ts': `import fs   from 'fs-extra'
import path from 'path'
import os   from 'os'

const CONFIG_PATH = path.join(os.homedir(), '.${projectName}', 'config.json')

export async function readConfig(): Promise<Record<string, unknown>> {
  try {
    return await fs.readJson(CONFIG_PATH)
  } catch {
    return {}
  }
}

export async function writeConfig(data: Record<string, unknown>): Promise<void> {
  await fs.ensureDir(path.dirname(CONFIG_PATH))
  await fs.writeJson(CONFIG_PATH, data, { spaces: 2 })
}`,

// ─── src/services/api.service.ts ──────────────────────────────────────────────
'src/services/api.service.ts': `const BASE = process.env.API_URL || 'https://api.example.com'

export async function apiGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(\`\${BASE}\${endpoint}\`)
  if (!res.ok) throw new Error(\`API error \${res.status}: \${res.statusText}\`)
  return res.json() as Promise<T>
}

export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(\`\${BASE}\${endpoint}\`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
  if (!res.ok) throw new Error(\`API error \${res.status}: \${res.statusText}\`)
  return res.json() as Promise<T>
}`,

// ─── tests/cli.test.ts ────────────────────────────────────────────────────────
'tests/cli.test.ts': `describe('CLI', () => {
  it('placeholder test passes', () => {
    expect(true).toBe(true)
  })
})`,

// ─── .env.example ─────────────────────────────────────────────────────────────
'.env.example': `API_URL=https://api.example.com`,

// ─── .gitignore ───────────────────────────────────────────────────────────────
'.gitignore': `node_modules/
dist/
.env
*.log
.DS_Store`,

// ─── README.md ────────────────────────────────────────────────────────────────
'README.md': `# ${projectName}

> Node.js CLI Tool - built with [MakeFast AI](https://github.com/avision488/makefast-ai) ⚡

## Stack

| Layer    | Tech                         |
|----------|------------------------------|
| Runtime  | Node.js 22                   |
| Language | TypeScript 5.8               |
| CLI      | Commander 12 + Inquirer 9    |
| UI       | Chalk 5 + Ora 8 + Gradient   |

## Quick Start

\`\`\`bash
npm install
npm run build
npm link
${projectName} init
${projectName} run <task>
\`\`\`

## Commands

| Command                       | Description          |
|-------------------------------|----------------------|
| \`${projectName} init\`       | Initialize a project |
| \`${projectName} run <task>\` | Run a named task     |
`,

  }
}