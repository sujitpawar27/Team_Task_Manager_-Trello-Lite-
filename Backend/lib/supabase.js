import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
// Prefer service role key for server-side operations, fall back to anon if absent
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase env vars missing: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/ANON_KEY"
  );
}

// Server-side client using service role when available
export const supabase = createClient(supabaseUrl, supabaseKey);

export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || null;
};
