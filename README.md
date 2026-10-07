<div align="center">
  <img src="./public/logo.svg" alt="Finance Hub logo" width="320" />

  <h1>Finance Hub</h1>

  <p><strong>A modern personal finance management dashboard.</strong><br/>
  Track expenses, income, bills, credit card invoices, investments and crypto — with AI-driven monthly reports.</p>

  <p>
    <strong>Live demo:</strong>
    <a href="https://www.fnchub.site/">fnchub.site</a>
    ·
    <a href="https://finance-hub-indol.vercel.app/login">finance-hub-indol.vercel.app</a>
  </p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
    <img alt="Node.js" src="https://img.shields.io/badge/Node.js-24-5FA04E?logo=nodedotjs&logoColor=white" />
    <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?logo=postgresql&logoColor=white" />
    <img alt="Groq" src="https://img.shields.io/badge/AI-Groq%20·%20gpt--oss--120b-F55036" />
  </p>
</div>

---

## About

**Finance Hub** is a financial management dashboard where users can take full control of
their money in one place. It was built as my **TCC (Trabalho de Conclusão de Curso / Bachelor's
final project)**.

Users log transactions, bills, credit card invoices and crypto trades, then follow everything
through charts and metrics. On top of the raw data, the app generates **AI-driven monthly
reports** that point out exactly where the money went and where it is possible to save, and
offers a full **crypto section** with portfolio tracking, market data and an investment simulator.

## Features

### Dashboard
- Monthly summary: balance, invested, income, expenses and open credit card invoices.
- Income/expense/investment split, weekly income vs. expenses chart and spending by category.
- Latest transactions of the selected month.
- **Investment goal** stored per user, with a progress bar (available on every device).
- Optional: deduct open credit card invoices from the current month balance.

### Transactions & bills
- Record deposits, expenses and investments with **27 categories** (groceries, dining,
  subscriptions, travel, freelance, investment income…) and payment methods (PIX, credit/debit
  card, bank transfer, bank slip, cash).
- Track paid, open and expired bills with due dates.
- Dialogs with type/status cards and **searchable selects** for category and payment method.
- Instant search by name, type or status, category, payment method, amount or date.
- Tables on desktop and a card list (grouped by day) on mobile.

### Credit card invoices
- Register multiple cards with color, closing day, due day and optional limit.
- Keep the open invoice amount up to date and see the billing cycle status, due date countdown
  and limit usage.
- Pay an invoice (full or partial): the payment is added to the history and recorded as an
  expense transaction.

### Crypto
- **Portfolio** — register buys and sells (optionally as transactions) and follow current value,
  average cost, realized and unrealized profit/loss, 24h change and allocation. Prices come live
  from CoinGecko (cached for 5 minutes).
- **Market** — search, top gainers and losers, BRL prices, market cap, volume and 7-day sparklines
  for the top 200 coins.
- **Coin details** — price chart (7D, 30D, 90D, 1Y), stats and your position in the coin.
- **Favorites** — star coins to pin them at the top of the market tab.
- **Simulator** — "what if I had invested?" with monthly contributions or a lump sum over the
  last 3, 6 or 12 months.

### AI monthly report
- Powered by **Groq** (`openai/gpt-oss-120b`) through its OpenAI-compatible API.
- The server precomputes the month summary (totals and month-over-month change, spending by
  category and by description, top expenses, possible duplicates, bills, invoices and goal
  progress); the model only interprets it, so every number in the report is accurate.
- The report lists where the money went, concrete savings with the estimated amount per month,
  points of attention and goals for the next month.
- Only the month summary is sent to the AI, with no account identifiers.

### Experience
- Dark glassmorphism UI, animated login page and vector logo.
- Skeleton loading states and parallel data fetching for fast navigation.
- Responsive layout for mobile and desktop.
- Authentication and user management via Clerk.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Framework** | [Next.js 14](https://nextjs.org) (App Router, Server Actions) · [React 18](https://react.dev) · [TypeScript](https://www.typescriptlang.org) · Node.js 24 |
| **Styling / UI** | [Tailwind CSS](https://tailwindcss.com) · [shadcn/ui](https://ui.shadcn.com) · [Radix UI](https://www.radix-ui.com) · [Lucide Icons](https://lucide.dev) |
| **Database / ORM** | [PostgreSQL](https://www.postgresql.org) ([Neon](https://neon.tech)) · [Prisma](https://www.prisma.io) |
| **Authentication** | [Clerk](https://clerk.com) |
| **AI** | [Groq](https://groq.com) (`openai/gpt-oss-120b`) via the [OpenAI SDK](https://github.com/openai/openai-node) |
| **Charts** | [Recharts](https://recharts.org) |
| **Forms & validation** | [React Hook Form](https://react-hook-form.com) · [Zod](https://zod.dev) |
| **Tables** | [TanStack Table](https://tanstack.com/table) |
| **External data** | [CoinGecko API](https://www.coingecko.com/en/api) |
| **Deployment** | [Vercel](https://vercel.com) (with scheduled Cron Jobs) |

## Architecture

Finance Hub is a **full-stack Next.js application** — there is no separate backend service.
The App Router handles both the UI and the server-side logic in a single codebase, deployed
together on Vercel.

```
Browser (React components)
        │
Next.js server  ──  Server Components + Server Actions + Route Handlers   ← backend layer
        │
Prisma  ──  PostgreSQL          + external APIs (Groq, CoinGecko)
```

- **Server Components** load page data directly from the database, in parallel.
- **Server Actions** (`"use server"`) handle mutations: transactions, bills, credit cards and
  invoice payments, crypto trades and favorites, user settings and AI reports.
- **Route Handlers** (`app/api/*`) expose HTTP endpoints, including the scheduled cron job.
- **Prisma** models `Transaction`, `Bills`, `CreditCard`, `InvoicePayment`, `UserSettings`,
  `CryptoTrade`, `CryptoFavorite`, `Cryptos` and `CryptoCharts`.
- A **Vercel Cron Job** (`/api/cron`) refreshes crypto prices every day with a single CoinGecko
  call, appends the daily price to the stored history and backfills missing histories in batches.
  It is protected by `CRON_SECRET`.

## Getting Started

**Requirements:** Node.js 24 (see `.nvmrc`) and a PostgreSQL database.

1. Install the dependencies:
   ```bash
   yarn install
   ```
2. Create a `.env` file based on `.env.example`:

   | Variable | Description |
   | --- | --- |
   | `DATABASE_URL` | PostgreSQL connection string |
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Clerk application keys |
   | `GROQ_API_KEY` | Groq API key for the AI report |
   | `GECKO_API_KEY` | CoinGecko demo API key |
   | `CRON_SECRET` | Secret sent by Vercel Cron in the `Authorization` header |

3. Apply the database migrations:
   ```bash
   npx prisma migrate deploy
   ```
4. Start the development server:
   ```bash
   yarn dev
   ```

The app runs at [http://localhost:3000](http://localhost:3000). Crypto data is loaded by the
`/api/cron` route, which runs daily on Vercel and can also be called manually.

---

<div align="center">
  Made with ☕ by <strong>ArturCx</strong>
</div>
