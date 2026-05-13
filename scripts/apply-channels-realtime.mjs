// channels テーブルを Realtime publication に追加する一発スクリプト
// 使い方: node --env-file=.env.local scripts/apply-channels-realtime.mjs

const PAT = process.env.SUPABASE_ACCESS_TOKEN;
const REF = process.env.SUPABASE_PROJECT_REF || "axddcekekdejbckeppww";

if (!PAT) {
  console.error("SUPABASE_ACCESS_TOKEN が未設定");
  process.exit(1);
}

const SQL = String.raw`
alter table public.channels replica identity full;
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'channels'
  ) then
    alter publication supabase_realtime add table public.channels;
  end if;
end $$;
notify pgrst, 'reload schema';
`;

const res = await fetch(
  `https://api.supabase.com/v1/projects/${REF}/database/query`,
  {
    method: "POST",
    headers: { Authorization: `Bearer ${PAT}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: SQL }),
  },
);
console.log(`HTTP ${res.status}`);
console.log((await res.text()).slice(0, 500));
if (!res.ok) process.exit(1);
