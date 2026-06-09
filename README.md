<div align="center">
  <h1>🤖 AI SaaS Starter</h1>
  <p><strong>Production-ready Next.js 14 + AI starter kit — ship your SaaS in hours, not weeks</strong></p>

  ![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
  ![Stripe](https://img.shields.io/badge/Stripe-billing-635BFF?style=flat-square&logo=stripe&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
  ![Clerk](https://img.shields.io/badge/Clerk-auth-6C47FF?style=flat-square)
  ![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
</div>

---

## 🎯 What is this?

**AI SaaS Starter** is a fully-wired, production-ready boilerplate for building AI-powered SaaS applications with Next.js 14.

Everything you need is already configured — auth, billing, database, AI integration, and UI. Just clone, customize, and ship.

## ✨ What's included

| Feature | Technology |
|---------|-----------|
| ⚡ Framework | Next.js 14 (App Router + Server Actions) |
| 🔐 Authentication | Clerk (OAuth, Magic Link, MFA) |
| 💳 Billing | Stripe (subscriptions, one-time, usage-based) |
| 🗄️ Database | PostgreSQL + Prisma ORM |
| 🤖 AI | Anthropic Claude API (streaming) |
| 🎨 UI | TailwindCSS + shadcn/ui |
| 📧 Email | Resend |
| 🚀 Deploy | Vercel |

## 🏗 Architecture

```
ai-saas-starter/
├── app/
│   ├── (auth)/              # Sign-in, sign-up pages
│   ├── (dashboard)/
│   │   ├── dashboard/       # Main user dashboard
│   │   ├── settings/        # Account & billing settings
│   │   └── api-keys/        # API key management
│   ├── api/
│   │   ├── webhooks/stripe/ # Stripe webhook handler
│   │   ├── ai/chat/         # Streaming AI endpoint
│   │   └── usage/           # Usage tracking
│   └── marketing/           # Landing page
├── components/
│   ├── ai/                  # AI chat components
│   ├── billing/             # Pricing, checkout
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── ai.ts                # Claude client
│   ├── stripe.ts            # Stripe client + helpers
│   └── prisma.ts            # DB client
└── prisma/
    └── schema.prisma
```

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/wpalish/ai-saas-starter.git
cd ai-saas-starter

# Install
npm install

# Configure env
cp .env.example .env.local
# Fill in your keys (see below)

# Migrate DB
npx prisma migrate dev

# Run
npm run dev
```

## ⚙️ Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Email
RESEND_API_KEY=re_...
```

## 🤖 AI Integration Example

```typescript
// app/api/ai/chat/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { auth } from '@clerk/nextjs/server';

const anthropic = new Anthropic();

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const { messages } = await req.json();

  const stream = await anthropic.messages.stream({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages,
  });

  return new Response(stream.toReadableStream());
}
```

## 💳 Stripe Plans Example

```typescript
// lib/stripe-plans.ts
export const PLANS = {
  FREE: { name: 'Free', credits: 100, price: 0 },
  PRO: { name: 'Pro', credits: 5000, price: 19, priceId: 'price_...' },
  ULTRA: { name: 'Ultra', credits: 50000, price: 79, priceId: 'price_...' },
} as const;
```

## 📦 Key Features in Detail

### 🔐 Auth (Clerk)
- Social login: Google, GitHub, Discord
- Magic link / passwordless
- MFA out of the box
- User management UI built-in

### 💳 Billing (Stripe)
- Subscription management
- Usage-based billing support
- Customer portal (cancel, upgrade, invoices)
- Webhook processing with idempotency

### 🤖 AI (Claude)
- Streaming responses
- Token usage tracking per user
- Rate limiting by plan tier
- Prompt management utilities

## 📄 License

MIT © [Алишер Нурсаин](https://github.com/wpalish)

---

<div align="center">
  <sub>Built with ❤️ in Astana, Kazakhstan 🇰🇿 · Star ⭐ if this helped you!</sub>
</div>
