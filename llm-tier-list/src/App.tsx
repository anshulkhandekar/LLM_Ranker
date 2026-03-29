import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import clsx from 'clsx';
import { TierCard, TierCardBody } from './components/TierCard';
import { TierRow } from './components/TierRow';
import {
  MODEL_MAP,
  LOCAL_STORAGE_STATE_KEY,
  LOCAL_STORAGE_USER_KEY,
  TIERS,
  type TierKey,
  type TierState,
} from './lib/constants';
import { buildLiveBoard, type RankingRow } from './lib/live-rankings';
import {
  createDefaultState,
  getUnrankedModels,
  hasStateChanged,
  moveModel,
  normalizeTierState,
  reorderModels,
} from './lib/tier-state';
import { isSupabaseConfigured, supabase, type PersonalRankingRow } from './lib/supabase';

const presenceChannelName = 'room:llm-ranker-presence';
const rankingsChannelName = 'room:llm-ranker-rankings';
const FLASH_TIMEOUT_MS = 1400;
const UNRANKED = 'UNRANKED' as const;

type TabKey = 'local' | 'live';

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('local');
  const [localState, setLocalState] = useState<TierState>(createDefaultState);
  const [allRankings, setAllRankings] = useState<RankingRow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDragSize, setActiveDragSize] = useState<{ width: number; height: number } | null>(null);
  const [connectedCount, setConnectedCount] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [flashTiers, setFlashTiers] = useState<TierKey[]>([]);
  const [highlightedModel, setHighlightedModel] = useState<string | null>(null);
  const [selectedMobileModelId, setSelectedMobileModelId] = useState<string | null>(null);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const dragStartStateRef = useRef<TierState>(createDefaultState());
  const flashTimerRef = useRef<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  useEffect(() => {
    const storedState = window.localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
    const storedUserId = window.localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    const nextUserId = storedUserId ?? crypto.randomUUID();

    if (!storedUserId) {
      window.localStorage.setItem(LOCAL_STORAGE_USER_KEY, nextUserId);
    }

    setUserId(nextUserId);

    if (storedState) {
      try {
        setLocalState(normalizeTierState(JSON.parse(storedState) as TierState));
      } catch {
        window.localStorage.removeItem(LOCAL_STORAGE_STATE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_STATE_KEY, JSON.stringify(localState));
  }, [localState]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const syncLayoutMode = () => setIsMobileLayout(mediaQuery.matches);

    syncLayoutMode();
    mediaQuery.addEventListener('change', syncLayoutMode);

    return () => {
      mediaQuery.removeEventListener('change', syncLayoutMode);
    };
  }, []);

  const liveBoard = useMemo(() => buildLiveBoard(allRankings), [allRankings]);
  const unrankedModels = useMemo(() => getUnrankedModels(localState), [localState]);

  const liveScoreLabels = useMemo(
    () =>
      Object.fromEntries(
        Object.values(liveBoard.stats).map((stat) => [
          stat.id,
          stat.votes > 0 ? `${stat.averageScore.toFixed(1)} avg` : 'No votes',
        ]),
      ),
    [liveBoard.stats],
  );

  const flashRows = (tiers: TierKey[], model?: string | null) => {
    if (tiers.length === 0) {
      return;
    }

    setFlashTiers(tiers);
    setHighlightedModel(model ?? null);

    if (flashTimerRef.current) {
      window.clearTimeout(flashTimerRef.current);
    }

    flashTimerRef.current = window.setTimeout(() => {
      setFlashTiers([]);
      setHighlightedModel(null);
    }, FLASH_TIMEOUT_MS);
  };

  useEffect(() => {
    const client = supabase;

    if (!client || !userId) {
      setIsReady(true);
      return;
    }

    let mounted = true;

    const loadRankings = async () => {
      const { data, error } = await client.from('personal_rankings').select('user_id, state, updated_at');

      if (!mounted) {
        return;
      }

      if (error) {
        setSaveError(error.message);
        setIsReady(true);
        return;
      }

      const rows = (data as PersonalRankingRow[] | null)?.map((row) => ({
        ...row,
        state: normalizeTierState(row.state),
      })) ?? [];

      setAllRankings(rows);

      const mine = rows.find((row) => row.user_id === userId);

      if (mine) {
        setLocalState(mine.state);
      }

      setIsReady(true);
    };

    void loadRankings();

    const rankingsChannel = client
      .channel(rankingsChannelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'personal_rankings',
        },
        () => {
          void loadRankings();
        },
      )
      .subscribe();

    const presenceChannel = client.channel(presenceChannelName, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        setConnectedCount(Object.keys(state).length || 1);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            joinedAt: new Date().toISOString(),
          });
        }
      });

    return () => {
      mounted = false;

      if (flashTimerRef.current) {
        window.clearTimeout(flashTimerRef.current);
      }

      void client.removeChannel(rankingsChannel);
      void client.removeChannel(presenceChannel);
    };
  }, [userId]);

  const persistRanking = async (nextState: TierState, previousState: TierState, modelId: string | null) => {
    setLocalState(nextState);
    setSaveError(null);
    flashRows(TIERS.filter((tier) => previousState[tier].join('|') !== nextState[tier].join('|')), modelId);

    const client = supabase;

    if (!client || !userId) {
      setAllRankings((current) => upsertLocalRanking(current, userId || 'local-demo', nextState));
      return;
    }

    setIsSaving(true);

    const { error } = await client.from('personal_rankings').upsert(
      {
        user_id: userId,
        state: nextState,
      },
      {
        onConflict: 'user_id',
      },
    );

    setIsSaving(false);

    if (error) {
      setSaveError(error.message);
      return;
    }

    setAllRankings((current) => upsertLocalRanking(current, userId, nextState));
  };

  const locateContainerInState = (state: TierState, id: string): TierKey | typeof UNRANKED | null => {
    if (id === UNRANKED || TIERS.includes(id as TierKey)) {
      return id as TierKey | typeof UNRANKED;
    }

    if (getUnrankedModels(state).includes(id)) {
      return UNRANKED;
    }

    const match = TIERS.find((tier) => state[tier].includes(id));
    return match ?? null;
  };

  const getDropTarget = (state: TierState, overId: string) => {
    const destination = locateContainerInState(state, overId);

    if (!destination) {
      return null;
    }

    if (destination === UNRANKED || TIERS.includes(overId as TierKey) || overId === UNRANKED) {
      return { destination, index: undefined as number | undefined };
    }

    return {
      destination,
      index: state[destination].findIndex((item) => item === overId),
    };
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    dragStartStateRef.current = localState;
    setActiveId(String(active.id));
    const initialRect = active.rect.current.initial;

    setActiveDragSize(
      initialRect
        ? {
            width: initialRect.width,
            height: initialRect.height,
          }
        : null,
    );
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) {
      return;
    }

    const activeItem = String(active.id);
    const activeContainer = locateContainerInState(localState, activeItem);
    const overId = String(over.id);
    const dropTarget = getDropTarget(localState, overId);
    const overContainer = dropTarget?.destination ?? null;

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setLocalState(moveModel(localState, activeItem, overContainer, dropTarget?.index));
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    const activeItem = String(active.id);
    setActiveId(null);
    setActiveDragSize(null);

    if (!over) {
      setLocalState(dragStartStateRef.current);
      return;
    }

    const overId = String(over.id);
    const baseState = dragStartStateRef.current;
    const activeContainer = locateContainerInState(baseState, activeItem);
    const dropTarget = getDropTarget(localState, overId);
    const destination = dropTarget?.destination ?? null;

    if (!destination || !activeContainer) {
      setLocalState(dragStartStateRef.current);
      return;
    }

    let nextState = baseState;

    if (activeContainer === destination && destination !== UNRANKED) {
      const currentIndex = baseState[destination].findIndex((item) => item === activeItem);
      const targetIndex =
        typeof dropTarget?.index === 'number' && dropTarget.index >= 0 ? dropTarget.index : baseState[destination].length - 1;

      nextState = reorderModels(baseState, destination, currentIndex, targetIndex);
    } else {
      nextState = moveModel(baseState, activeItem, destination, dropTarget?.index);
    }

    if (!hasStateChanged(baseState, nextState)) {
      return;
    }

    await persistRanking(nextState, baseState, activeItem);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveDragSize(null);
    setLocalState(dragStartStateRef.current);
  };

  const handleMobilePlacement = async (destination: TierKey | typeof UNRANKED) => {
    if (!selectedMobileModelId) {
      return;
    }

    const nextState = moveModel(localState, selectedMobileModelId, destination);

    if (!hasStateChanged(localState, nextState)) {
      return;
    }

    await persistRanking(nextState, localState, selectedMobileModelId);
    setSelectedMobileModelId(null);
  };

  return (
    <div className="min-h-screen bg-[#07111e] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-8%] h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-[-6%] top-[12%] h-80 w-80 rounded-full bg-sky-500/14 blur-3xl" />
        <div className="absolute bottom-[-12%] left-[24%] h-80 w-80 rounded-full bg-amber-400/12 blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">Rank Your Favorite LLMs</div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200">
              {connectedCount} users online
            </div>
          </div>
          <div className="flex gap-3">
            <TabButton active={activeTab === 'local'} onClick={() => setActiveTab('local')}>
              Local
            </TabButton>
            <TabButton active={activeTab === 'live'} onClick={() => setActiveTab('live')}>
              Live
            </TabButton>
          </div>
        </header>

        <section className="mt-6 rounded-[34px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_30px_100px_rgba(2,8,23,0.55)] backdrop-blur">
          {activeTab === 'local' ? (
              <DndContext
                collisionDetection={(args) => {
                  const pointerCollisions = pointerWithin(args);
                  return pointerCollisions.length > 0 ? pointerCollisions : closestCenter(args);
                }}
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={(event) => {
                  void handleDragEnd(event);
                }}
                onDragCancel={handleDragCancel}
              >
                <div className="space-y-4">
                  {isMobileLayout ? (
                    <section className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4 md:hidden">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm text-slate-300">
                          {selectedMobileModelId ? `Selected: ${MODEL_MAP[selectedMobileModelId]?.label ?? selectedMobileModelId}` : 'Tap a model, then tap a tier'}
                        </div>
                        {selectedMobileModelId ? (
                          <button
                            type="button"
                            onClick={() => setSelectedMobileModelId(null)}
                            className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300"
                          >
                            Clear
                          </button>
                        ) : null}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {TIERS.map((tier) => (
                          <button
                            key={tier}
                            type="button"
                            disabled={!selectedMobileModelId}
                            onClick={() => {
                              void handleMobilePlacement(tier);
                            }}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {tier}
                          </button>
                        ))}
                        <button
                          type="button"
                          disabled={!selectedMobileModelId}
                          onClick={() => {
                            void handleMobilePlacement(UNRANKED);
                          }}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Bench
                        </button>
                      </div>
                    </section>
                  ) : null}

                  {TIERS.map((tier) => (
                    <TierRow
                      key={tier}
                      tier={tier}
                      items={localState[tier]}
                      interactive
                      flash={flashTiers.includes(tier)}
                      highlightedModel={highlightedModel}
                      selectedModelId={selectedMobileModelId}
                      onCardClick={isMobileLayout ? setSelectedMobileModelId : undefined}
                      cardReadonly={isMobileLayout}
                    />
                  ))}
                </div>

                <section className="mt-5 rounded-[30px] border border-dashed border-white/12 bg-slate-950/60 p-4">
                  <BenchDropzone className={clsx('mt-4 rounded-[24px] border border-white/8 bg-black/20 p-3 transition', activeId && 'border-sky-300/30')}>
                    <SortableContext items={unrankedModels} strategy={rectSortingStrategy}>
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {unrankedModels.length === 0 ? (
                          <div className="flex min-h-[96px] items-center justify-center rounded-[22px] border border-dashed border-white/10 px-4 text-center text-sm text-slate-500">
                            Every model is placed on your board.
                          </div>
                        ) : (
                          unrankedModels.map((item) => (
                            <TierCard
                              key={item}
                              id={item}
                              readonly={isMobileLayout}
                              highlight={highlightedModel === item}
                              selected={selectedMobileModelId === item}
                              onClick={isMobileLayout ? () => setSelectedMobileModelId(item) : undefined}
                            />
                          ))
                        )}
                      </div>
                    </SortableContext>
                  </BenchDropzone>
                </section>

                <DragOverlay>
                  {activeId ? (
                    <div
                      style={{
                        width: activeDragSize?.width,
                        height: activeDragSize?.height,
                      }}
                    >
                      <TierCardBody id={activeId} faded />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            ) : (
              <div className="space-y-4">
                {TIERS.map((tier) => (
                  <TierRow key={tier} tier={tier} items={liveBoard.state[tier]} interactive={false} scoreLabels={liveScoreLabels} />
                ))}
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default App;

function BenchDropzone({ className, children }: { className?: string; children: ReactNode }) {
  const droppable = useDroppable({
    id: UNRANKED,
  });

  return (
    <div ref={droppable.setNodeRef} className={clsx(className, droppable.isOver && 'bg-sky-400/10')}>
      {children}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'rounded-full px-4 py-2 text-sm font-semibold transition',
        active ? 'bg-white text-slate-950' : 'border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]',
      )}
    >
      {children}
    </button>
  );
}

function upsertLocalRanking(rows: RankingRow[], userId: string, state: TierState): RankingRow[] {
  const nextRow: RankingRow = {
    user_id: userId,
    state,
    updated_at: new Date().toISOString(),
  };

  const withoutMine = rows.filter((row) => row.user_id !== userId);
  return [...withoutMine, nextRow];
}
