// Supabase Management API で SQL を実行する一発スクリプト
// 使い方: node --env-file=.env.local scripts/apply-schema.mjs
//
// 必要な env:
//   SUPABASE_ACCESS_TOKEN  Personal Access Token (sbp_...)
//   SUPABASE_PROJECT_REF   Optional. デフォルトは下の REF 定数

const PAT = process.env.SUPABASE_ACCESS_TOKEN;
const REF = process.env.SUPABASE_PROJECT_REF || "axddcekekdejbckeppww";

if (!PAT) {
  console.error(
    "SUPABASE_ACCESS_TOKEN が未設定です。.env.local に設定して " +
      "`node --env-file=.env.local scripts/apply-schema.mjs` で実行してください。",
  );
  process.exit(1);
}

const SQL = String.raw`
-- 1. users
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  display_name text not null,
  avatar_color text not null default '#1164A3',
  status text not null default 'active' check (status in ('active','away','offline')),
  created_at timestamptz not null default now()
);
alter table public.users enable row level security;
drop policy if exists "users_select_authenticated" on public.users;
create policy "users_select_authenticated" on public.users for select to authenticated using (true);
drop policy if exists "users_insert_self" on public.users;
create policy "users_insert_self" on public.users for insert to authenticated with check (auth.uid() = id);
drop policy if exists "users_update_self" on public.users;
create policy "users_update_self" on public.users for update to authenticated using (auth.uid() = id);

-- 2. channels
create table if not exists public.channels (
  id text primary key,
  name text not null,
  kind text not null check (kind in ('channel','dm')),
  is_private boolean not null default false,
  topic text,
  dm_members uuid[] default '{}'::uuid[],
  created_at timestamptz not null default now()
);
create index if not exists channels_dm_members_idx on public.channels using gin (dm_members);
alter table public.channels enable row level security;
drop policy if exists "channels_select_authenticated" on public.channels;
create policy "channels_select_authenticated" on public.channels for select to authenticated using (true);
drop policy if exists "channels_insert_authenticated" on public.channels;
create policy "channels_insert_authenticated" on public.channels for insert to authenticated with check (true);

-- 3. messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  channel_id text not null references public.channels(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete cascade,
  body text not null,
  parent_message_id uuid references public.messages(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists messages_channel_created_idx on public.messages (channel_id, created_at);
create index if not exists messages_parent_idx on public.messages (parent_message_id);
alter table public.messages enable row level security;
drop policy if exists "messages_select_authenticated" on public.messages;
create policy "messages_select_authenticated" on public.messages for select to authenticated using (true);
drop policy if exists "messages_insert_self" on public.messages;
create policy "messages_insert_self" on public.messages for insert to authenticated with check (auth.uid() = author_id);

-- 4. signup trigger
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  colors text[] := array['#E01E5A','#2BAC76','#ECB22E','#1164A3','#4A154B','#3F0E40'];
begin
  insert into public.users (id, name, display_name, avatar_color)
  values (
    new.id,
    coalesce(split_part(new.email, '@', 1), 'user'),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'User'),
    colors[1 + floor(random() * array_length(colors, 1))::int]
  );
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- 5. Realtime
alter table public.messages replica identity full;
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;

-- 6. seed channels
insert into public.channels (id, name, kind, is_private, topic) values
  ('c_general',     'general',     'channel', false, 'Company-wide announcements and work-based matters'),
  ('c_random',      'random',      'channel', false, 'Non-work banter and water cooler conversation'),
  ('c_engineering', 'engineering', 'channel', false, 'Engineering team discussions'),
  ('c_design',      'design',      'channel', false, 'Design reviews & feedback'),
  ('c_frontend',    'frontend',    'channel', false, 'Frontend tech & UI'),
  ('c_proj-launch', 'proj-launch', 'channel', true,  'Private launch coordination')
on conflict (id) do nothing;

-- 7. backfill profiles for existing auth users
insert into public.users (id, name, display_name, avatar_color)
select
  au.id,
  coalesce(split_part(au.email, '@', 1), 'user'),
  coalesce(au.raw_user_meta_data->>'display_name', split_part(au.email, '@', 1), 'User'),
  (array['#E01E5A','#2BAC76','#ECB22E','#1164A3','#4A154B','#3F0E40'])[1 + floor(random() * 6)::int]
from auth.users au
left join public.users pu on pu.id = au.id
where pu.id is null;

-- 8. Force PostgREST schema cache reload
notify pgrst, 'reload schema';
`;

const res = await fetch(
  `https://api.supabase.com/v1/projects/${REF}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: SQL }),
  },
);

const text = await res.text();
console.log(`HTTP ${res.status}`);
console.log(text.slice(0, 2000));
if (!res.ok) process.exit(1);
