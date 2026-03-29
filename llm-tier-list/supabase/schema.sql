create table if not exists public.personal_rankings (
  user_id text primary key,
  state jsonb not null default '{"S":[],"A":[],"B":[],"C":[],"D":[],"F":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists personal_rankings_set_updated_at on public.personal_rankings;

create trigger personal_rankings_set_updated_at
before update on public.personal_rankings
for each row
execute function public.set_updated_at();

alter table public.personal_rankings enable row level security;

drop policy if exists "anon can read personal rankings" on public.personal_rankings;
create policy "anon can read personal rankings"
on public.personal_rankings
for select
to anon
using (true);

drop policy if exists "anon can insert personal rankings" on public.personal_rankings;
create policy "anon can insert personal rankings"
on public.personal_rankings
for insert
to anon
with check (true);

drop policy if exists "anon can update personal rankings" on public.personal_rankings;
create policy "anon can update personal rankings"
on public.personal_rankings
for update
to anon
using (true)
with check (true);

create or replace view public.live_model_rankings as
with tier_scores as (
  select
    user_id,
    key as tier,
    value as model_id,
    case key
      when 'S' then 6
      when 'A' then 5
      when 'B' then 4
      when 'C' then 3
      when 'D' then 2
      else 1
    end as score
  from public.personal_rankings
  cross join lateral jsonb_each(state)
  cross join lateral jsonb_array_elements_text(value)
)
select
  model_id,
  round(avg(score)::numeric, 2) as average_score,
  count(*) as votes
from tier_scores
group by model_id
order by average_score desc, votes desc, model_id asc;

grant select on public.live_model_rankings to anon;

do $$
begin
  alter publication supabase_realtime add table public.personal_rankings;
exception
  when duplicate_object then null;
end;
$$;
