# Codebase Investigator

AI-powered codebase investigator with:
- GitHub repo ingestion
- Retrieval-based investigation
- Independent audit pass
- Multi-turn memory
- Line-level citations

## Stack

Frontend:
- Next.js
- Tailwind

Backend:
- Fastify
- OpenAI
- tree-sitter

## Run Locally

### Install

```bash
pnpm install
```

### Backend

```bash
cd apps/api
pnpm install
pnpm dev
```

### Frontend

```bash
cd apps/web
pnpm install
pnpm dev
```

## Environment

Create:

apps/api/.env

```bash
OPENAI_API_KEY=your_key
DATABASE_URL=./investigator.db
REPO_STORAGE_PATH=./repos
```
