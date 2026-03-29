# LLM Ranker

Simple, polished React app for ranking major LLMs in personal tiers and comparing that against a live average ranking from all site users.

## What changed

- `Local` tab for each user's personal tier list
- `Live` tab for the crowd average across submitted personal boards
- Drag-and-drop bench at the bottom so models can be pulled into tiers
- Branded model cards for ChatGPT, Claude, Gemini, Llama, Mistral, Copilot, DeepSeek, Grok, Perplexity, and Kimi
- Local browser persistence plus optional Supabase sync

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

## Supabase setup

Open the SQL editor in Supabase and run [supabase/schema.sql](/Users/anshulkhandekar/LLM_Ranker/llm-tier-list/supabase/schema.sql).

That script creates:

- `public.personal_rankings`
- `updated_at` trigger logic
- RLS policies for anonymous read/write
- `public.live_model_rankings` view for inspecting aggregate scores in SQL
- Realtime publication for `personal_rankings`

After running the SQL:

1. Confirm the project URL and anon key are copied into `.env.local`.
2. In Supabase, make sure Realtime is enabled for the `public.personal_rankings` table.
3. Open the app in two browser windows to verify the `Live` tab updates after saving a personal ranking.

## Deployment on Vercel

1. Push the project to GitHub or import the local folder directly.
2. In Vercel, create a new project pointing at `/Users/anshulkhandekar/LLM_Ranker/llm-tier-list`.
3. Set these environment variables in Vercel:

   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. Use the default Vite settings:

   - Build command: `npm run build`
   - Output directory: `dist`

5. Deploy.

If you use the Vercel dashboard import flow, no custom `vercel.json` is required for this app.

## Data model

Each visitor gets a browser-local `user_id`. Their personal board is saved in `public.personal_rankings` as one row:

```json
{
  "user_id": "browser-generated-uuid",
  "state": {
    "S": ["chatgpt-5", "claude-opus"],
    "A": ["chatgpt-4o", "claude-sonnet"],
    "B": ["gemini"],
    "C": [],
    "D": [],
    "F": ["grok"]
  }
}
```

The `Live` tab averages tier scores across all submitted rows and groups each model into a live tier.

## Main files

- [src/App.tsx](/Users/anshulkhandekar/LLM_Ranker/llm-tier-list/src/App.tsx): app shell, tabs, drag/drop flow, Supabase sync
- [src/components/TierCard.tsx](/Users/anshulkhandekar/LLM_Ranker/llm-tier-list/src/components/TierCard.tsx): branded model cards
- [src/components/TierRow.tsx](/Users/anshulkhandekar/LLM_Ranker/llm-tier-list/src/components/TierRow.tsx): tier lane rendering for local and live boards
- [src/lib/constants.ts](/Users/anshulkhandekar/LLM_Ranker/llm-tier-list/src/lib/constants.ts): model catalog and tier metadata
- [src/lib/live-rankings.ts](/Users/anshulkhandekar/LLM_Ranker/llm-tier-list/src/lib/live-rankings.ts): average-score aggregation
- [src/lib/supabase.ts](/Users/anshulkhandekar/LLM_Ranker/llm-tier-list/src/lib/supabase.ts): Supabase client setup
- [supabase/schema.sql](/Users/anshulkhandekar/LLM_Ranker/llm-tier-list/supabase/schema.sql): SQL schema and policies
