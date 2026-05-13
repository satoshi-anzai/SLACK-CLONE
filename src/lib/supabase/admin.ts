import { createClient } from "@supabase/supabase-js";

/**
 * Admin (service-role) Supabase client. **SERVER ONLY**.
 * 絶対に Client Component や NEXT_PUBLIC_* で参照しないこと。
 * RLS をバイパスし、auth.admin 系メソッドが使える。
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
