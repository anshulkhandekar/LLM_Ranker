import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import clsx from 'clsx';
import { MODEL_MAP } from '../lib/constants';

type TierCardProps = {
  id: string;
  faded?: boolean;
  highlight?: boolean;
  readonly?: boolean;
  scoreLabel?: string;
  selected?: boolean;
  onClick?: () => void;
};

export function TierCard({
  id,
  faded = false,
  highlight = false,
  readonly = false,
  scoreLabel,
  selected = false,
  onClick,
}: TierCardProps) {
  const model = MODEL_MAP[id];

  if (!model) {
    return null;
  }

  const sortable = useSortable({
    id,
    disabled: readonly,
  });

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable;

  return (
    <button
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={clsx(
        'w-full cursor-default rounded-[20px] bg-transparent text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60',
        !readonly && 'cursor-grab active:cursor-grabbing',
      )}
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      {...attributes}
      {...listeners}
    >
      <TierCardBody id={id} faded={faded} highlight={highlight} selected={selected} isDragging={isDragging} scoreLabel={scoreLabel} />
    </button>
  );
}

type TierCardBodyProps = {
  id: string;
  faded?: boolean;
  highlight?: boolean;
  selected?: boolean;
  isDragging?: boolean;
  scoreLabel?: string;
};

export function TierCardBody({
  id,
  faded = false,
  highlight = false,
  selected = false,
  isDragging = false,
  scoreLabel,
}: TierCardBodyProps) {
  const model = MODEL_MAP[id];

  if (!model) {
    return null;
  }

  return (
    <div
      className={clsx(
        'group w-full rounded-[20px] border border-white/10 bg-white/[0.05] px-3.5 py-3 text-left shadow-lg backdrop-blur transition duration-200',
        isDragging && 'scale-[1.02] border-sky-300/70 bg-slate-950/95 shadow-2xl',
        faded && 'opacity-55',
        highlight && 'animate-pulse-glow border-amber-300/60',
        selected && 'border-sky-300/70 bg-sky-400/10 shadow-sky-500/20',
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            'grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white text-slate-950 shadow-md',
            model.accent,
          )}
          aria-hidden="true"
        >
          {model.logoSrc ? (
            <img src={model.logoSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-slate-900">{model.maker.slice(0, 1)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-white sm:text-[15px]">{model.label}</div>
          <div className="truncate text-xs text-slate-400">{model.maker}</div>
        </div>
        {scoreLabel ? <div className="rounded-full bg-white/8 px-2.5 py-1 text-xs font-medium text-slate-200">{scoreLabel}</div> : null}
      </div>
    </div>
  );
}
