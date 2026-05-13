/**
 * Supabase の error は様々な形 (PostgrestError / AuthError / Error / プレーン object) を取り、
 * console.error にそのまま渡すと `{}` になるケースがある。
 * 全フィールドを explicit に取り出して出力する。
 */
export function logSupabaseError(label: string, error: unknown) {
  if (!error) return;
  const e = error as Record<string, unknown>;
  const out: Record<string, unknown> = {
    type: typeof error,
    ctor: (error as { constructor?: { name?: string } })?.constructor?.name,
    keys: typeof error === "object" ? Object.keys(e) : [],
    name: e.name,
    code: e.code,
    status: e.status,
    statusCode: e.statusCode,
    message: e.message,
    details: e.details,
    hint: e.hint,
    cause: e.cause,
    string: String(error),
  };
  // JSON 化できるなら raw も
  try {
    out.json = JSON.parse(JSON.stringify(error));
  } catch {
    /* ignore */
  }
  console.error(label, out);
}
