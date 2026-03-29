import openaiLogo from '../LLM Logos/images (1).png';
import mistralLogo from '../LLM Logos/mistral.png';
import copilotLogo from '../LLM Logos/copilot-color.png';
import claudeLogo from '../LLM Logos/claude-color.png';
import perplexityLogo from '../LLM Logos/perplexity-color.png';
import deepseekLogo from '../LLM Logos/deepseek.webp';
import grokLogo from '../LLM Logos/grok.png';
import metaLogo from '../LLM Logos/meta.jpg';
import kimiLogo from '../LLM Logos/images.png';
import geminiLogo from '../LLM Logos/gemini-color.png';

export const TIERS = ['S', 'A', 'B', 'C', 'D', 'F'] as const;

export type TierKey = (typeof TIERS)[number];

export type TierState = Record<TierKey, string[]>;

export type ModelDefinition = {
  id: string;
  label: string;
  maker: string;
  logoSrc?: string;
  accent: string;
  glow: string;
};

export const MODEL_DEFINITIONS: ModelDefinition[] = [
  { id: 'chatgpt-4o', label: 'ChatGPT 4o', maker: 'OpenAI', logoSrc: openaiLogo, accent: 'from-emerald-300 via-emerald-400 to-teal-500', glow: 'shadow-emerald-500/20' },
  { id: 'chatgpt-5', label: 'ChatGPT 5', maker: 'OpenAI', logoSrc: openaiLogo, accent: 'from-emerald-200 via-emerald-400 to-cyan-500', glow: 'shadow-cyan-500/20' },
  { id: 'claude-opus', label: 'Claude Opus', maker: 'Anthropic', logoSrc: claudeLogo, accent: 'from-orange-200 via-orange-300 to-amber-500', glow: 'shadow-amber-500/20' },
  { id: 'claude-sonnet', label: 'Claude Sonnet', maker: 'Anthropic', logoSrc: claudeLogo, accent: 'from-orange-100 via-amber-300 to-yellow-500', glow: 'shadow-orange-500/20' },
  { id: 'gemini', label: 'Gemini', maker: 'Google', logoSrc: geminiLogo, accent: 'from-sky-300 via-violet-400 to-fuchsia-500', glow: 'shadow-fuchsia-500/20' },
  { id: 'llama', label: 'Meta Llama', maker: 'Meta', logoSrc: metaLogo, accent: 'from-blue-300 via-blue-500 to-indigo-600', glow: 'shadow-blue-500/20' },
  { id: 'mistral', label: 'Mistral', maker: 'Mistral AI', logoSrc: mistralLogo, accent: 'from-amber-200 via-orange-400 to-red-500', glow: 'shadow-orange-500/20' },
  { id: 'copilot', label: 'Copilot', maker: 'Microsoft', logoSrc: copilotLogo, accent: 'from-cyan-300 via-blue-400 to-violet-500', glow: 'shadow-sky-500/20' },
  { id: 'deepseek', label: 'DeepSeek', maker: 'DeepSeek', logoSrc: deepseekLogo, accent: 'from-slate-200 via-sky-400 to-blue-600', glow: 'shadow-blue-500/20' },
  { id: 'grok', label: 'Grok', maker: 'xAI', logoSrc: grokLogo, accent: 'from-slate-200 via-slate-400 to-slate-600', glow: 'shadow-slate-500/20' },
  { id: 'perplexity', label: 'Perplexity', maker: 'Perplexity', logoSrc: perplexityLogo, accent: 'from-teal-200 via-emerald-400 to-cyan-500', glow: 'shadow-teal-500/20' },
  { id: 'kimi', label: 'Kimi', maker: 'Moonshot AI', logoSrc: kimiLogo, accent: 'from-pink-200 via-rose-400 to-red-500', glow: 'shadow-rose-500/20' },
];

export const MODEL_IDS = MODEL_DEFINITIONS.map((model) => model.id);

export const MODEL_MAP = Object.fromEntries(MODEL_DEFINITIONS.map((model) => [model.id, model])) as Record<string, ModelDefinition>;

export const DEFAULT_STATE: TierState = {
  S: [],
  A: [],
  B: [],
  C: [],
  D: [],
  F: [],
};

export const EMPTY_STATE: TierState = {
  S: [],
  A: [],
  B: [],
  C: [],
  D: [],
  F: [],
};

export const TIER_LABELS: Record<TierKey, string> = {
  S: 'Best in class',
  A: 'Excellent',
  B: 'Solid daily driver',
  C: 'Situational',
  D: 'Behind the pack',
  F: 'Not for me',
};

export const TIER_COLORS: Record<TierKey, string> = {
  S: 'from-rose-300 via-rose-400 to-red-500',
  A: 'from-orange-200 via-amber-300 to-yellow-400',
  B: 'from-yellow-100 via-lime-200 to-lime-400',
  C: 'from-emerald-100 via-emerald-300 to-teal-500',
  D: 'from-sky-200 via-blue-400 to-indigo-500',
  F: 'from-slate-300 via-slate-400 to-slate-600',
};

export const LOCAL_STORAGE_STATE_KEY = 'llm-ranker.personal-state.v1';
export const LOCAL_STORAGE_USER_KEY = 'llm-ranker.user-id.v1';
