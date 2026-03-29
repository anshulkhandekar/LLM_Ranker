# LLM Ranker

Simple, polished React app for ranking major LLMs in personal tiers and comparing that against a live average ranking from all site users.

Try It Out: [LLM Ranker](https://adsc-llm-ranker.vercel.app/)

## Stack

- React 19
- Vite
- Tailwind CSS
- `@dnd-kit`
- Supabase Realtime

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create local env vars:

   ```bash
   cp .env.example .env.local
   ```

3. Fill in `.env.local`:

   ```bash
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Run the SQL in [supabase/schema.sql](/Users/anshulkhandekar/LLM_Ranker/llm-tier-list/supabase/schema.sql).

5. Start the app:

   ```bash
   npm run dev
   ```

If the Supabase env vars are missing, the app still works in local-only mode for personal rankings.
