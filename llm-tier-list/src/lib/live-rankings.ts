import { MODEL_IDS, TIERS, type TierKey, type TierState } from './constants';
import { emptyTierState, scoreForTier, tierForAverageScore } from './tier-state';

export type RankingRow = {
  user_id: string;
  state: TierState;
  updated_at?: string;
};

export type LiveModelStats = {
  id: string;
  votes: number;
  averageScore: number;
  tier: TierKey;
};

export type LiveBoard = {
  state: TierState;
  stats: Record<string, LiveModelStats>;
  submissionCount: number;
};

export const buildLiveBoard = (rows: RankingRow[]): LiveBoard => {
  const board = emptyTierState();
  const stats: Record<string, LiveModelStats> = {};

  for (const modelId of MODEL_IDS) {
    let totalScore = 0;
    let votes = 0;

    for (const row of rows) {
      const tier = TIERS.find((candidate) => row.state[candidate].includes(modelId));

      if (!tier) {
        continue;
      }

      totalScore += scoreForTier(tier);
      votes += 1;
    }

    const averageScore = votes === 0 ? 0 : totalScore / votes;
    const tier = votes === 0 ? 'F' : tierForAverageScore(averageScore);

    stats[modelId] = {
      id: modelId,
      votes,
      averageScore,
      tier,
    };
  }

  const ordered = [...MODEL_IDS].sort((left, right) => {
    const scoreDelta = stats[right].averageScore - stats[left].averageScore;

    if (scoreDelta !== 0) {
      return scoreDelta;
    }

    return stats[right].votes - stats[left].votes;
  });

  for (const modelId of ordered) {
    board[stats[modelId].tier].push(modelId);
  }

  return {
    state: board,
    stats,
    submissionCount: rows.length,
  };
};
