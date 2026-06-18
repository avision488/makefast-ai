# ⚡ Makefast AI

> AI-powered terminal toolkit for developers and founders Developed by Avision488

```
  ███╗   ███╗ █████╗ ██╗  ██╗███████╗███████╗ █████╗ ███████╗████████╗      █████╗ ██╗
  ████╗ ████║██╔══██╗██║ ██╔╝██╔════╝██╔════╝██╔══██╗██╔════╝╚══██╔══╝     ██╔══██╗██║
  ██╔████╔██║███████║█████╔╝ █████╗  █████╗  ███████║███████╗   ██║        ███████║██║
  ██║╚██╔╝██║██╔══██║██╔═██╗ ██╔══╝  ██╔══╝  ██╔══██║╚════██║   ██║        ██╔══██║██║
  ██║ ╚═╝ ██║██║  ██║██║  ██╗███████╗██║     ██║  ██║███████║   ██║        ██║  ██║██║
  ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝  ╚═╝╚══════╝   ╚═╝        ╚═╝  ╚═╝╚═╝
```

[![npm version](https://img.shields.io/npm/v/launchfast-ai.svg?style=flat-square&color=00C9B1)](https://www.npmjs.com/package/makefast-ai)
[![npm downloads](https://img.shields.io/npm/dm/launchfast-ai.svg?style=flat-square&color=00C9B1)](https://www.npmjs.com/package/makefast-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square)](https://nodejs.org)

A premium, cyberpunk-inspired AI CLI for founders who ship fast. Generate startup ideas, write landing copy, get tech stack recommendations, scaffold real projects, and brainstorm with an AI co-founder all from your terminal.

***

## ✨ Features

| Command | Description |
|---|---|
| `makefast idea` | Generate startup ideas for any niche |
| `makefast ui` | Generate premium UI/UX design prompts |
| `makefast copy` | Write conversion-focused landing page copy |
| `makefast brainstorm` | Chat with an AI co-founder |
| `makefast scaffold` | Scaffold real, runnable project boilerplates |
| `makefast stack` | Get tech stack recommendations |
| `makefast roast` | Get your startup idea brutally roasted |
| `makefast history` | Browse and view saved generations |
| `makefast config` | Configure API keys and settings |
| `makefast pitch` | Generate investor-ready pitch deck outlines |
| `makefast tweet` | Create viral launch tweets and threads |
| `makefast name` | Generate brandable startup names + domain ideas |
| `makefast validate` | Stress-test your startup idea with AI market analysis |
| `makefast readme` | Generate beautiful production-ready README.md files |

***

## 🚀 Installation

### Option A npm global install (recommended)

```bash
npm install -g Makefast-ai
```

Then run from anywhere:
```bash
makefast idea
```

### Option B Clone and link

```bash
git clone https://github.com/avision488/Makefast-ai.git
cd Makefast-ai
npm install
npm link
```

### Option C Run directly (no install)

```bash
npx Makefast-ai idea
```

***

## ⚙️ Setup

### 1. Get a Groq API Key (free)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up / log in
3. Create an API key it starts with `gsk_`

### 2. Configure Makefast

**Option A Interactive setup (easiest):**
```bash
makefast config
# Select: Set Groq API Key → paste your key
```

**Option B .env file:**
```bash
cp .env.example .env
# Edit .env:
GROQ_API_KEY=gsk_your_key_here
```

**Option C Environment variable:**
```bash
export GROQ_API_KEY=gsk_your_key_here
makefast idea
```

### 3. Test the connection

```bash
makefast config
# Select: Test API Connection
```

***

## 📖 Command Reference

### `makefast idea`

Generate AI startup ideas for any niche.

```bash
makefast idea
makefast idea --niche "B2B SaaS for restaurants"
makefast idea --niche fintech --count 5
```

### `makefast scaffold`

Scaffold a **real, production-ready** project with actual code not empty files.

```bash
makefast scaffold
makefast scaffold --type nextjs
makefast scaffold --type saas
makefast scaffold --type mobile
makefast scaffold --type api
makefast scaffold --type cli
makefast scaffold --type landing
```

After scaffolding:
```bash
cd my-project
npm install
npm run dev   # App actually runs!
```

**Available templates:**

| Template | Stack | Description |
|---|---|---|
| `nextjs` | Next.js 14, TypeScript, Tailwind, Prisma | Full-stack SaaS starter with auth & payments |
| `saas` | Express, TypeScript, Prisma, Stripe | Backend REST API with auth, billing & caching |
| `api` | Express, TypeScript, Zod, Pino | Minimal REST API with validation & logging |
| `mobile` | Expo, React Native, Redux, Expo Router | Cross-platform mobile app with navigation |
| `cli` | Node.js, Commander, TypeScript | Beautiful terminal CLI tool |
| `landing` | Astro, Tailwind | Static landing page optimized for conversion |

### `makefast ui`

Generate UI/UX design prompts for any screen or app type.

```bash
makefast ui
makefast ui --type "SaaS dashboard"
makefast ui --type "mobile onboarding flow"
```

### `makefast copy`

Generate conversion-focused landing page copy.

```bash
makefast copy
makefast copy --product "AI writing tool for marketers"
```

### `makefast brainstorm`

Interactive multi-turn chat with an AI co-founder. Type `save` to save, `exit` to quit.

```bash
makefast brainstorm
```

### `makefast stack`

Get opinionated tech stack recommendations.

```bash
makefast stack
makefast stack --project "real-time multiplayer game"
```

### `makefast roast`

Get your startup idea brutally, hilariously roasted.

```bash
makefast roast
makefast roast --idea "Airbnb for parking spaces"
```

### `makefast pitch`

Generate investor-ready pitch deck outlines.

```bash
makefast pitch
makefast pitch --idea "AI HR tool for startups"
```

### `makefast tweet`

Generate viral launch tweets and threads.

```bash
makefast tweet
makefast tweet --product "Makefast AI"
```

### `makefast name`

Generate brandable startup names and domain ideas.

```bash
makefast name
makefast name --niche "productivity for developers"
```

### `makefast validate`

Stress-test your startup idea with AI market analysis.

```bash
makefast validate
makefast validate --idea "Notion for restaurants"
```

### `makefast readme`

Auto-generate a production-ready README from your project description.

```bash
makefast readme
```

### `makefast history`

Browse and view all saved AI generations.

```bash
makefast history
makefast history --limit 20
makefast history --clear
```

### `makefast config`

Configure API keys, models, and settings.

```bash
makefast config
```

***

## 🤖 Supported AI Models

All models run on [Groq](https://groq.com) the fastest LLM inference available.

| Model | Best For |
|---|---|
| `llama-3.3-70b-versatile` | Default best quality |
| `llama-3.1-8b-instant` | Fast & cheap |
| `qwen/qwen3-32b` | Long context tasks |
| `openai/gpt-oss-120b` | Most powerful |

Switch models:
```bash
makefast config
# Select: Change AI Model
```

Or via env var:
```bash
GROQ_MODEL=mixtral-8x7b-32768 makefast idea
```

***

## 📂 File Storage

Makefast saves generations locally:

```
~/.makefast/
├── history.json     # All saved generations
├── config.json      # Your settings
├── logs/            # Daily log files
└── cache/           # Cached responses
```

***

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'feat: add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

***

## 📄 License

MIT see [LICENSE](LICENSE)

***

<p align="center">Built by founders, for founders. Ship faster. ⚡</p>
<p align="center">Made with ❤️ by <a href="https://github.com/avision488">Avision488</a></p>
