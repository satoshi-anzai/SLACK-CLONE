"use server";

import { createAdminClient } from "@/lib/supabase/admin";

interface EnsureTestUserArgs {
  email: string;
  password: string;
  displayName: string;
}

/**
 * テスト用ユーザーを Admin API で確実に作成する (なければ作る、あれば no-op)。
 * email_confirm: true で確認メール送信をスキップ → email rate limit 回避。
 */
export async function ensureTestUser(
  args: EnsureTestUserArgs,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createAdminClient();

  const { error } = await admin.auth.admin.createUser({
    email: args.email,
    password: args.password,
    email_confirm: true,
    user_metadata: { display_name: args.displayName },
  });

  if (!error) return { ok: true };

  // 既存ユーザーは成功扱い
  const msg = error.message.toLowerCase();
  if (
    msg.includes("already") ||
    msg.includes("registered") ||
    msg.includes("exists")
  ) {
    return { ok: true };
  }

  return { ok: false, error: error.message };
}
