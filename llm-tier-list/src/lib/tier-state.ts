import { DEFAULT_STATE, EMPTY_STATE, MODEL_IDS, TIERS, type TierKey, type TierState } from './constants';

export const normalizeTierState = (candidate?: Partial<Record<TierKey, string[]>> | null): TierState => {
  const seen = new Set<string>();

  return TIERS.reduce((state, tier) => {
    const source = Array.isArray(candidate?.[tier]) ? candidate?.[tier] ?? [] : [];
    const items = source.filter((item): item is string => typeof item === 'string' && MODEL_IDS.includes(item));

    state[tier] = items.filter((item) => {
      if (seen.has(item)) {
        return false;
      }

      seen.add(item);
      return true;
    });

    return state;
  }, {} as TierState);
};

export const getUnrankedModels = (state: TierState): string[] =>
  MODEL_IDS.filter((model) => !Object.values(state).some((tierItems) => tierItems.includes(model)));

export const moveModel = (
  state: TierState,
  model: string,
  destination: TierKey | 'UNRANKED',
  index?: number,
): TierState => {
  const next = TIERS.reduce((acc, tier) => {
    acc[tier] = state[tier].filter((item) => item !== model);
    return acc;
  }, {} as TierState);

  if (destination === 'UNRANKED') {
    return next;
  }

  const target = [...next[destination]];
  const safeIndex = typeof index === 'number' ? Math.min(Math.max(index, 0), target.length) : target.length;
  target.splice(safeIndex, 0, model);
  next[destination] = target;

  return next;
};

export const reorderModels = (state: TierState, tier: TierKey, fromIndex: number, toIndex: number): TierState => {
  const items = [...state[tier]];
  const [moved] = items.splice(fromIndex, 1);

  if (!moved) {
    return state;
  }

  items.splice(toIndex, 0, moved);

  return {
    ...state,
    [tier]: items,
  };
};

export const hasStateChanged = (left: TierState, right: TierState) =>
  TIERS.some((tier) => left[tier].join('|') !== right[tier].join('|'));

export const createDefaultState = () => normalizeTierState(DEFAULT_STATE);

export const emptyTierState = () => normalizeTierState(EMPTY_STATE);

export const scoreForTier = (tier: TierKey) => {
  switch (tier) {
    case 'S':
      return 6;
    case 'A':
      return 5;
    case 'B':
      return 4;
    case 'C':
      return 3;
    case 'D':
      return 2;
    case 'F':
      return 1;
  }
};

export const tierForAverageScore = (score: number): TierKey => {
  if (score >= 5.5) return 'S';
  if (score >= 4.5) return 'A';
  if (score >= 3.5) return 'B';
  if (score >= 2.5) return 'C';
  if (score >= 1.5) return 'D';
  return 'F';
};
