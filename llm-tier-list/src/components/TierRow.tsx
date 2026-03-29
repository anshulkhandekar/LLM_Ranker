import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import { TierCard } from './TierCard';
import { TIER_COLORS, type TierKey } from '../lib/constants';

type TierRowProps = {
  tier: TierKey;
  items: string[];
  interactive?: boolean;
  flash?: boolean;
  highlightedModel?: string | null;
  scoreLabels?: Record<string, string>;
  selectedModelId?: string | null;
  onCardClick?: (modelId: string) => void;
  cardReadonly?: boolean;
  onTierClick?: () => void;
};

export function TierRow({
  tier,
  items,
  interactive = true,
  flash = false,
  highlightedModel,
  scoreLabels,
  selectedModelId,
  onCardClick,
  cardReadonly,
  onTierClick,
}: TierRowProps) {
  const droppable = useDroppable({
    id: tier,
    disabled: !interactive,
  });

  return (
    <section
      onClick={onTierClick}
      className={clsx(
        'grid overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/75 shadow-[0_18px_70px_rgba(3,7,18,0.45)] lg:grid-cols-[120px_minmax(0,1fr)]',
        onTierClick && 'cursor-pointer',
      )}
    >
      <div className={clsx('flex flex-col items-center justify-center gap-1 bg-gradient-to-br px-4 py-6 text-slate-950', TIER_COLORS[tier])}>
        <div className="text-4xl font-black tracking-[0.2em]">{tier}</div>
      </div>

      <div
        ref={droppable.setNodeRef}
        className={clsx(
          'min-h-[140px] border-t border-white/10 px-4 py-4 transition duration-200 lg:border-l lg:border-t-0 lg:px-5',
          interactive && droppable.isOver && 'bg-sky-400/8',
          flash && 'bg-amber-300/[0.06]',
        )}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <div className="grid min-h-[108px] gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.length === 0 ? (
              <div className="flex min-h-[108px] items-center justify-center rounded-[22px] border border-dashed border-white/10 px-4 text-center text-sm text-slate-500">
                {interactive ? 'Drop here' : 'No models yet'}
              </div>
            ) : (
              items.map((item) => (
                <TierCard
                  key={item}
                  id={item}
                  readonly={cardReadonly ?? !interactive}
                  highlight={highlightedModel === item}
                  selected={selectedModelId === item}
                  scoreLabel={scoreLabels?.[item]}
                  onClick={onCardClick ? () => onCardClick(item) : undefined}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </section>
  );
}
