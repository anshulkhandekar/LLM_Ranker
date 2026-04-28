import { createClient } from '@supabase/supabase-js';
import type { TierState } from './constants';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

export type PersonalRankingRow = {
  user_id: string;
  state: TierState;
  voted_models?: string[];
  updated_at?: string;
};

export type LlmRequestInsert = {
  requested_name: string;
  requested_by: string;
};

export type LlmRequestStatus =
  | 'pending'
  | 'queued'
  | 'processing'
  | 'rejected'
  | 'failed'
  | 'needs_human'
  | 'ready_for_review';

export type LlmRequestRow = LlmRequestInsert & {
  id: number;
  status: LlmRequestStatus;
  normalized_name?: string | null;
  model_id?: string | null;
  maker?: string | null;
  failure_reason?: string | null;
  attempt_count: number;
  github_run_id?: string | null;
  pr_url?: string | null;
  processed_at?: string | null;
  created_at: string;
  updated_at: string;
};
